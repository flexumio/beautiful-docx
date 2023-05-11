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
    this.content = this.createContent();
  }

  private createContent() {
    return this.element.children.flatMap(node => {
      const isElement = node.type === 'element';

      return new TextBlock(
        this.options,
        isElement ? node.children.flatMap(this.createInlineChild) : this.createInlineChild(node),
        this.exportOptions
      ).getContent();
    });
  }

  private createInlineChild(node: Node) {
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
