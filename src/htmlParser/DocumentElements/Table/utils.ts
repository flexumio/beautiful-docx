import { ColorTranslator } from 'colortranslator';
import { BorderStyle, convertInchesToTwip, IBorderOptions } from 'docx';
import { Node, Styles } from 'himalaya';
import { convertPixelsToPoints } from '../../utils';

const INLINE_TEXT_ELEMENTS = ['strong', 'i', 'u', 's', 'a'];
const TABLE_LEFT_INDENT = 0.06;

export const isInlineTextElement = (node: Node): boolean => {
  if (node.type === 'text') {
    return true;
  }

  return node.type === 'element' && INLINE_TEXT_ELEMENTS.includes(node.tagName);
};

export const parseBorderStyle = (style: string | undefined): BorderStyle => {
  switch (style) {
    case 'solid':
      return BorderStyle.SINGLE;
    case 'dotted':
      return BorderStyle.DOTTED;
    case 'dashed':
      return BorderStyle.DASHED;
    case 'double':
      return BorderStyle.DOUBLE;
    case 'inset':
      return BorderStyle.INSET;
    case 'outset':
      return BorderStyle.OUTSET;
    default:
      return BorderStyle.SINGLE;
  }
};

export const parseBorderOptions = (styles: Styles): IBorderOptions => {
  const defaultStyle = BorderStyle.SINGLE;
  const defaultColor = 'bfbfbf';
  const defaultSize = 4;

  if (styles['border']) {
    const regex = new RegExp(/(\S+)\s(\S+)\s(.+)/);
    const matched = styles['border'].match(regex);

    if (!matched) {
      throw new Error(`Unable to parse border options: ${styles['border']}`);
    }

    const [, width, style, color] = matched;

    const cellColorTranslator = new ColorTranslator(color);
    return {
      style: parseBorderStyle(style),
      color: cellColorTranslator.HEX,
      size: convertPixelsToPoints(width),
    };
  } else {
    const width = styles['border-width'];
    const style = styles['border-style'];
    const color = styles['border-color'];

    return {
      style: style ? parseBorderStyle(style) : defaultStyle,
      color: color ? new ColorTranslator(color).HEX : defaultColor,
      size: width ? convertPixelsToPoints(width) : defaultSize,
    };
  }
};

export const getTableIndent = (): number => {
  return convertInchesToTwip(TABLE_LEFT_INDENT);
};
