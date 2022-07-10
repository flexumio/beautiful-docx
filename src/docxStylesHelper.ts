import { AlignmentType, INumberingOptions, IStylesOptions, LevelFormat, LevelSuffix } from 'docx';
import { DocxExportOptions } from './options';

const FONT_TO_LINE_RATIO = 10;

export const PAGE_TITLE_STYLE_ID = 'PageTitle';

export const DEFAULT_NUMBERING_REF = 'default-numbering';

export const getDocumentStyles = (exportOptions: DocxExportOptions): IStylesOptions => {
  return {
    paragraphStyles: [
      {
        id: PAGE_TITLE_STYLE_ID,
        name: 'Page Title',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          font: exportOptions.font.headersFontFamily,
          size: exportOptions.font.headersSizes.h1,
          bold: true,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { line: exportOptions.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
        },
      },
    ],
    default: {
      document: {
        run: {
          font: exportOptions.font.baseFontFamily,
          size: exportOptions.font.baseSize,
          bold: false,
        },
      },
      heading1: {
        run: {
          font: exportOptions.font.headersFontFamily,
          size: exportOptions.font.headersSizes.h1,
          bold: true,
        },
        paragraph: {
          spacing: { line: exportOptions.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
        },
      },
      heading2: {
        run: {
          font: exportOptions.font.headersFontFamily,
          size: exportOptions.font.headersSizes.h2,
          bold: true,
        },
        paragraph: {
          spacing: { line: exportOptions.font.headersSizes.h2 * FONT_TO_LINE_RATIO },
        },
      },
      heading3: {
        run: {
          font: exportOptions.font.headersFontFamily,
          size: exportOptions.font.headersSizes.h3,
          bold: true,
        },
        paragraph: {
          spacing: { line: exportOptions.font.headersSizes.h3 * FONT_TO_LINE_RATIO },
        },
      },
      heading4: {
        run: {
          font: exportOptions.font.headersFontFamily,
          size: exportOptions.font.headersSizes.h4,
          bold: true,
        },
        paragraph: {
          spacing: { line: exportOptions.font.headersSizes.h4 * FONT_TO_LINE_RATIO },
        },
      },
    },
  };
};

export const getNumberingConfig = (): INumberingOptions => {
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
};
