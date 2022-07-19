import { Node } from 'himalaya';
import { ExternalHyperlink, IRunOptions, ParagraphChild, TextRun, UnderlineType } from 'docx';

import { cleanTextContent } from './utils';
import { DocxFragment } from './DocxFragment';

export class TextInline implements DocxFragment<ParagraphChild> {
  content: ParagraphChild[];
  constructor(element: Node, options: IRunOptions = {}) {
    if (element.type === 'text') {
      this.content = [new TextRun({ text: cleanTextContent(element.content), ...options })];
      return;
    }

    if (element.type !== 'element') {
      this.content = [];
      return;
    }

    switch (element.tagName) {
      case 'br': {
        this.content = [new TextRun({ break: 1 })];
        break;
      }
      case 'strong': {
        this.content = element.children.flatMap(child =>
          new TextInline(child, { ...options, bold: true }).getContent()
        );
        break;
      }
      case 'i': {
        this.content = element.children.flatMap(child =>
          new TextInline(child, { ...options, italics: true }).getContent()
        );
        break;
      }
      case 'u': {
        this.content = element.children.flatMap(child =>
          new TextInline(child, {
            ...options,
            underline: { type: UnderlineType.SINGLE },
          }).getContent()
        );
        break;
      }
      case 's': {
        this.content = element.children.flatMap(child =>
          new TextInline(child, {
            ...options,
            strike: true,
          }).getContent()
        );
        break;
      }
      case 'a': {
        this.content = [
          new ExternalHyperlink({
            link: element.attributes.find(item => item.key === 'href')?.value || '',
            children: element.children.flatMap(child =>
              new TextInline(child, {
                ...options,
              }).getContent()
            ),
          }),
        ];
        break;
      }
      default: {
        throw new Error(`Unsupported ${element.tagName} tag`);
      }
    }
  }

  getContent() {
    return this.content;
  }
}
