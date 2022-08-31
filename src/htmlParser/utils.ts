import { AlignmentType, convertInchesToTwip, convertMillimetersToTwip } from 'docx';
import { Attribute, Styles } from 'himalaya';
import { DocxExportOptions } from '../options';

export const FIRST_LINE_INDENT_MILLIMETERS = 6;
export const PIXELS_TO_POINT_RATIO = 1 / 4;
export type AttributeMap = {
  [k: string]: string;
};

export const getAttributeMap = (attribs: Attribute[]): AttributeMap => {
  const map: AttributeMap = {};

  for (const attr of attribs) {
    map[attr.key] = attr.value || '';
  }

  return map;
};

export const parseStyles = (stylesString: string | undefined): Styles => {
  const styles: Styles = {};

  const value = stylesString || '';
  const rules = value.split(';');

  for (const rule of rules) {
    const [key, value] = rule.split(':');
    styles[key.trim()] = value?.trim();
  }

  return styles;
};

export const convertPixelsToPoints = (pixels: string | number) => {
  if (typeof pixels === 'string') {
    const regex = new RegExp(/(\d+)px/);
    const matched = pixels.match(regex);

    if (!matched) {
      throw new Error(`Unable to parse pixels string: ${pixels}`);
    }

    const [, pixelNumber] = matched;

    return parseInt(pixelNumber) * PIXELS_TO_POINT_RATIO;
  } else {
    return pixels * PIXELS_TO_POINT_RATIO;
  }
};

export const convertPixelsToTwip = (pixels: number): number => {
  return convertInchesToTwip(pixels / 96);
};

export const convertTwipToPixels = (twip: number): number => {
  return Math.floor(twip / 15);
};

export const parseTextAlignment = (attribs: Attribute[]): AlignmentType => {
  const cellAttributes = getAttributeMap(attribs);
  const style = parseStyles(cellAttributes['style']);

  switch (style['text-align']?.trim()) {
    case 'justify':
      return AlignmentType.JUSTIFIED;
    case 'left':
      return AlignmentType.LEFT;
    case 'right':
      return AlignmentType.RIGHT;
    case 'center':
      return AlignmentType.CENTER;
    default:
      return AlignmentType.LEFT;
  }
};

export const cleanTextContent = (content: string): string => {
  // replace &nbsp; characters
  return content.replace(/&nbsp;/g, ' ').trim();
};

export const getIndent = (paragraphIndex: number, docxExportOptions: DocxExportOptions) => {
  if (paragraphIndex === 0 || docxExportOptions.ignoreIndentation) {
    return undefined;
  }

  return { firstLine: convertMillimetersToTwip(FIRST_LINE_INDENT_MILLIMETERS) };
};

export const isListTag = (tagName: string): boolean => {
  return tagName === 'ul' || tagName === 'ol';
};

export const getPageWidth = (exportOptions: DocxExportOptions): number => {
  return (
    convertInchesToTwip(exportOptions.page.size.width) -
    convertMillimetersToTwip(exportOptions.page.margins.right) -
    convertMillimetersToTwip(exportOptions.page.margins.left)
  );
};
