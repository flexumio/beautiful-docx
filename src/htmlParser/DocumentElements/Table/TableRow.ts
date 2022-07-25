import { Paragraph, ParagraphChild, TableCell, TableRow as DocxTableRow } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
import { Cell } from './Cell';

export class TableRow implements DocumentElement {
  type: DocumentElementType = 'table-row';

  private children: DocumentElement[] = [];

  constructor(element: Element, private isHeader: boolean, exportOptions: DocxExportOptions) {
    this.children = [];
    for (const child of element.children) {
      if (child.type !== 'element') {
        continue;
      }

      switch (child.tagName) {
        case 'th':
        case 'td':
          this.children.push(...new Cell(child, exportOptions, isHeader).getContent());
          break;
        default:
          throw new Error(`Unsupported row element: ${child.tagName}`);
      }
    }
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return [
      new DocxTableRow({
        children: this.children.flatMap(i => i.transformToDocx() as unknown as TableCell),
        tableHeader: this.isHeader,
      }),
    ];
  }

  getContent() {
    return [this];
  }

  get cellCount(): number {
    return this.children.length;
  }
}
