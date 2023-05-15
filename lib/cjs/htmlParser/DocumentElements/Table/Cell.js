"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const colortranslator_1 = require("colortranslator");
const docx_1 = require("docx");
const HtmlParser_1 = require("../../HtmlParser");
const utils_1 = require("../../utils");
const utils_2 = require("./utils");
class Cell {
    constructor(element, exportOptions, isHeader) {
        this.element = element;
        this.exportOptions = exportOptions;
        this.isHeader = isHeader;
        this.type = 'table-cell';
        this.attributes = (0, utils_1.getAttributeMap)(element.attributes);
        this.styles = (0, utils_1.parseStyles)(this.attributes.style);
        this.options = {
            margins: this.margins,
            rowSpan: parseInt(this.attributes['rowspan'] || '1'),
            columnSpan: parseInt(this.attributes['colspan'] || '1'),
            shading: this.cellShading,
            borders: this.borders,
            verticalAlign: this.verticalAlign,
            children: [],
        };
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [
            new docx_1.TableCell(Object.assign(Object.assign({}, this.options), { children: this.tableCellChildren.flatMap(i => i.transformToDocx()) })),
        ];
    }
    get tableCellChildren() {
        return new HtmlParser_1.HtmlParser(this.exportOptions).parseHtmlTree(this.element.children);
    }
    get cellShading() {
        const color = this.styles['background-color'];
        if (color) {
            const cellColorTranslator = new colortranslator_1.ColorTranslator(color);
            return {
                fill: cellColorTranslator.HEX,
                type: docx_1.ShadingType.CLEAR,
                color: 'auto',
            };
        }
        if (this.isHeader) {
            return {
                fill: 'F2F2F2',
                type: docx_1.ShadingType.CLEAR,
                color: 'auto',
            };
        }
        return undefined;
    }
    get borders() {
        const borderOptions = (0, utils_2.parseBorderOptions)(this.styles);
        return {
            top: borderOptions,
            bottom: borderOptions,
            left: borderOptions,
            right: borderOptions,
        };
    }
    get verticalAlign() {
        switch (this.styles['vertical-align']) {
            case 'top':
                return docx_1.VerticalAlign.TOP;
            case 'bottom':
                return docx_1.VerticalAlign.BOTTOM;
            default:
                return docx_1.VerticalAlign.CENTER;
        }
    }
    get margins() {
        const stylesPaddings = (0, utils_1.parsePaddings)(this.styles);
        const { top, bottom, left, right } = this.exportOptions.table.cellPaddings;
        const optionsPaddings = {
            top: (0, utils_1.convertPixelsToTwip)(top),
            left: (0, utils_1.convertPixelsToTwip)(left),
            right: (0, utils_1.convertPixelsToTwip)(right),
            bottom: (0, utils_1.convertPixelsToTwip)(bottom),
        };
        return Object.assign(Object.assign({}, optionsPaddings), stylesPaddings);
    }
}
exports.Cell = Cell;
