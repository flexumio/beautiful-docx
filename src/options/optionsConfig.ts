export type ImageMap = {
  [url: string]: Buffer;
};

// TODO: support cm and inches for length
type LengthUnit = number;

type FontSize = number;

export enum PageOrientation {
  Portrait = 'portrait',
  Landscape = 'landscape',
}

export type PageFormatType = 'A3' | 'A4' | 'A5' | 'A6';

export type PageSize = {
  width: LengthUnit;
  height: LengthUnit;
};

export type PageFormatSizes = { [x in PageFormatType]: PageSize };

export const PageFormat: PageFormatSizes = {
  A3: { width: 11.7, height: 16.5 },
  A4: { width: 8.3, height: 11.7 },
  A5: { width: 5.8, height: 8.3 },
  A6: { width: 4.1, height: 5.8 },
};

export type PageOptions = {
  // add support
  orientation: PageOrientation;
  size: PageSize;
  margins: {
    top: LengthUnit;
    right: LengthUnit;
    bottom: LengthUnit;
    left: LengthUnit;
  };
  number: boolean;
};

export type FontOptions = {
  baseSize: FontSize;
  baseFontFamily: string;
  headersFontFamily: string;
  headersSizes: {
    h1: FontSize;
    h2: FontSize;
    h3: FontSize;
    h4: FontSize;
  };
};

export type DocxExportOptions = {
  page: PageOptions;
  font: FontOptions;
  verticalSpaces: number;
  ignoreIndentation?: boolean;
  images?: ImageMap;
};

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
