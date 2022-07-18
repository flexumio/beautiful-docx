import { IParagraphOptions } from 'docx';
import { Element } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from '../DocumentBuilder';
import { ListItem } from './ListItem';

export class List {
  private children: ListItem[];
  constructor(element: Element, level: number) {
    switch (element.tagName) {
      case 'ul': {
        const option: IParagraphOptions = { bullet: { level } };
        this.children = element.children.flatMap(child => new ListItem(child, option, level).getElements());
        break;
      }
      case 'ol': {
        const option: IParagraphOptions = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
        this.children = element.children.flatMap(child => new ListItem(child, option, level).getElements());
        break;
      }
      default:
        throw new Error(`Unsupported list type ${element.tagName}`);
    }
  }

  getChildren() {
    return this.children;
  }
}
