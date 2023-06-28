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
const OL_START_INDENT = 350;
const OL_HANGING_INDENT = 260;

export class Document {
  constructor(public exportOptions: DocxExportOptions, public children: DocumentElement[]) {}

  transformToDocx() {
    const children = this.children.flatMap(i => i.transformToDocx()) as Paragraph[];
    return new DocxDocument({
      features: { updateFields: true },
      styles: this.getStyles(),
      numbering: { config: this.getNumberingConfig() },
      sections: [
        {
          properties: this.getDefaultSectionsProperties(),
          footers: {
            default: this.footer.transformToDocx(),
          },
          children,
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
        document: this.getFontSettings(),
        listParagraph: this.getFontSettings(),
        heading1: this.getFontSettings('h1'),
        heading2: this.getFontSettings('h2'),
        heading3: this.getFontSettings('h3'),
        heading4: this.getFontSettings('h4'),
        heading5: this.getFontSettings('h5'),
        heading6: this.getFontSettings('h6'),
      },
    };
  }

  private getNumberingConfig() {
    return this.exportOptions.numberingReference.map(reference => {
      return {
        reference: reference,
        levels: this.generateNumbering(),
      };
    });
  }

  private generateNumbering() {
    return [0, 1, 2, 3, 4].map(level => ({
      level,
      format: LevelFormat.DECIMAL,
      text: `%${level + 1}.`,
      suffix: LevelSuffix.SPACE,
      style: {
        paragraph: {
          indent: { left: OL_START_INDENT * (level + 2), hanging: OL_HANGING_INDENT },
        },
      },
    }));
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

  private getFontSettings(level?: keyof DocxExportOptions['font']['headersSizes']) {
    if (level) {
      return {
        run: {
          font: this.exportOptions.font.headersFontFamily,
          size: this.exportOptions.font.headersSizes[level] * FONT_RATIO,
          bold: true,
        },
        paragraph: {
          spacing: {
            line: this.exportOptions.font.headersSizes[level] * FONT_TO_LINE_RATIO * this.exportOptions.verticalSpaces,
          },
        },
      };
    }
    return {
      run: {
        font: this.exportOptions.font.baseFontFamily,
        size: this.exportOptions.font.baseSize * FONT_RATIO,
        bold: false,
      },
      paragraph: {
        spacing: {
          line: this.exportOptions.font.baseSize * FONT_TO_LINE_RATIO * this.exportOptions.verticalSpaces,
        },
      },
    };
  }
}
