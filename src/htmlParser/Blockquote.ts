import { BorderStyle, convertMillimetersToTwip, IParagraphOptions } from 'docx';
import { Element } from 'himalaya';
import { TextInline } from './TextInline';
import { TextBlock } from './TextBlock';
import { parseTextAlignment } from './utils';
import { DocxFragment } from './DocxFragment';

const BLOCKQUOTE_SIZE = 25;
const BLOCKQUOTE_COLOR = '#cccccc';
const BLOCKQUOTE_SPACE = 12;

export class Blockquote implements DocxFragment<TextBlock> {
  content: TextBlock[];

  constructor(element: Element) {
    this.content = element.children.map(node => {
      const options: IParagraphOptions = {
        alignment: parseTextAlignment(element.attributes),

        border: {
          left: { style: BorderStyle.SINGLE, size: BLOCKQUOTE_SIZE, color: BLOCKQUOTE_COLOR, space: BLOCKQUOTE_SPACE },
        },
        indent: { left: convertMillimetersToTwip(6) },
      };
      return new TextBlock(
        options,
        node.type === 'element'
          ? node.children.flatMap(child =>
              new TextInline(child, {
                italics: true,
              }).getContent()
            )
          : new TextInline(node).getContent()
      );
    });
  }

  getContent() {
    return this.content;
  }
}
