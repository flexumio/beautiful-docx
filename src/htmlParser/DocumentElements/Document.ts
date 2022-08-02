import {
  AlignmentType,
  convertInchesToTwip,
  convertMillimetersToTwip,
  Document as DocxDocument,
  Footer,
  LevelFormat,
  LevelSuffix,
  NumberFormat,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';

export const FONT_TO_LINE_RATIO = 10;
export const PAGE_TITLE_STYLE_ID = 'PageTitle';
export const DEFAULT_NUMBERING_REF = 'default-numbering';

export class Document {
  constructor(public exportOptions: DocxExportOptions, public children: DocumentElement[]) {}

  transformToDocx() {
    return new DocxDocument({
      features: { updateFields: true },
      styles: this.getStyles(),
      numbering: this.getNumberingConfig(),
      sections: [
        {
          properties: this.getDefaultSectionsProperties(),
          footers: {
            default: this.getFooter(),
          },
          children: this.children.flatMap(i => i.transformToDocx()) as Paragraph[],
        },
      ],
    });
  }

  private getStyles() {
    return {
      paragraphStyles: [
        {
          id: PAGE_TITLE_STYLE_ID,
          name: 'Page Title',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: this.exportOptions.font.headersFontFamily,
            size: this.exportOptions.font.headersSizes.h1,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { line: this.exportOptions.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
          },
        },
      ],
      default: {
        document: {
          run: {
            font: this.exportOptions.font.baseFontFamily,
            size: this.exportOptions.font.baseSize,
            bold: false,
          },
        },
        heading1: {
          run: {
            font: this.exportOptions.font.headersFontFamily,
            size: this.exportOptions.font.headersSizes.h1,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.exportOptions.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
          },
        },
        heading2: {
          run: {
            font: this.exportOptions.font.headersFontFamily,
            size: this.exportOptions.font.headersSizes.h2,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.exportOptions.font.headersSizes.h2 * FONT_TO_LINE_RATIO },
          },
        },
        heading3: {
          run: {
            font: this.exportOptions.font.headersFontFamily,
            size: this.exportOptions.font.headersSizes.h3,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.exportOptions.font.headersSizes.h3 * FONT_TO_LINE_RATIO },
          },
        },
        heading4: {
          run: {
            font: this.exportOptions.font.headersFontFamily,
            size: this.exportOptions.font.headersSizes.h4,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.exportOptions.font.headersSizes.h4 * FONT_TO_LINE_RATIO },
          },
        },
      },
    };
  }

  private getNumberingConfig() {
    return {
      config: [
        {
          reference: DEFAULT_NUMBERING_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 2,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 3,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 4,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
          ],
        },
      ],
    };
  }

  private getDefaultSectionsProperties = () => {
    return {
      page: {
        size: {
          width: convertInchesToTwip(this.exportOptions.page.size.width),
          height: convertInchesToTwip(this.exportOptions.page.size.height),
        },
        margin: {
          top: convertMillimetersToTwip(this.exportOptions.page.margins.top),
          right: convertMillimetersToTwip(this.exportOptions.page.margins.right),
          bottom: convertMillimetersToTwip(this.exportOptions.page.margins.bottom),
          left: convertMillimetersToTwip(this.exportOptions.page.margins.left),
        },
        pageNumbers: {
          formatType: NumberFormat.DECIMAL,
        },
      },
    };
  };
  // TODO: create separate class
  private getFooter() {
    return new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT] })],
        }),
      ],
    });
  }
}
