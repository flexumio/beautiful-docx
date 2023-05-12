import { Footer, PageNumber, Paragraph } from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';
import { TextBlock } from './TextBlock';
import { TextInline } from './TextInline';

export class DocumentFooter {
  children: DocumentElement[];
  constructor(exportOptions: DocxExportOptions) {
    if (!exportOptions.page.numbering) {
      this.children = [];
    } else {
      this.children = new TextBlock(
        { alignment: exportOptions.page.numbering.align },
        new TextInline({ type: 'text', content: 'Number' }, { children: [PageNumber.CURRENT] }).getContent(),
        exportOptions
      ).getContent();
    }
  }

  transformToDocx() {
    return new Footer({ children: this.children.flatMap(i => i.transformToDocx() as Paragraph[]) });
  }
}
