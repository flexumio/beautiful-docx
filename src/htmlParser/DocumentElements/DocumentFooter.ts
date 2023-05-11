import { AlignmentType, Footer, PageNumber, Paragraph } from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';
import { TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class DocumentFooter {
  children: DocumentElement[];
  constructor(exportOptions: DocxExportOptions) {
    if (exportOptions.page.numbering) {
      this.children = new TextBlock(
        { alignment: AlignmentType.CENTER },
        new TextInline({ type: 'text', content: 'Number' }, { children: ['1'] }).getContent(),
        exportOptions
      ).getContent();
    } else {
      this.children = [];
    }
  }

  transformToDocx() {
    return new Footer({ children: this.children.flatMap(i => i.transformToDocx() as Paragraph[]) });
  }
}
