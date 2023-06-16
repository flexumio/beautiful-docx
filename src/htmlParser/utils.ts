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
export const convertPointsToPixels = (points: string | number) => {
  if (typeof points === 'string') {
    const regex = new RegExp(/(\d+)pt/);
    const matched = points.match(regex);

    if (!matched) {
      throw new Error(`Unable to parse points string: ${points}`);
    }

    const [, pointsNumber] = matched;

    return parseInt(pointsNumber) / PIXELS_TO_POINT_RATIO;
  } else {
    return points / PIXELS_TO_POINT_RATIO;
  }
};

export const convertPixelsToTwip = (pixels: number): number => {
  return convertInchesToTwip(pixels / 96);
};

export const convertTwipToPixels = (twip: number): number => {
  return Math.floor(twip / 15);
};

export const convertPointsToTwip = (points: number): number => {
  const twipPerPoint = 20;
  return points * twipPerPoint;
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
  return content.replace(/&nbsp;/g, ' ');
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

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

type PaddingsStyle = { left: number; right: number; top: number; bottom: number };

export const parsePaddings = (styles: Styles) => {
  let paddings: Partial<PaddingsStyle> = {};

  if (styles.padding) {
    paddings = parsePaddingsMergedValue(styles.padding);
  }

  if (styles['padding-top']) {
    paddings.top = convertPixelsToTwip(pixelsToNumber(styles['padding-top']));
  }
  if (styles['padding-bottom']) {
    paddings.bottom = convertPixelsToTwip(pixelsToNumber(styles['padding-bottom']));
  }
  if (styles['padding-left']) {
    paddings.left = convertPixelsToTwip(pixelsToNumber(styles['padding-left']));
  }
  if (styles['padding-right']) {
    paddings.right = convertPixelsToTwip(pixelsToNumber(styles['padding-right']));
  }

  return paddings;
};

export const parsePaddingsMergedValue = (padding: string) => {
  const paddings = padding.split(' ').map(i => convertPixelsToTwip(pixelsToNumber(i)));

  switch (paddings.length) {
    case 1: {
      const value = paddings[0];
      return {
        left: value,
        right: value,
        top: value,
        bottom: value,
      };
    }
    case 2: {
      const verticalPaddings = paddings[0];
      const horizontalPaddings = paddings[1];
      return {
        top: verticalPaddings,
        bottom: verticalPaddings,
        left: horizontalPaddings,
        right: horizontalPaddings,
      };
    }
    case 3: {
      const top = paddings[0];
      const horizontalPaddings = paddings[1];
      const bottom = paddings[2];

      return {
        top,
        bottom,
        left: horizontalPaddings,
        right: horizontalPaddings,
      };
    }
    case 4: {
      const top = paddings[0];
      const right = paddings[1];
      const bottom = paddings[2];
      const left = paddings[3];

      return {
        top,
        bottom,
        left,
        right,
      };
    }

    default: {
      throw new Error(`Unsupported padding value: ${padding}`);
    }
  }
};

const pixelsToNumber = (string: string): number => {
  return Number(string.replace(/px$/, ''));
};

export type SizeUnit = 'px' | 'pt' | 'em' | 'rem' | 'vh' | 'vw' | '%' | 'auto';

export const parseSizeValue = (value: string | number): [number, SizeUnit] => {
  if (typeof value === 'number') {
    return [value, 'px'];
  }

  if (value === 'auto') {
    return [0, 'auto'];
  }

  const match = value.match(/^(-?\d*\.?\d+)(px|pt|em|rem|vh|vw|%)$/i);

  if (match) {
    const [, numberValue, unit] = match;
    const numericValue = parseFloat(numberValue);
    const allowedUnits: SizeUnit[] = ['px', 'pt', 'em', 'rem', 'vh', 'vw', '%', 'auto'];

    if (allowedUnits.includes(unit.toLowerCase() as SizeUnit)) {
      return [numericValue, unit.toLowerCase() as SizeUnit];
    }
  }

  throw new Error('Invalid units');
};

export const hasSpacesAtStart = (str: string): boolean => {
  return str.trimStart() !== str;
};
export const hasSpacesAtEnd = (str: string): boolean => {
  return str.trimEnd() !== str;
};
