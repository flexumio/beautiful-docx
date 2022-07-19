import { AlignmentType, Table, TableLayoutType, TableRow, WidthType } from 'docx';
import { Element, Styles } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { TableCell } from 'docx';
import { AttributeMap, getAttributeMap, getPageWidth, parseStyles } from '../utils';
import { getTableIndent, parseBorderOptions } from './utils';
import { TextBlock } from '../TextBlock';
import { Cell } from './Cell';

export class TableCreator {
  private attr: AttributeMap;
  private table: Table;
  private colGroup: Element | null = null;
  private rows: TableRow[] = [];
  private styles: Styles;

  constructor(private element: Element, public exportOptions: DocxExportOptions) {
    this.attr = getAttributeMap(element.attributes);
    this.styles = parseStyles(this.attr['style']);

    const rows = this.createRows();

    this.table = new Table({
      rows: rows,
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      borders: this.borders,
      width: {
        size: this.width,
        type: WidthType.DXA,
      },
      indent: {
        size: getTableIndent(),
        type: WidthType.DXA,
      },
      columnWidths: this.columnWidth,
    });
  }

  create() {
    return [new TextBlock({ children: [] }), this.table, new TextBlock({ children: [] })];
  }

  private createRows() {
    this.rows = [];
    for (const tableChild of this.element.children) {
      if (tableChild.type !== 'element') {
        continue;
      }
      // TODO: add support for tr, tfoot,
      switch (tableChild.tagName) {
        case 'thead':
          this.rows.push(...this.parseTableRowsFragment(tableChild, true));
          break;
        case 'tbody':
          this.rows.push(...this.parseTableRowsFragment(tableChild, false));
          break;
        case 'colgroup':
          this.setColGroup(tableChild);
          break;
        default:
          throw new Error(`Unsupported table element: ${tableChild.tagName}`);
      }
    }
    return this.rows;
  }

  private parseTableRowsFragment(element: Element, isHeader: boolean) {
    const rows: TableRow[] = [];

    for (const child of element.children) {
      if (child.type !== 'element') {
        continue;
      }

      switch (child.tagName) {
        case 'tr':
          rows.push(this.parseTableRow(child, isHeader));
          break;
        default:
          throw new Error(`Unsupported table fragment element: ${child.tagName}`);
      }
    }

    return rows;
  }

  private parseTableRow(element: Element, isHeader: boolean): TableRow {
    const children: TableCell[] = [];

    for (const child of element.children) {
      if (child.type !== 'element') {
        continue;
      }

      switch (child.tagName) {
        case 'th':
        case 'td':
          children.push(new Cell(child, this.exportOptions, isHeader).create());
          break;
        default:
          throw new Error(`Unsupported row element: ${child.tagName}`);
      }
    }

    return new TableRow({ children, tableHeader: isHeader });
  }

  private setColGroup(colGroup: Element) {
    this.colGroup = colGroup;
  }

  private get columnsCount() {
    return Math.max(...this.rows.map(row => row.CellCount));
  }

  private get width() {
    const tableWidthTwip = getPageWidth(this.exportOptions);
    const tableAttr = getAttributeMap(this.element.attributes);
    const tableStyles = parseStyles(tableAttr['style']);
    const tableWidth = tableStyles['width'];

    if (tableWidth) {
      const widthPercent = parseFloat(tableWidth.slice(0, -1));

      return (tableWidthTwip * widthPercent) / 100;
    }

    return tableWidthTwip;
  }

  private get columnWidth() {
    if (this.colGroup?.children?.length === this.columnsCount) {
      return this.colGroup.children.map(item => {
        if (item.type === 'element' && item.tagName === 'col') {
          const colAttr = getAttributeMap(item.attributes);
          const colStyles = parseStyles(colAttr['style']);
          const widthPercent = parseFloat(colStyles['width'].slice(0, -1));

          return (this.width * widthPercent) / 100;
        }

        return Math.floor(this.width / this.columnsCount);
      });
    } else {
      const columnWidth = Math.floor(this.width / this.columnsCount);
      const columnWidths = new Array<number>(this.columnsCount).fill(columnWidth);

      return columnWidths;
    }
  }

  private get borders() {
    const borderOptions = parseBorderOptions(this.styles);

    return {
      top: borderOptions,
      bottom: borderOptions,
      left: borderOptions,
      right: borderOptions,
    };
  }
}
