"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableIndent = exports.parseBorderOptions = exports.parseBorderStyle = exports.isInlineTextElement = void 0;
const colortranslator_1 = require("colortranslator");
const docx_1 = require("docx");
const INLINE_TEXT_ELEMENTS = ['strong', 'i', 'u', 's', 'a'];
const TABLE_LEFT_INDENT = 0.06;
const isInlineTextElement = (node) => {
    if (node.type === 'text') {
        return true;
    }
    return node.type === 'element' && INLINE_TEXT_ELEMENTS.includes(node.tagName);
};
exports.isInlineTextElement = isInlineTextElement;
const parseBorderStyle = (style) => {
    switch (style) {
        case 'solid':
            return docx_1.BorderStyle.SINGLE;
        case 'dotted':
            return docx_1.BorderStyle.DOTTED;
        case 'dashed':
            return docx_1.BorderStyle.DASHED;
        case 'double':
            return docx_1.BorderStyle.DOUBLE;
        case 'inset':
            return docx_1.BorderStyle.INSET;
        case 'outset':
            return docx_1.BorderStyle.OUTSET;
        default:
            return docx_1.BorderStyle.SINGLE;
    }
};
exports.parseBorderStyle = parseBorderStyle;
const parseBorderOptions = (styles) => {
    const defaultStyle = docx_1.BorderStyle.SINGLE;
    const defaultColor = 'bfbfbf';
    const defaultSize = 4;
    let border = {
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
        const cellColorTranslator = new colortranslator_1.ColorTranslator(color);
        border = {
            style: (0, exports.parseBorderStyle)(style),
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
        border.style = (0, exports.parseBorderStyle)(style);
    }
    if (color) {
        border.color = new colortranslator_1.ColorTranslator(color).HEX;
    }
    return border;
};
exports.parseBorderOptions = parseBorderOptions;
const getTableIndent = () => {
    return (0, docx_1.convertInchesToTwip)(TABLE_LEFT_INDENT);
};
exports.getTableIndent = getTableIndent;
