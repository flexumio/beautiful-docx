import { IParagraphOptions, Paragraph } from 'docx';
import { Element } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from '../DocumentBuilder';
import { ListItem } from './ListItem';
import { TextType, IText } from './TextBlock';

export class List implements IText {
  type: TextType = 'list';
  content: IText[];
  options: IParagraphOptions;

  constructor(element: Element, level: number) {
    switch (element.tagName) {
      case 'ul': {
        this.options = { bullet: { level } };
        this.content = element.children.flatMap(child => new ListItem(child, this.options, level).getContent());
        break;
      }
      case 'ol': {
        this.options = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
        this.content = element.children.flatMap(child => new ListItem(child, this.options, level).getContent());
        break;
      }
      default:
        throw new Error(`Unsupported list type ${element.tagName}`);
    }
  }

  getContent() {
    return this.content;
  }

  transformToDocx() {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
