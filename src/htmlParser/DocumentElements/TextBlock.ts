import { Paragraph, convertMillimetersToTwip } from 'docx';
import { DocxExportOptions, IParagraphOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TextInline } from './TextInline';
import { Mutable } from '../utils';

export class TextBlock implements DocumentElement {
  type: DocumentElementType = 'text';

  constructor(
    public options: Mutable<IParagraphOptions>,
    public children: DocumentElement[] = [],
    private readonly exportOptions?: DocxExportOptions
  ) {
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
        spacing: { after: convertMillimetersToTwip(this.exportOptions?.verticalSpaces || 0) },
        children: this.children.flatMap(i => i.transformToDocx()),
      }),
    ];
  }
}
