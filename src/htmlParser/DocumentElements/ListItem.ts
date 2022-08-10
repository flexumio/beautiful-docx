import { IParagraphOptions } from 'docx';
import { Node } from 'himalaya';
import { TextInline } from './TextInline';
import { List } from './List';
import { TextBlock } from './TextBlock';
import { isListTag, parseTextAlignment } from '../utils';
import { DocumentElement, DocumentElementType } from './DocumentElement';

export class ListItem extends TextBlock {
  type: DocumentElementType = 'list-item';
  private nestedLists: DocumentElement[] = [];

  constructor(element: Node, options: IParagraphOptions, level: number) {
    if (!(element.type === 'element' && element.tagName === 'li')) {
      throw new Error('The child of list should be list item');
    }

    const liOptions: IParagraphOptions = {
      ...options,
      alignment: parseTextAlignment(element.attributes),
    };

    const children: DocumentElement[] = [];

    element.children.forEach(child => {
      if (child.type === 'element' && isListTag(child.tagName)) {
        this.nestedLists.push(...new List(child, level + 1).getContent());
      } else {
        children.push(...new TextInline(child).getContent());
      }
    });

    super(liOptions, children);
  }

  getContent(): DocumentElement[] {
    return [this, ...this.nestedLists];
  }
}
