import { HeadingLevel, ImageRun, Paragraph, Table } from 'docx';
import { Element, Node, parse } from 'himalaya';
import { DocxExportOptions } from '../options';
import { ParseResult } from './common';
import {
  parseBlockquote,
  parseFigure,
  parseHeader,
  parseList,
  parseParagraph,
  parseParagraphChild,
} from './docxHtmlParser';
import { ImagesAdapter } from './ImagesAdapter';

export class HtmlParser {
  constructor(public options: DocxExportOptions) {}

  async parse(content: string) {
    const parsedContent = parse(content);

    await this.setImages(parsedContent);

    const docxTree = this.parseHtmlTree(parsedContent);

    return this.postProcess(docxTree);
  }

  async setImages(content: Node[]) {
    const images = await new ImagesAdapter().downloadImages(content);
    this.options = { ...this.options, images: images };
  }

  parseHtmlTree(root: Node[]) {
    const paragraphs: ParseResult[] = [];
    let pCounts = 0;

    for (const child of root) {
      if (child.type !== 'element') {
        continue;
      }

      const topLevelElement = this.parseTopLevelElement(child, pCounts);
      paragraphs.push(...topLevelElement);

      if (child.tagName === 'p') {
        pCounts++;
      }
    }

    return paragraphs;
  }

  private parseTopLevelElement = (element: Element, pIndex: number): ParseResult[] => {
    switch (element.tagName) {
      case 'p':
        return parseParagraph(element, pIndex, this.options);
      case 'strong':
      case 'i':
      case 'u':
      case 's':
        return [new Paragraph({ children: parseParagraphChild(element) })];
      case 'h1':
        return parseHeader(element, HeadingLevel.HEADING_1);
      case 'h2':
        return parseHeader(element, HeadingLevel.HEADING_2);
      case 'h3':
        return parseHeader(element, HeadingLevel.HEADING_3);
      case 'h4':
        return parseHeader(element, HeadingLevel.HEADING_4);
      case 'ul':
      case 'ol':
        return parseList(element, 0);
      case 'figure':
        return parseFigure(element, this.options);
      case 'blockquote':
        return parseBlockquote(element);
      default:
        throw new Error(`Unsupported top tag ${element.tagName}`);
    }
  };

  postProcess(docxTree: ParseResult[]) {
    const results: (Paragraph | Table)[] = [];

    let iterator = 0;

    while (iterator < docxTree.length) {
      const currentItem = docxTree[iterator];
      const nextItem = docxTree[iterator + 1];

      const isCurrentItemImage = currentItem instanceof ImageRun;
      const isNextItemParagraph = nextItem instanceof Paragraph;

      if (isCurrentItemImage && isNextItemParagraph) {
        nextItem.addChildElement(currentItem);
        results.push(nextItem);
        iterator += 2;
        continue;
      }

      if (isCurrentItemImage && !isNextItemParagraph) {
        results.push(new Paragraph({ children: [currentItem] }));
        iterator += 1;
        continue;
      }

      results.push(currentItem);
      iterator += 1;
    }

    return results;
  }
}
