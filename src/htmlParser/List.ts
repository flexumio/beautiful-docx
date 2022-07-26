import { IParagraphOptions } from 'docx';
import { Element } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from '../DocumentBuilder';
import { DocxFragment } from './DocxFragment';
import { ListItem } from './ListItem';

export class List implements DocxFragment<ListItem> {
  content: ListItem[];

  constructor(element: Element, level: number) {
    switch (element.tagName) {
      case 'ul': {
        const option: IParagraphOptions = { bullet: { level } };
        this.content = element.children.flatMap(child => new ListItem(child, option, level).getContent());
        break;
      }
      case 'ol': {
        const option: IParagraphOptions = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
        this.content = element.children.flatMap(child => new ListItem(child, option, level).getContent());
        break;
      }
      default:
        throw new Error(`Unsupported list type ${element.tagName}`);
    }
  }

  getContent() {
    return this.content;
  }
}
