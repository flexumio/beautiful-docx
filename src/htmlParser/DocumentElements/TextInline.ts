import { Element, Node, Attribute } from 'himalaya';
import { ExternalHyperlink, IRunOptions, ParagraphChild, ShadingType, TextRun, UnderlineType } from 'docx';

import { cleanTextContent, getAttributeMap, parseStyles } from '../utils';

import { InlineTextType, DocumentElement } from './DocumentElement';
import { ColorTranslator } from 'colortranslator';

const LINK_TEXT_COLOR = '2200CC';

export const supportedTextTypes: InlineTextType[] = [
  'br',
  'text',
  'strong',
  'i',
  'u',
  's',
  'del',
  'a',
  'b',
  'em',
  'span',
  'sub',
  'sup',
];

const inlineTextOptionsDictionary: { [key in InlineTextType]: IRunOptions } = {
  br: { break: 1 },
  text: {},
  strong: { bold: true },
  b: { bold: true },
  em: { italics: true },
  i: { italics: true },
  u: { underline: { type: UnderlineType.SINGLE } },
  s: { strike: true },
  del: { strike: true },
  a: {
    color: LINK_TEXT_COLOR,
    underline: { type: UnderlineType.SINGLE },
  },
  span: {},
  sup: { superScript: true },
  sub: { subScript: true },
};

export class TextInline implements DocumentElement {
  type: InlineTextType;
  content: (string | DocumentElement)[];
  isEmpty = false;

  constructor(private element: Node & { attributes?: [Attribute] | undefined }, public options: IRunOptions = {}) {
    if (this.element.type === 'text') {
      this.content = [this.element.content];
      this.type = 'text';
      this.isEmpty = this.element.content.trim() === '';
      return;
    }

    if (this.element.type !== 'element') {
      this.content = [];
      this.type = 'text';
      return;
    }

    if (!supportedTextTypes.includes(this.element.tagName as InlineTextType)) {
      throw new Error(`Unsupported ${this.element.tagName} tag`);
    }

    this.options = {
      color: this.textColor,
      shading: this.textShading,
      ...this.options,
      ...inlineTextOptionsDictionary[this.element.tagName as InlineTextType],
    };

    this.content = this.element.children.flatMap(i => {
      return new TextInline(i, this.options).getContent();
    });

    this.type = this.element.tagName as InlineTextType;
  }

  getContent() {
    return [this];
  }

  transformToDocx(): ParagraphChild[] {
    if (this.type === 'br') {
      return [new TextRun(this.options)];
    }

    return this.content.flatMap(content => {
      if (typeof content === 'string') {
        return [new TextRun({ text: cleanTextContent(content), ...this.options })];
      } else {
        if (this.type === 'a') {
          const element = this.element as Element;
          return [
            new ExternalHyperlink({
              link: element.attributes.find(item => item.key === 'href')?.value || '',
              children: element.children.flatMap(child =>
                new TextInline(child, {
                  ...this.options,
                }).transformToDocx()
              ),
            }),
          ];
        }
        return content.transformToDocx();
      }
    });
  }

  private get textColor() {
    if (!this.element.attributes) return undefined;
    const textAttr = getAttributeMap(this.element.attributes);
    const styles = parseStyles(textAttr['style']);
    const color = styles['color'];
    if (color) {
      const textColorTranslator = new ColorTranslator(color);
      return textColorTranslator.HEX;
    }
    return undefined;
  }
  private get textShading() {
    if (!this.element.attributes) return undefined;
    const textAttr = getAttributeMap(this.element.attributes);
    const styles = parseStyles(textAttr['style']);
    const backgroundColor = styles['background-color'];
    const color = styles['color'];
    if (backgroundColor || color) {
      const shading = {
        fill: 'auto',
        color: 'auto',
        type: ShadingType.CLEAR,
      };
      if (backgroundColor) {
        const backgroundColorTranslator = new ColorTranslator(backgroundColor);
        shading.fill = backgroundColorTranslator.HEX;
      }
      if (color) {
        const textColorTranslator = new ColorTranslator(color);
        shading.color = textColorTranslator.HEX;
      }
      return shading;
    }
    return undefined;
  }
}
