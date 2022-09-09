import { ColorTranslator } from 'colortranslator';
import { ITableCellOptions, Paragraph, ShadingType, TableCell, VerticalAlign } from 'docx';
import { Element, Styles } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { TextInline } from '../TextInline';
import { HtmlParser } from '../../HtmlParser';
import { TextBlock } from '../TextBlock';
import { AttributeMap, convertPixelsToTwip, getAttributeMap, parsePaddings, parseStyles } from '../../utils';
import { isInlineTextElement, parseBorderOptions } from './utils';
import { DocumentElement, DocumentElementType } from '../DocumentElement';

export class Cell implements DocumentElement {
  type: DocumentElementType = 'table-cell';
  public options: ITableCellOptions;
  private readonly attributes: AttributeMap;
  private readonly styles: Styles;

  constructor(private element: Element, private exportOptions: DocxExportOptions, private isHeader: boolean) {
    this.attributes = getAttributeMap(element.attributes);
    this.styles = parseStyles(this.attributes.style);
    this.options = {
      margins: this.margins,
      rowSpan: parseInt(this.attributes['rowspan'] || '1'),
      columnSpan: parseInt(this.attributes['colspan'] || '1'),
      shading: this.cellShading,
      borders: this.borders,
      verticalAlign: this.verticalAlign,
      children: [],
    };
  }

  getContent() {
    return [this];
  }

  transformToDocx() {
    return [
      new TableCell({
        ...this.options,
        children: this.tableCellChildren.flatMap(i => i.transformToDocx()) as Paragraph[],
      }),
    ];
  }

  public get tableCellChildren() {
    const nodes = this.element.children;
    const firstNode = nodes[0];

    if (isInlineTextElement(firstNode)) {
      return [
        new TextBlock(
          {},
          nodes.flatMap(node => new TextInline(node).getContent())
        ),
      ];
    }

    return nodes.flatMap((node, index) => {
      if (node.type !== 'element') {
        return [];
      }

      return new HtmlParser(this.exportOptions).parseTopLevelElement(node, index);
    });
  }

  private get cellShading() {
    const color = this.styles['background-color'];
    if (color) {
      const cellColorTranslator = new ColorTranslator(color);
      return {
        fill: cellColorTranslator.HEX,
        type: ShadingType.CLEAR,
        color: 'auto',
      };
    }

    if (this.isHeader) {
      return {
        fill: 'F2F2F2',
        type: ShadingType.CLEAR,
        color: 'auto',
      };
    }

    return undefined;
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
  private get verticalAlign(): VerticalAlign {
    switch (this.styles['vertical-align']) {
      case 'top':
        return VerticalAlign.TOP;
      case 'bottom':
        return VerticalAlign.BOTTOM;
      default:
        return VerticalAlign.CENTER;
    }
  }

  private get margins() {
    const stylesPaddings = parsePaddings(this.styles);

    const { top, bottom, left, right } = this.exportOptions.table.cellPaddings;
    const optionsPaddings = {
      top: convertPixelsToTwip(top),
      left: convertPixelsToTwip(left),
      right: convertPixelsToTwip(right),
      bottom: convertPixelsToTwip(bottom),
    };

    return { ...optionsPaddings, ...stylesPaddings };
  }
}
