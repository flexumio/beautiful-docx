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
