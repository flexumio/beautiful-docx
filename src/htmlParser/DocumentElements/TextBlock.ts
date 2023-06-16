import { Paragraph } from 'docx';
import { IParagraphOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { Mutable } from '../utils';
import { TextInlineNormalizer } from '../TextInlineNormalizer';

export class TextBlock implements DocumentElement {
  type: DocumentElementType = 'text';
  public children: DocumentElement[] = [];

  constructor(public options: Mutable<IParagraphOptions>, children: DocumentElement[] = []) {
    this.children = new TextInlineNormalizer(children).normalize();
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
