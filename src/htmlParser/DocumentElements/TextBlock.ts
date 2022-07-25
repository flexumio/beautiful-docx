import { IParagraphOptions, Paragraph } from 'docx';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TextInline } from './TextInline';

export class TextBlock implements DocumentElement {
  type: DocumentElementType = 'paragraph';

  constructor(private options: IParagraphOptions, public children: DocumentElement[] = []) {
    this.children = children.filter(i => !(i instanceof TextInline && i.isEmpty));
  }

  getContent(): DocumentElement[] {
    if (this.children.length === 0) {
      return [];
    }
    return [this];
  }

  transformToDocx() {
    return [
      new Paragraph({
        ...this.options,
        children: this.children.flatMap(i => i.transformToDocx()),
      }),
    ];
  }
}
