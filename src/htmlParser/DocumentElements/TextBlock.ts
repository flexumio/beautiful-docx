import { IParagraphOptions, Paragraph } from 'docx';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TextInline } from './TextInline';

export class TextBlock implements DocumentElement {
  type: DocumentElementType = 'text';

  constructor(public options: IParagraphOptions, public children: DocumentElement[] = []) {
    this.children = children.filter(i => !(i instanceof TextInline && i.isEmpty));
  }

  getContent(): DocumentElement[] {
    if (this.children.length === 0) {
      return [];
    }
    return [this];
  }

  transformToDocx() {
    if (this.children.length === 0) {
      return [];
    }
    return [
      new Paragraph({
        ...this.options,
        children: this.children.flatMap(i => i.transformToDocx()),
      }),
    ];
  }
}
