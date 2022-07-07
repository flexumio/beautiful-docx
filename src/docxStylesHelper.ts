import { AlignmentType, INumberingOptions, IStylesOptions, LevelFormat, LevelSuffix } from 'docx';
import { DocxExportOptions } from './docxExportOptions';

const PARAGRAPH_FONT_SIZE = 24;
const HEADING_1_FONT_SIZE = 39;
const HEADING_2_FONT_SIZE = 33;
const HEADING_3_FONT_SIZE = 30;
const HEADING_4_FONT_SIZE = 27;

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
          font: exportOptions.titleFont,
          size: HEADING_1_FONT_SIZE,
          bold: true,
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { line: HEADING_1_FONT_SIZE * FONT_TO_LINE_RATIO },
        },
      },
    ],
    default: {
      document: {
        run: {
          font: exportOptions.textFont,
          size: PARAGRAPH_FONT_SIZE,
          bold: false,
        },
      },
      heading1: {
        run: {
          font: exportOptions.titleFont,
          size: HEADING_1_FONT_SIZE,
          bold: true,
        },
        paragraph: {
          spacing: { line: HEADING_1_FONT_SIZE * FONT_TO_LINE_RATIO },
        },
      },
      heading2: {
        run: {
          font: exportOptions.titleFont,
          size: HEADING_2_FONT_SIZE,
          bold: true,
        },
        paragraph: {
          spacing: { line: HEADING_2_FONT_SIZE * FONT_TO_LINE_RATIO },
        },
      },
      heading3: {
        run: {
          font: exportOptions.titleFont,
          size: HEADING_3_FONT_SIZE,
          bold: true,
        },
        paragraph: {
          spacing: { line: HEADING_3_FONT_SIZE * FONT_TO_LINE_RATIO },
        },
      },
      heading4: {
        run: {
          font: exportOptions.titleFont,
          size: HEADING_4_FONT_SIZE,
          bold: true,
        },
        paragraph: {
          spacing: { line: HEADING_4_FONT_SIZE * FONT_TO_LINE_RATIO },
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
