import { IParagraphOptions } from 'docx';
import { Node } from 'himalaya';
import { TextInline } from './TextInline';
import { List } from './List';
import { TextBlock } from './TextBlock';
import { isListTag, parseTextAlignment } from './utils';

export class ListItem extends TextBlock<ListItem> {
  nestedLists: ListItem[] = [];

  constructor(element: Node, options: IParagraphOptions, level: number) {
    if (!(element.type === 'element' && element.tagName === 'li')) {
      throw new Error('The child of list should be list item');
    }

    const liOptions: IParagraphOptions = {
      ...options,
      alignment: parseTextAlignment(element.attributes),
      children: [],
    };

    element.children.forEach(child => {
      if (child.type === 'element' && isListTag(child.tagName)) {
        this.nestedLists.push(...new List(child, level + 1).getContent());
      } else {
        liOptions.children?.push(...new TextInline(child).getContent());
      }
    });

    super(options);
    this.content = [this, ...this.nestedLists];
  }
}
