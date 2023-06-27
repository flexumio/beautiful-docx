"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultExportOptions = exports.PageFormat = void 0;
const docx_1 = require("docx");
const types_1 = require("./types");
exports.PageFormat = {
    A3: { width: 11.7, height: 16.5 },
    A4: { width: 8.3, height: 11.7 },
    A5: { width: 5.8, height: 8.3 },
    A6: { width: 4.1, height: 5.8 },
};
const TOP_MARGIN_DEFAULT = 25.4;
const RIGHT_MARGIN_DEFAULT = 25.4;
const BOTTOM_MARGIN_DEFAULT = 25.4;
const LEFT_MARGIN_DEFAULT = 25.4;
const PARAGRAPH_FONT_SIZE = 12;
const HEADING_1_FONT_SIZE = 19.5;
const HEADING_2_FONT_SIZE = 16.5;
const HEADING_3_FONT_SIZE = 15;
const HEADING_4_FONT_SIZE = 13.5;
const HEADING_5_FONT_SIZE = 12;
const HEADING_6_FONT_SIZE = 10.5;
const defaultTableCellPaddings = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
};
exports.defaultExportOptions = {
    page: {
        orientation: types_1.PageOrientation.Portrait,
        margins: {
            top: TOP_MARGIN_DEFAULT,
            right: RIGHT_MARGIN_DEFAULT,
            bottom: BOTTOM_MARGIN_DEFAULT,
            left: LEFT_MARGIN_DEFAULT,
        },
        size: exports.PageFormat.A4,
        numbering: { type: docx_1.NumberFormat.DECIMAL, start: 1, align: docx_1.AlignmentType.CENTER },
    },
    font: {
        baseSize: PARAGRAPH_FONT_SIZE,
        baseFontFamily: 'Arial',
        headersFontFamily: 'Arial',
        headersSizes: {
            h1: HEADING_1_FONT_SIZE,
            h2: HEADING_2_FONT_SIZE,
            h3: HEADING_3_FONT_SIZE,
            h4: HEADING_4_FONT_SIZE,
            h5: HEADING_5_FONT_SIZE,
            h6: HEADING_6_FONT_SIZE,
        },
    },
    verticalSpaces: 1,
    table: { cellPaddings: defaultTableCellPaddings },
    ignoreIndentation: true,
};
