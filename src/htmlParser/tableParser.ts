import {
  AlignmentType,
  BorderStyle,
  IBorderOptions,
  IShadingAttributesProperties,
  ITableBordersOptions,
  ITableCellBorders,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  VerticalAlign,
  WidthType,
} from 'docx';

import { Element, Node, Styles } from 'himalaya';
import { ColorTranslator } from 'colortranslator';
import { parseParagraphChild, parseTopLevelElement } from './docxHtmlParser';
import { DocxExportOptions } from '../options';
import { covertPixelsToPoints, getAttributeMap, parseStyles } from './common';
import { getPageWidth, getTableIndent } from '../docxSectionHelpers';
import { ITableCellMarginOptions } from 'docx/build/file/table/table-properties/table-cell-margin';

const INLINE_TEXT_ELEMENTS = ['strong', 'i', 'u', 's', 'a'];

const isInlineTextElement = (node: Node): boolean => {
  if (node.type === 'text') {
    return true;
  }

  if (node.type === 'element' && INLINE_TEXT_ELEMENTS.includes(node.tagName)) {
    return true;
  }

  return false;
};

const parseTableCellChildren = (nodes: Node[], docxExportOptions: DocxExportOptions): (Paragraph | Table)[] => {
  const firstNode = nodes[0];

  if (isInlineTextElement(firstNode)) {
    return [new Paragraph({ children: nodes.flatMap(node => parseParagraphChild(node)) })];
  }

  return nodes.flatMap((node, index) => {
    if (node.type === 'element') return parseTopLevelElement(node, index, docxExportOptions);

    return [];
  });
};

const parseCellShading = (color: string | undefined, isHeader: boolean): IShadingAttributesProperties | undefined => {
  if (color) {
    const cellColorTranslator = new ColorTranslator(color);
    return {
      fill: cellColorTranslator.HEX,
      type: ShadingType.CLEAR,
      color: 'auto',
    };
  }

  if (isHeader) {
    return {
      fill: 'F2F2F2',
      type: ShadingType.CLEAR,
      color: 'auto',
    };
  }

  return undefined;
};

const parseBorderStyle = (style: string | undefined): BorderStyle => {
  switch (style) {
    case 'solid':
      return BorderStyle.SINGLE;
    case 'dotted':
      return BorderStyle.DOTTED;
    case 'dashed':
      return BorderStyle.DASHED;
    case 'double':
      return BorderStyle.DOUBLE;
    case 'inset':
      return BorderStyle.INSET;
    case 'outset':
      return BorderStyle.OUTSET;
    default:
      return BorderStyle.SINGLE;
  }
};

const parseBorderOptions = (styles: Styles): IBorderOptions => {
  const defaultStyle = BorderStyle.SINGLE;
  const defaultColor = 'bfbfbf';
  const defaultSize = 4;

  if (styles['border']) {
    const regex = new RegExp(/(\S+)\s(\S+)\s(.+)/);
    const matched = styles['border'].match(regex);

    if (!matched) {
      throw new Error(`Unable to parse border options: ${styles['border']}`);
    }

    const [, width, style, color] = matched;

    const cellColorTranslator = new ColorTranslator(color);
    return {
      style: parseBorderStyle(style),
      color: cellColorTranslator.HEX,
      size: covertPixelsToPoints(width),
    };
  } else {
    const width = styles['border-width'];
    const style = styles['border-style'];
    const color = styles['border-color'];

    return {
      style: style ? parseBorderStyle(style) : defaultStyle,
      color: color ? new ColorTranslator(color).HEX : defaultColor,
      size: width ? covertPixelsToPoints(width) : defaultSize,
    };
  }
};

const parseCellBorder = (cellStyles: Styles): ITableCellBorders => {
  const borderOptions = parseBorderOptions(cellStyles);

  return {
    top: borderOptions,
    bottom: borderOptions,
    left: borderOptions,
    right: borderOptions,
  };
};

const parseTableBorders = (tableStyles: Styles): ITableBordersOptions => {
  const borderOptions = parseBorderOptions(tableStyles);

  return {
    top: borderOptions,
    bottom: borderOptions,
    left: borderOptions,
    right: borderOptions,
  };
};

const parseVerticalAlign = (align: string | undefined): VerticalAlign => {
  switch (align) {
    case 'top':
      return VerticalAlign.TOP;
    case 'bottom':
      return VerticalAlign.BOTTOM;
    default:
      return VerticalAlign.CENTER;
  }
};

const getCellMargins = (): ITableCellMarginOptions => {
  return {
    left: 100,
    right: 100,
    top: 100,
    bottom: 100,
  };
};

