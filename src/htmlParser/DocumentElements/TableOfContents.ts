import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TableOfContents as DocxTableOfContents } from 'docx';

export class TableOfContents implements DocumentElement {
  type: DocumentElementType = 'table-of-contents';

  getContent(): DocumentElement[] {
    return [this];
  }

  transformToDocx() {
    return [
      new DocxTableOfContents('Table of Contents', {
        hyperlink: true,
        headingStyleRange: '1-4',
      }),
    ];
  }
}
