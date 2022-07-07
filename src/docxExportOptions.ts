export type ImageMap = {
  [url: string]: Buffer;
};

export type DocxExportOptions = {
  pageWidth: number;
  pageHeight: number;
  textFont: string;
  titleFont: string;
  verticalSpaces: number;
  ignoreIndentation?: boolean;
  images?: ImageMap;
};

export const defaultExportOptions: DocxExportOptions = {
  pageWidth: 5.5,
  pageHeight: 8.5,
  textFont: 'Calibri',
  titleFont: 'Calibri',
  verticalSpaces: 0,
};
