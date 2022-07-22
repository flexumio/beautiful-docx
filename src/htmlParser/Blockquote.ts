import { BorderStyle, convertMillimetersToTwip, IParagraphOptions, Paragraph, ParagraphChild } from 'docx';
import { Element } from 'himalaya';
import { TextInline } from './TextInline';
import { BlockTextType, IText, TextBlock } from './TextBlock';
import { parseTextAlignment } from './utils';

const BLOCKQUOTE_SIZE = 25;
const BLOCKQUOTE_COLOR = '#cccccc';
const BLOCKQUOTE_SPACE = 12;

export class Blockquote implements IText {
  type: BlockTextType = 'blockquote';
  content: IText[];
  options: IParagraphOptions;

  constructor(element: Element) {
    this.options = {
      alignment: parseTextAlignment(element.attributes),
      border: {
        left: { style: BorderStyle.SINGLE, size: BLOCKQUOTE_SIZE, color: BLOCKQUOTE_COLOR, space: BLOCKQUOTE_SPACE },
      },
      indent: { left: convertMillimetersToTwip(6) },
    };
    this.content = element.children.flatMap(node => {
      const block = new TextBlock(
        this.options,
        node.type === 'element'
          ? node.children.flatMap(child =>
              new TextInline(child, {
                italics: true,
              }).getContent()
            )
          : new TextInline(node, { italics: true }).getContent()
      ).getContent();

      return block;
    });
  }

  getContent() {
    return this.content;
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
