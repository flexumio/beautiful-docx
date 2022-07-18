import { ImageRun, Paragraph, Table } from 'docx';
import { Node, parse } from 'himalaya';
import { DocxExportOptions } from '../options';
import { ParseResult } from './common';
import { parseTopLevelElement } from './docxHtmlParser';
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

      const topLevelElement = parseTopLevelElement(child, pCounts, this.options);
      paragraphs.push(...topLevelElement);

      if (child.tagName === 'p') {
        pCounts++;
      }
    }

    return paragraphs;
  }

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
