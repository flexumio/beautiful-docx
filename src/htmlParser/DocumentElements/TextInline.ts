import { Element, Node } from 'himalaya';
import { ExternalHyperlink, IRunOptions, ParagraphChild, TextRun, UnderlineType } from 'docx';

import { cleanTextContent } from '../utils';

import { InlineTextType, DocumentElement } from './DocumentElement';

const supportedTextTypes: InlineTextType[] = ['br', 'text', 'strong', 'i', 'u', 's', 'a', 'b', 'em'];

const inlineTextOptionsDictionary: { [key in InlineTextType]: IRunOptions } = {
  br: { break: 1 },
  text: {},
  strong: { bold: true },
  b: { bold: true },
  em: { italics: true },
  i: { italics: true },
  u: { underline: { type: UnderlineType.SINGLE } },
  s: { strike: true },
  a: {},
};

export class TextInline implements DocumentElement {
  type: InlineTextType;
  private content: (string | DocumentElement)[];
  isEmpty = false;

  constructor(private element: Node, public options: IRunOptions = {}) {
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

    this.options = { ...this.options, ...inlineTextOptionsDictionary[this.element.tagName as InlineTextType] };

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
}
