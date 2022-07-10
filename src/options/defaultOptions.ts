import { DeepPartial } from '../utils';
import { DocxExportOptions, PageFormat, PageOrientation } from './docxOptions';
import merge from 'ts-deepmerge';

const TOP_MARGIN_DEFAULT = 19;
const RIGHT_MARGIN_DEFAULT = 12.7;
const BOTTOM_MARGIN_DEFAULT = 19;
const LEFT_MARGIN_DEFAULT = 19;

const PARAGRAPH_FONT_SIZE = 24;
const HEADING_1_FONT_SIZE = 39;
const HEADING_2_FONT_SIZE = 33;
const HEADING_3_FONT_SIZE = 30;
const HEADING_4_FONT_SIZE = 27;

export const defaultExportOptions: DocxExportOptions = {
  page: {
    orientation: PageOrientation.Portrait,
    margins: {
      top: TOP_MARGIN_DEFAULT,
      right: RIGHT_MARGIN_DEFAULT,
      bottom: BOTTOM_MARGIN_DEFAULT,
      left: LEFT_MARGIN_DEFAULT,
    },
    size: PageFormat.A4,
    number: true,
  },
  font: {
    baseSize: PARAGRAPH_FONT_SIZE,
    baseFontFamily: 'Calibri',
    headersFontFamily: 'Calibri',
    headersSizes: {
      h1: HEADING_1_FONT_SIZE,
      h2: HEADING_2_FONT_SIZE,
      h3: HEADING_3_FONT_SIZE,
      h4: HEADING_4_FONT_SIZE,
    },
  },
  verticalSpaces: 0,
};

export const mergeWithDefaultOptions = (userInputOptions?: DeepPartial<DocxExportOptions>): DocxExportOptions => {
  if (userInputOptions === undefined) return defaultExportOptions;

  return merge(defaultExportOptions, userInputOptions);
};
