import { ITableRowOptions, Paragraph, ParagraphChild, TableCell, TableRow as DocxTableRow } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
import { Cell } from './Cell';

export class TableRow implements DocumentElement {
  type: DocumentElementType = 'table-row';

  public children: DocumentElement[] = [];
  public options: ITableRowOptions;

  constructor(
    element: Element,
    private isHeader: boolean,
    private cellWidths: number[],
    exportOptions: DocxExportOptions
  ) {
    this.children = [];

    element.children.forEach((child, i) => {
      if (child.type !== 'element') {
        return;
      }

      switch (child.tagName) {
        case 'th':
        case 'td':
          this.children.push(...new Cell(child, exportOptions, isHeader, cellWidths[i]).getContent());
          break;
        default:
          throw new Error(`Unsupported row element: ${child.tagName}`);
      }
    }, this);

    this.options = { tableHeader: this.isHeader, children: [] };
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return [
      new DocxTableRow({
        ...this.options,
        children: this.children.flatMap(i => i.transformToDocx() as unknown as TableCell),
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
