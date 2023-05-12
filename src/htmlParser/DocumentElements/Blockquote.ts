import { BorderStyle, convertMillimetersToTwip, Paragraph, ParagraphChild } from 'docx';
import { DocxExportOptions, IParagraphOptions } from '../../options';
import { Element, Node } from 'himalaya';
import { TextInline } from './TextInline';
import { parseTextAlignment } from '../utils';
import { BlockTextType, DocumentElement } from './DocumentElement';
import { TextBlock } from './TextBlock';

const BLOCKQUOTE_SIZE = 25;
const BLOCKQUOTE_COLOR = '#cccccc';
const BLOCKQUOTE_SPACE = 12;

export class Blockquote implements DocumentElement {
  public type: BlockTextType = 'blockquote';
  public options: IParagraphOptions;
  private readonly content: DocumentElement[];

  constructor(private element: Element, private readonly exportOptions: DocxExportOptions) {
    this.options = {
      alignment: parseTextAlignment(element.attributes),
      border: {
        left: { style: BorderStyle.SINGLE, size: BLOCKQUOTE_SIZE, color: BLOCKQUOTE_COLOR, space: BLOCKQUOTE_SPACE },
      },
      indent: { left: convertMillimetersToTwip(6) },
    };
    this.content = this.createContent(this.element);
  }

  private createContent(element: Element) {
    const children = this.parseChildren(element);

    return children.flatMap(node => {
      return new TextBlock(this.options, this.createInlineChild(node), this.exportOptions).getContent();
    });
  }

  private parseChildren(element: Element): Node[] {
    return element.children.flatMap(i => {
      const isElement = i.type === 'element';
      return isElement ? this.parseChildren(i) : i;
    }, this);
  }

  private createInlineChild(node: Node): TextInline[] {
    return new TextInline(node, {
      italics: true,
    }).getContent();
  }

  getContent() {
    return this.content;
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
