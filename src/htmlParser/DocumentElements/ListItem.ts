import { IParagraphOptions, Paragraph } from 'docx';
import { Node } from 'himalaya';
import { TextInline } from './TextInline';
import { List } from './List';
import { TextBlock } from './TextBlock';
import { isListTag, parseTextAlignment } from '../utils';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { isInlineTextElement } from './Table/utils';
import { HtmlParser } from '../HtmlParser';
import { defaultExportOptions } from '../../options';

export class ListItem extends TextBlock {
  type: DocumentElementType = 'list-item';
  private readonly nestedElements: DocumentElement[] = [];

  constructor(element: Node, options: IParagraphOptions, level: number) {
    if (!(element.type === 'element' && element.tagName === 'li')) {
      throw new Error('The child of list should be list item');
    }

    const liOptions: IParagraphOptions = {
      ...options,
      alignment: parseTextAlignment(element.attributes),
    };

    const children: DocumentElement[] = [];
    const nestedElements: DocumentElement[] = [];

    element.children.forEach(child => {
      if (isInlineTextElement(child)) {
        children.push(...new TextInline(child).getContent());
        return;
      }

      if (child.type === 'element' && isListTag(child.tagName)) {
        nestedElements.push(...new List(child, level + 1).getContent());
        return;
      }

      nestedElements.push(...new HtmlParser(defaultExportOptions).parseHtmlTree([child]));
    });

    super(liOptions, children);
    this.nestedElements = nestedElements;
  }

  getContent(): DocumentElement[] {
    return [this];
  }

  transformToDocx() {
    return [
      new Paragraph({
        ...this.options,
        children: this.children.flatMap(i => i.transformToDocx()),
      }),
      ...this.nestedElements.flatMap(i => i.transformToDocx() as Paragraph[]),
    ];
  }
}
