"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSizeValue = exports.parsePaddingsMergedValue = exports.parsePaddings = exports.getPageWidth = exports.isListTag = exports.getIndent = exports.cleanTextContent = exports.parseTextAlignment = exports.convertPointsToTwip = exports.convertTwipToPixels = exports.convertPixelsToTwip = exports.convertPointsToPixels = exports.convertPixelsToPoints = exports.parseStyles = exports.getAttributeMap = exports.PIXELS_TO_POINT_RATIO = exports.FIRST_LINE_INDENT_MILLIMETERS = void 0;
const docx_1 = require("docx");
exports.FIRST_LINE_INDENT_MILLIMETERS = 6;
exports.PIXELS_TO_POINT_RATIO = 1 / 4;
const getAttributeMap = (attribs) => {
    const map = {};
    for (const attr of attribs) {
        map[attr.key] = attr.value || '';
    }
    return map;
};
exports.getAttributeMap = getAttributeMap;
const parseStyles = (stylesString) => {
    const styles = {};
    const value = stylesString || '';
    const rules = value.split(';');
    for (const rule of rules) {
        const [key, value] = rule.split(':');
        styles[key.trim()] = value === null || value === void 0 ? void 0 : value.trim();
    }
    return styles;
};
exports.parseStyles = parseStyles;
const convertPixelsToPoints = (pixels) => {
    if (typeof pixels === 'string') {
        const regex = new RegExp(/(\d+)px/);
        const matched = pixels.match(regex);
        if (!matched) {
            throw new Error(`Unable to parse pixels string: ${pixels}`);
        }
        const [, pixelNumber] = matched;
        return parseInt(pixelNumber) * exports.PIXELS_TO_POINT_RATIO;
    }
    else {
        return pixels * exports.PIXELS_TO_POINT_RATIO;
    }
};
exports.convertPixelsToPoints = convertPixelsToPoints;
const convertPointsToPixels = (points) => {
    if (typeof points === 'string') {
        const regex = new RegExp(/(\d+)pt/);
        const matched = points.match(regex);
        if (!matched) {
            throw new Error(`Unable to parse points string: ${points}`);
        }
        const [, pointsNumber] = matched;
        return parseInt(pointsNumber) / exports.PIXELS_TO_POINT_RATIO;
    }
    else {
        return points / exports.PIXELS_TO_POINT_RATIO;
    }
};
exports.convertPointsToPixels = convertPointsToPixels;
const convertPixelsToTwip = (pixels) => {
    return (0, docx_1.convertInchesToTwip)(pixels / 96);
};
exports.convertPixelsToTwip = convertPixelsToTwip;
const convertTwipToPixels = (twip) => {
    return Math.floor(twip / 15);
};
exports.convertTwipToPixels = convertTwipToPixels;
const convertPointsToTwip = (points) => {
    const twipPerPoint = 20;
    return points * twipPerPoint;
};
exports.convertPointsToTwip = convertPointsToTwip;
const parseTextAlignment = (attribs) => {
    var _a;
    const cellAttributes = (0, exports.getAttributeMap)(attribs);
    const style = (0, exports.parseStyles)(cellAttributes['style']);
    switch ((_a = style['text-align']) === null || _a === void 0 ? void 0 : _a.trim()) {
        case 'justify':
            return docx_1.AlignmentType.JUSTIFIED;
        case 'left':
            return docx_1.AlignmentType.LEFT;
        case 'right':
            return docx_1.AlignmentType.RIGHT;
        case 'center':
            return docx_1.AlignmentType.CENTER;
        default:
            return docx_1.AlignmentType.LEFT;
    }
};
exports.parseTextAlignment = parseTextAlignment;
const cleanTextContent = (content) => {
    // replace &nbsp; characters
    return content.replace(/&nbsp;/g, ' ').trim();
};
exports.cleanTextContent = cleanTextContent;
const getIndent = (paragraphIndex, docxExportOptions) => {
    if (paragraphIndex === 0 || docxExportOptions.ignoreIndentation) {
        return undefined;
    }
    return { firstLine: (0, docx_1.convertMillimetersToTwip)(exports.FIRST_LINE_INDENT_MILLIMETERS) };
};
exports.getIndent = getIndent;
const isListTag = (tagName) => {
    return tagName === 'ul' || tagName === 'ol';
};
exports.isListTag = isListTag;
const getPageWidth = (exportOptions) => {
    return ((0, docx_1.convertInchesToTwip)(exportOptions.page.size.width) -
        (0, docx_1.convertMillimetersToTwip)(exportOptions.page.margins.right) -
        (0, docx_1.convertMillimetersToTwip)(exportOptions.page.margins.left));
};
exports.getPageWidth = getPageWidth;
const parsePaddings = (styles) => {
    let paddings = {};
    if (styles.padding) {
        paddings = (0, exports.parsePaddingsMergedValue)(styles.padding);
    }
    if (styles['padding-top']) {
        paddings.top = (0, exports.convertPixelsToTwip)(pixelsToNumber(styles['padding-top']));
    }
    if (styles['padding-bottom']) {
        paddings.bottom = (0, exports.convertPixelsToTwip)(pixelsToNumber(styles['padding-bottom']));
    }
    if (styles['padding-left']) {
        paddings.left = (0, exports.convertPixelsToTwip)(pixelsToNumber(styles['padding-left']));
    }
    if (styles['padding-right']) {
        paddings.right = (0, exports.convertPixelsToTwip)(pixelsToNumber(styles['padding-right']));
    }
    return paddings;
};
exports.parsePaddings = parsePaddings;
const parsePaddingsMergedValue = (padding) => {
    const paddings = padding.split(' ').map(i => (0, exports.convertPixelsToTwip)(pixelsToNumber(i)));
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
exports.parsePaddingsMergedValue = parsePaddingsMergedValue;
const pixelsToNumber = (string) => {
    return Number(string.replace(/px$/, ''));
};
const parseSizeValue = (value) => {
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
        const allowedUnits = ['px', 'pt', 'em', 'rem', 'vh', 'vw', '%', 'auto'];
        if (allowedUnits.includes(unit.toLowerCase())) {
            return [numericValue, unit.toLowerCase()];
        }
    }
    throw new Error('Invalid units');
};
exports.parseSizeValue = parseSizeValue;
