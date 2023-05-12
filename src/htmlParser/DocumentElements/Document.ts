import {
  AlignmentType,
  convertInchesToTwip,
  convertMillimetersToTwip,
  Document as DocxDocument,
  LevelFormat,
  LevelSuffix,
  Paragraph,
} from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';
import { DocumentFooter } from './DocumentFooter';

const FONT_RATIO = 2;
export const FONT_TO_LINE_RATIO = 10 * FONT_RATIO;
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
            default: this.footer.transformToDocx(),
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
            size: this.exportOptions.font.headersSizes.h1 * FONT_RATIO,
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
            size: this.exportOptions.font.baseSize * FONT_RATIO,
            bold: false,
          },
        },
        heading1: this.getHeadingFontSettings('h1'),
        heading2: this.getHeadingFontSettings('h2'),
        heading3: this.getHeadingFontSettings('h3'),
        heading4: this.getHeadingFontSettings('h4'),
        heading5: this.getHeadingFontSettings('h5'),
        heading6: this.getHeadingFontSettings('h6'),
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
    const { numbering } = this.exportOptions.page;
    const pageNumbersConfig = numbering ? { start: numbering.start, formatType: numbering.type } : {};

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
        pageNumbers: pageNumbersConfig,
      },
    };
  };

  private get footer() {
    return new DocumentFooter(this.exportOptions);
  }

  private getHeadingFontSettings(level: keyof DocxExportOptions['font']['headersSizes']) {
    return {
      run: {
        font: this.exportOptions.font.headersFontFamily,
        size: this.exportOptions.font.headersSizes[level] * FONT_RATIO,
        bold: true,
      },
      paragraph: {
        spacing: { line: this.exportOptions.font.headersSizes[level] * FONT_TO_LINE_RATIO },
      },
    };
  }
}
