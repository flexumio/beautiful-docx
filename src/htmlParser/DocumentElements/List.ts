import { DocxExportOptions, IParagraphOptions } from '../../options';

import { Element, Node } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from './Document';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { ListItem } from './ListItem';

import { TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class List implements DocumentElement {
  type: DocumentElementType = 'list';
  public children: DocumentElement[];
  public childrenOptions: IParagraphOptions;

  constructor(element: Element, private level: number, private readonly exportOptions: DocxExportOptions) {
    switch (element.tagName) {
      case 'ul': {
        this.childrenOptions = { bullet: { level } };
        this.children = this.getList(element.children);
        break;
      }
      case 'ol': {
        this.childrenOptions = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
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
        return new ListItem(child, this.childrenOptions, this.level, this.exportOptions).getContent();
      }
      const textContent = new TextInline(child).getContent();
      return new TextBlock({}, textContent, this.exportOptions).getContent();
    });
  }

  getContent() {
    return this.children;
  }

  transformToDocx() {
    return this.children.flatMap(i => i.transformToDocx());
  }
}
