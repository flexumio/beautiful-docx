import { HeadingLevel } from 'docx';
import { Element, Node, parse } from 'himalaya';
import { DocxExportOptions } from '../options';
import { Figure, Header, Image, List, Paragraph, TableCreator, TextBlock, TextInline } from './DocumentElements';
import { Blockquote } from './DocumentElements/Blockquote';
import { DocumentElement } from './DocumentElements/DocumentElement';
import { ImagesAdapter } from './ImagesAdapter';

export class HtmlParser {
  constructor(public options: DocxExportOptions) {}

  async parse(content: string) {
    const parsedContent = parse(content);

    await this.setImages(parsedContent);

    const docxTree = this.parseHtmlTree(parsedContent);

    return docxTree;
  }

  async setImages(content: Node[]) {
    const images = await new ImagesAdapter().downloadImages(content);
    this.options = { ...this.options, images: images };
  }

  parseHtmlTree(root: Node[]) {
    const paragraphs: DocumentElement[] = [];
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

  parseTopLevelElement = (element: Element, pIndex: number) => {
    switch (element.tagName) {
      case 'p':
        return new Paragraph(element, pIndex, this.options).getContent();
      case 'strong':
      case 'i':
      case 'u':
      case 's':
      case 'br':
        return new TextBlock({}, new TextInline(element).getContent()).getContent();
      case 'h1':
        return new Header(element, HeadingLevel.HEADING_1).getContent();
      case 'h2':
        return new Header(element, HeadingLevel.HEADING_2).getContent();
      case 'h3':
        return new Header(element, HeadingLevel.HEADING_3).getContent();
      case 'h4':
        return new Header(element, HeadingLevel.HEADING_4).getContent();
      case 'ul':
      case 'ol':
        return new List(element, 0).getContent();
      case 'figure':
        return new Figure(element, this.options).getContent();
      case 'table':
        return new TableCreator(element, this.options).getContent();
      case 'img':
        return new Image(this.coverWithFigure(element), this.options).getContent();
      case 'blockquote':
        return new Blockquote(element).getContent();
      default:
        throw new Error(`Unsupported top tag ${element.tagName}`);
    }
  };

  private coverWithFigure(node: Node) {
    const figureHtml = `<figure></figure>`;
    const element = parse(figureHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;
    element.children = [node];
    return element;
  }
}
