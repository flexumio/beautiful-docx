import { ColorTranslator } from 'colortranslator';
import { BorderStyle, convertInchesToTwip, IBorderOptions } from 'docx';
import { Node, Styles } from 'himalaya';

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
  let border: { size: number; color: string; style: BorderStyle } = {
    size: defaultSize,
    color: defaultColor,
    style: defaultStyle,
  };

  if (styles['border']) {
    const regex = new RegExp(/(\S+)\s(\S+)\s(.+)/);
    const matched = styles['border'].match(regex);

    if (!matched) {
      throw new Error(`Unable to parse border options: ${styles['border']}`);
    }

    const [, width, style, color] = matched;

    const cellColorTranslator = new ColorTranslator(color);
    border = {
      style: parseBorderStyle(style),
      color: cellColorTranslator.HEX,
      size: parseInt(width),
    };
  }
  const width = styles['border-width'];
  const style = styles['border-style'];
  const color = styles['border-color'];

  if (width) {
    border.size = parseInt(width);
  }

  if (style) {
    border.style = parseBorderStyle(style);
  }

  if (color) {
    border.color = new ColorTranslator(color).HEX;
  }

  return border;
};

export const getTableIndent = (): number => {
  return convertInchesToTwip(TABLE_LEFT_INDENT);
};
