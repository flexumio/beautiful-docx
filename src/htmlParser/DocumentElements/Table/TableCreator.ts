import { AlignmentType, ITableOptions, Table, TableLayoutType, TableRow as DocxTableRow, WidthType } from 'docx';
import { Element, Styles } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import {
  AttributeMap,
  convertPixelsToTwip,
  convertPointsToTwip,
  getAttributeMap,
  getPageWidth,
  parseSizeValue,
  parseStyles,
} from '../../utils';
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
    const beforeTableContent = this.caption ? this.caption : [new TextBlock({ children: [] }, [])];

    this.content = [...beforeTableContent, this, new TextBlock({ children: [] }, [])];

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
          this.children.push(...new TableRow(tableChild, false, this.columnWidth, this.exportOptions).getContent());
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
          rows.push(...new TableRow(child, isHeader, this.columnWidth, this.exportOptions).getContent());
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
    const pageWidthTwip = getPageWidth(this.exportOptions);
    const tableAttr = getAttributeMap(this.element.attributes);
    const tableStyles = parseStyles(tableAttr['style']);
    const tableWidth = tableStyles['width'];

    if (tableWidth) {
      const [value, unitType] = parseSizeValue(tableWidth);
      switch (unitType) {
        case 'vw':
        case '%': {
          return (pageWidthTwip * value) / 100;
        }
        case 'vh':
        case 'auto': {
          return pageWidthTwip;
        }
        case 'pt': {
          const width = convertPointsToTwip(value);
          return width > pageWidthTwip ? pageWidthTwip : width;
        }
        case 'px': {
          const width = convertPixelsToTwip(value);
          return width > pageWidthTwip ? pageWidthTwip : width;
        }
        case 'em':
        case 'rem': {
          const fontSizeInTwip = convertPointsToTwip(this.exportOptions.font.baseSize);
          const width = fontSizeInTwip * value;
          return width > pageWidthTwip ? pageWidthTwip : width;
        }
      }
    }

    return pageWidthTwip;
  }

  private get columnWidth() {
    const colGroupCount = this.colGroup?.children.filter(i => i.type === 'element').length;
    const mediumColWidth = Math.floor(this.width / this.columnsCount);

    if (this.colGroup && colGroupCount === this.columnsCount) {
      const childrenWidth = this.colGroup.children.map(item => {
        if (item.type === 'element' && item.tagName === 'col') {
          const colAttr = getAttributeMap(item.attributes);
          const colStyles = parseStyles(colAttr['style']);
          const [value, unitType] = parseSizeValue(colStyles['width']);

          switch (unitType) {
            case 'vw':
            case '%': {
              return (this.width * value) / 100;
            }
            case 'vh':
            case 'auto': {
              return mediumColWidth;
            }
            case 'pt': {
              return convertPointsToTwip(value);
            }
            case 'px': {
              return convertPixelsToTwip(value);
            }
            case 'em':
            case 'rem': {
              const fontSizeInTwip = convertPointsToTwip(this.exportOptions.font.baseSize);

              return fontSizeInTwip * value;
            }
          }
        }
      });
      const columnWidths = childrenWidth.filter(i => i !== undefined) as number[];

      return columnWidths;
    } else {
      return new Array<number>(this.columnsCount).fill(mediumColWidth);
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
