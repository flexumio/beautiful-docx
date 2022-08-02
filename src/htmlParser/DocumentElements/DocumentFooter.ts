import { AlignmentType, Footer, PageNumber, Paragraph } from 'docx';
import { DocumentElement } from './DocumentElement';
import { TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class DocumentFooter {
  children: DocumentElement[];
  constructor() {
    this.children = new TextBlock(
      { alignment: AlignmentType.CENTER },
      new TextInline({ type: 'text', content: 'Number' }, { children: [PageNumber.CURRENT] }).getContent()
    ).getContent();
  }

  transformToDocx() {
    return new Footer({ children: this.children.flatMap(i => i.transformToDocx() as Paragraph[]) });
  }
}
