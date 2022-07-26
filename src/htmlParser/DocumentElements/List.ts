import { IParagraphOptions } from 'docx';
import { Element, Node } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from '../../DocumentBuilder';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { ListItem } from './ListItem';

import { TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class List implements DocumentElement {
  type: DocumentElementType = 'list';
  public children: DocumentElement[];
  private options: IParagraphOptions;

  constructor(element: Element, private level: number) {
    switch (element.tagName) {
      case 'ul': {
        this.options = { bullet: { level } };
        this.children = this.getList(element.children);
        break;
      }
      case 'ol': {
        this.options = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
        this.children = this.getList(element.children);
        break;
      }
      default:
        throw new Error(`Unsupported list type ${element.tagName}`);
    }
  }

  private getList(children: Node[]) {
    return children.flatMap(child => {
      if (child.type === 'element') {
        return new ListItem(child, this.options, this.level).getContent();
      }
      const textContent = new TextInline(child).getContent();
      return new TextBlock({}, textContent).getContent();
    });
  }

  getContent() {
    return this.children;
  }

  transformToDocx() {
    return this.children.flatMap(i => i.transformToDocx());
  }
}
