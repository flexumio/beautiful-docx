import { IParagraphOptions } from 'docx';
import { Element, Node } from 'himalaya';
import { DEFAULT_NUMBERING_REF } from '../DocumentBuilder';
import { ListItem } from './ListItem';
import { Paragraph } from './Paragraph';
import { TextType, IText, TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class List implements IText {
  type: TextType = 'list';
  content: IText[];
  options: IParagraphOptions;

  constructor(element: Element, private level: number) {
    switch (element.tagName) {
      case 'ul': {
        this.options = { bullet: { level } };
        this.content = this.getList(element.children);
        break;
      }
      case 'ol': {
        this.options = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };
        this.content = this.getList(element.children);
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

      return new TextBlock({}, new TextInline(child).getContent()).getContent();
    });
  }

  getContent() {
    return this.content;
  }

  transformToDocx() {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
