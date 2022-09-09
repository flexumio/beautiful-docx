import { HeadingLevel } from 'docx';
import { Element, Node, parse } from 'himalaya';
import { DocxExportOptions } from '../options';
import {
  Blockquote,
  DocumentElement,
  Figure,
  Header,
  Image,
  List,
  PageBreak,
  Paragraph,
  TableCreator,
  TextBlock,
  TextInline,
} from './DocumentElements';

import { ImagesAdapter } from './ImagesAdapter';
import { TableOfContents } from './DocumentElements/TableOfContents';

export class HtmlParser {
  constructor(public options: DocxExportOptions) {}

  async parse(content: string) {
    const parsedContent = parse(content);

    await this.setImages(parsedContent);

    return this.parseHtmlTree(parsedContent);
  }

  async setImages(content: Node[]) {
    const images = await new ImagesAdapter(this.options.images).downloadImages(content);

    this.options = { ...this.options, images };
  }

  parseHtmlTree(root: Node[]) {
    const paragraphs: DocumentElement[] = [];
    let pCounts = 0;

    for (const child of root) {
      switch (child.type) {
        case 'text': {
          paragraphs.push(...new TextBlock({}, new TextInline(child).getContent()).getContent());
          break;
        }
        case 'element': {
          const topLevelElement = this.parseTopLevelElement(child, pCounts);
          paragraphs.push(...topLevelElement);

          if (child.tagName === 'p') {
            pCounts++;
          }
          break;
        }
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
        return new List(element, 0, this.options).getContent();
      case 'figure':
        return new Figure(element, this.options).getContent();
      case 'table':
        return new TableCreator(element, this.options).getContent();
      case 'img':
        return new Image(this.coverWithFigure(element), this.options).getContent();
      case 'blockquote':
        return new Blockquote(element).getContent();
      case 'div':
      case 'article':
      case 'section':
        return this.parseHtmlTree(element.children);
      case 'page-break':
        return new PageBreak().getContent();
      case 'table-of-contents':
        return new TableOfContents().getContent();
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
