import { AlignmentType, ITableOptions, Table, TableLayoutType, TableRow as DocxTableRow, WidthType } from 'docx';
import { Element, Styles } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { AttributeMap, getAttributeMap, getPageWidth, parseStyles } from '../../utils';
import { getTableIndent, parseBorderOptions } from './utils';
import { TextBlock } from '../TextBlock';
import { TableRow } from './TableRow';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
import { HtmlParser } from '../../HtmlParser';

export class TableCreator implements DocumentElement {
  type: DocumentElementType = 'table';
  public options: ITableOptions;
  public children: TableRow[] = [];

  private readonly attr: AttributeMap;
  private colGroup: Element | null = null;
  private readonly styles: Styles;
  private readonly content: DocumentElement[];
  private caption?: DocumentElement[];

  constructor(private element: Element, private exportOptions: DocxExportOptions) {
    this.attr = getAttributeMap(element.attributes);
    this.styles = parseStyles(this.attr['style']);

    this.createRows();
    const beforeTableContent = this.caption ? this.caption : [new TextBlock({ children: [] })];

    this.content = [...beforeTableContent, this, new TextBlock({ children: [] })];

    this.options = {
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
      rows: [],
    };
  }

  transformToDocx() {
    return this.content.flatMap(i => {
      if (i.type === 'table') {
        return new Table({
          ...this.options,
          rows: this.children.flatMap(i => i.transformToDocx() as unknown as DocxTableRow),
        });
      }
      return [];
    });
  }

  private createRows() {
    this.children = [];
    for (const tableChild of this.element.children) {
      if (tableChild.type !== 'element') {
        continue;
      }
      switch (tableChild.tagName) {
        case 'thead':
          this.children.push(...this.parseTableRowsFragment(tableChild, true));
          break;
        case 'tbody':
        case 'tfoot':
          this.children.push(...this.parseTableRowsFragment(tableChild, false));
          break;
        case 'tr':
          this.children.push(...new TableRow(tableChild, false, this.exportOptions).getContent());
          break;
        case 'colgroup':
          this.setColGroup(tableChild);
          break;
        case 'caption':
          this.caption = this.parseCaption(tableChild);
          break;
        default:
          throw new Error(`Unsupported table element: ${tableChild.tagName}`);
      }
    }
    return this.children;
  }

  private parseTableRowsFragment(element: Element, isHeader: boolean) {
    const rows: TableRow[] = [];

    for (const child of element.children) {
      if (child.type !== 'element') {
        continue;
      }

      switch (child.tagName) {
        case 'tr':
          rows.push(...new TableRow(child, isHeader, this.exportOptions).getContent());
          break;
        default:
          throw new Error(`Unsupported table fragment element: ${child.tagName}`);
      }
    }

    return rows;
  }

  private setColGroup(colGroup: Element) {
    this.colGroup = colGroup;
  }

  getContent() {
    return this.content;
  }

  private get columnsCount() {
    return Math.max(...this.children.map(row => row.cellCount));
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
    const colGroupCount = this.colGroup?.children.filter(i => i.type === 'element').length;
    if (this.colGroup && colGroupCount === this.columnsCount) {
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
      return new Array<number>(this.columnsCount).fill(columnWidth);
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

  private parseCaption(element: Element) {
    return new HtmlParser(this.exportOptions).parseHtmlTree(element.children).map(i => {
      if (i instanceof TextBlock) {
        i.options.alignment = AlignmentType.CENTER;
      }
      return i;
    });
  }
}
