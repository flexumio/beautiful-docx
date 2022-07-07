import { convertInchesToTwip, ImageRun, Paragraph, Table, TableOfContents } from 'docx';
import { Attribute, Styles } from 'himalaya';

export type ParseResult = Paragraph | Table | TableOfContents | ImageRun;

export type AttributeMap = {
  [k: string]: string;
};

export const getAttributeMap = (attribs: Attribute[]): AttributeMap => {
  const map: AttributeMap = {};

  for (const attr of attribs) {
    map[attr.key] = attr.value;
  }

  return map;
};

export const parseStyles = (stylesString: string | undefined): Styles => {
  const styles: Styles = {};

  const value = stylesString || '';
  const rules = value.split(';');

  for (const rule of rules) {
    const [key, value] = rule.split(':');
    styles[key] = value;
  }

  return styles;
};

export const covertPixelsToPoints = (pixels: string | number) => {
  const PIXELS_TO_POINT_RATIO = 1 / 4;
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
