import { Paragraph } from 'docx';
import { DocumentElement, DocumentElementType } from './DocumentElement';

export class EmptyLine implements DocumentElement {
  type: DocumentElementType = 'empty-line';

  getContent(): DocumentElement[] {
    return [this];
  }

  transformToDocx() {
    return [new Paragraph({})];
  }
}