const parseTableCell = (element: Element, isHeader: boolean, docxExportOptions: DocxExportOptions): TableCell => {
  const cellAttributes = getAttributeMap(element.attributes);
  const cellStyles = parseStyles(cellAttributes['style']);

  return new TableCell({
    margins: getCellMargins(),
    rowSpan: parseInt(cellAttributes['rowspan'] || '1'),
    columnSpan: parseInt(cellAttributes['colspan'] || '1'),
    shading: parseCellShading(cellStyles['background-color'], isHeader),
    borders: parseCellBorder(cellStyles),
    verticalAlign: parseVerticalAlign(cellStyles['vertical-align']),
    children: parseTableCellChildren(element.children, docxExportOptions),
  });
};

const parseTableRow = (element: Element, isHeader: boolean, docxExportOptions: DocxExportOptions): TableRow => {
  const children: TableCell[] = [];

  for (const child of element.children) {
    if (child.type === 'element') {
      switch (child.tagName) {
        case 'th':
        case 'td':
          children.push(parseTableCell(child, isHeader, docxExportOptions));
          break;
        default:
          throw new Error(`Unsupported row element: ${child.tagName}`);
      }
    }
  }

  return new TableRow({ children, tableHeader: isHeader });
};

const parseTableHead = (element: Element, docxExportOptions: DocxExportOptions): TableRow[] => {
  const rows: TableRow[] = [];

  for (const child of element.children) {
    if (child.type === 'element') {
      switch (child.tagName) {
        case 'tr':
          rows.push(parseTableRow(child, true, docxExportOptions));
          break;
        default:
          throw new Error(`Unsupported table head element: ${child.tagName}`);
      }
    }
  }

  return rows;
};

const parseTableBody = (element: Element, docxExportOptions: DocxExportOptions): TableRow[] => {
  const rows: TableRow[] = [];

  for (const child of element.children) {
    if (child.type === 'element') {
      switch (child.tagName) {
        case 'tr':
          rows.push(parseTableRow(child, false, docxExportOptions));
          break;
        default:
          throw new Error(`Unsupported table head element: ${child.tagName}`);
      }
    }
  }

  return rows;
};

const parseColumnWidths = (colGroup: Element | undefined, columnsCount: number, tableWidth: number): number[] => {
  if (colGroup?.children?.length === columnsCount) {
    return colGroup.children.map(item => {
      if (item.type === 'element' && item.tagName === 'col') {
        const colAttr = getAttributeMap(item.attributes);
        const colStyles = parseStyles(colAttr['style']);
        const widthPercent = parseFloat(colStyles['width'].slice(0, -1));

        return (tableWidth * widthPercent) / 100;
      }

      return Math.floor(tableWidth / columnsCount);
    });
  } else {
    const columnWidth = Math.floor(tableWidth / columnsCount);
    const columnWidths = Array(columnsCount).fill(columnWidth);

    return columnWidths;
  }
};

const parseTableWidth = (tableFigure: Element, docxExportOptions: DocxExportOptions): number => {
  const tableWidthTwip = getPageWidth(docxExportOptions);
  const tableAttr = getAttributeMap(tableFigure.attributes);
  const tableStyles = parseStyles(tableAttr['style']);
  const tableWidth = tableStyles['width'];

  if (tableWidth) {
    const widthPercent = parseFloat(tableWidth.slice(0, -1));

    return (tableWidthTwip * widthPercent) / 100;
  }

  return tableWidthTwip;
};

export const parseTable = (tableFigure: Element, docxExportOptions: DocxExportOptions): (Paragraph | Table)[] => {
  const rows: TableRow[] = [];

  const table = tableFigure.children.find(item => item.type === 'element' && item.tagName === 'table') as Element;
  const tableAttr = getAttributeMap(table.attributes);
  const tableStyles = parseStyles(tableAttr['style']);

  let colGroup: Element | undefined = undefined;

  for (const tableChild of table.children) {
    if (tableChild.type === 'element') {
      switch (tableChild.tagName) {
        case 'thead':
          rows.push(...parseTableHead(tableChild, docxExportOptions));
          break;
        case 'tbody':
          rows.push(...parseTableBody(tableChild, docxExportOptions));
          break;
        case 'colgroup':
          colGroup = tableChild;
          break;
        default:
          throw new Error(`Unsupported table element: ${tableChild.tagName}`);
      }
    }
  }

  const columnsCount = Math.max(...rows.map(row => row.CellCount));
  const tableWidth = parseTableWidth(tableFigure, docxExportOptions);
  const columnWidths = parseColumnWidths(colGroup, columnsCount, tableWidth);

  return [
    new Paragraph({ children: [] }),
    new Table({
      rows,
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      borders: parseTableBorders(tableStyles),
      width: {
        size: tableWidth,
        type: WidthType.DXA,
      },
      indent: {
        size: getTableIndent(),
        type: WidthType.DXA,
      },
      columnWidths,
    }),
    new Paragraph({ children: [] }),
  ];
};
