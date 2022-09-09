import { PageBreak as DocxPageBreak, Paragraph } from 'docx';
import { DocumentElement, PageBreakType } from './DocumentElement';

export class PageBreak implements DocumentElement {
  type: PageBreakType = 'page-break';

  getContent(): DocumentElement[] {
    return [this];
  }

  transformToDocx() {
    return [new Paragraph({ children: [new DocxPageBreak()] })];
  }
}
