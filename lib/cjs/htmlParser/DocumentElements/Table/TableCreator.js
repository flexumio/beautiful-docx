"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCreator = void 0;
const docx_1 = require("docx");
const utils_1 = require("../../utils");
const utils_2 = require("./utils");
const TextBlock_1 = require("../TextBlock");
const TableRow_1 = require("./TableRow");
const HtmlParser_1 = require("../../HtmlParser");
class TableCreator {
    constructor(element, exportOptions) {
        this.element = element;
        this.exportOptions = exportOptions;
        this.type = 'table';
        this.children = [];
        this.colGroup = null;
        this.attr = (0, utils_1.getAttributeMap)(element.attributes);
        this.styles = (0, utils_1.parseStyles)(this.attr['style']);
        this.createRows();
        const beforeTableContent = this.caption ? this.caption : [new TextBlock_1.TextBlock({ children: [] }, [])];
        this.content = [...beforeTableContent, this, new TextBlock_1.TextBlock({ children: [] }, [])];
        this.options = {
            layout: docx_1.TableLayoutType.FIXED,
            alignment: docx_1.AlignmentType.CENTER,
            borders: this.borders,
            width: {
                size: this.width,
                type: docx_1.WidthType.DXA,
            },
            indent: {
                size: (0, utils_2.getTableIndent)(),
                type: docx_1.WidthType.DXA,
            },
            columnWidths: this.columnWidth,
            rows: [],
        };
    }
    transformToDocx() {
        return this.content.flatMap(i => {
            if (i.type === 'table') {
                return new docx_1.Table(Object.assign(Object.assign({}, this.options), { rows: this.children.flatMap(i => i.transformToDocx()) }));
            }
            return [];
        });
    }
    createRows() {
        this.children = [];
        for (const tableChild of this.element.children) {
            if (tableChild.type !== 'element') {
                continue;
            }
            switch (tableChild.tagName) {
                case 'thead':
                    this.children.push(...this.parseTableRowsFragment(tableChild, true));
                    break;
                case 'tbody':
                case 'tfoot':
                    this.children.push(...this.parseTableRowsFragment(tableChild, false));
                    break;
                case 'tr':
                    this.children.push(...new TableRow_1.TableRow(tableChild, false, this.columnWidth, this.exportOptions).getContent());
                    break;
                case 'colgroup':
                    this.setColGroup(tableChild);
                    break;
                case 'caption':
                    this.caption = this.parseCaption(tableChild);
                    break;
                default:
                    throw new Error(`Unsupported table element: ${tableChild.tagName}`);
            }
        }
        return this.children;
    }
    parseTableRowsFragment(element, isHeader) {
        const rows = [];
        for (const child of element.children) {
            if (child.type !== 'element') {
                continue;
            }
            switch (child.tagName) {
                case 'tr':
                    rows.push(...new TableRow_1.TableRow(child, isHeader, this.columnWidth, this.exportOptions).getContent());
                    break;
                default:
                    throw new Error(`Unsupported table fragment element: ${child.tagName}`);
            }
        }
        return rows;
    }
    setColGroup(colGroup) {
        this.colGroup = colGroup;
    }
    getContent() {
        return this.content;
    }
    get columnsCount() {
        if (!this.children || this.children.length === 0) {
            return 0;
        }
        const cellCounts = this.children.map(row => row.cellCount);
        return Math.max(...cellCounts);
    }
    get width() {
        const pageWidthTwip = (0, utils_1.getPageWidth)(this.exportOptions);
        const tableAttr = (0, utils_1.getAttributeMap)(this.element.attributes);
        const tableStyles = (0, utils_1.parseStyles)(tableAttr['style']);
        const tableWidth = tableStyles['width'];
        if (tableWidth) {
            const [value, unitType] = (0, utils_1.parseSizeValue)(tableWidth);
            switch (unitType) {
                case 'vw':
                case '%': {
                    return (pageWidthTwip * value) / 100;
                }
                case 'vh':
                case 'auto': {
                    return pageWidthTwip;
                }
                case 'pt': {
                    const width = (0, utils_1.convertPointsToTwip)(value);
                    return width > pageWidthTwip ? pageWidthTwip : width;
                }
                case 'px': {
                    const width = (0, utils_1.convertPixelsToTwip)(value);
                    return width > pageWidthTwip ? pageWidthTwip : width;
                }
                case 'em':
                case 'rem': {
                    const fontSizeInTwip = (0, utils_1.convertPointsToTwip)(this.exportOptions.font.baseSize);
                    const width = fontSizeInTwip * value;
                    return width > pageWidthTwip ? pageWidthTwip : width;
                }
            }
        }
        return pageWidthTwip;
    }
    get columnWidth() {
        var _a;
        const colGroupCount = (_a = this.colGroup) === null || _a === void 0 ? void 0 : _a.children.filter(i => i.type === 'element').length;
        const mediumColWidth = Math.floor(this.width / this.columnsCount);
        if (this.colGroup && colGroupCount === this.columnsCount) {
            const childrenWidth = this.colGroup.children.map(item => {
                if (item.type === 'element' && item.tagName === 'col') {
                    const colAttr = (0, utils_1.getAttributeMap)(item.attributes);
                    const colStyles = (0, utils_1.parseStyles)(colAttr['style']);
                    const [value, unitType] = (0, utils_1.parseSizeValue)(colStyles['width']);
                    switch (unitType) {
                        case 'vw':
                        case '%': {
                            return (this.width * value) / 100;
                        }
                        case 'vh':
                        case 'auto': {
                            return mediumColWidth;
                        }
                        case 'pt': {
                            return (0, utils_1.convertPointsToTwip)(value);
                        }
                        case 'px': {
                            return (0, utils_1.convertPixelsToTwip)(value);
                        }
                        case 'em':
                        case 'rem': {
                            const fontSizeInTwip = (0, utils_1.convertPointsToTwip)(this.exportOptions.font.baseSize);
                            return fontSizeInTwip * value;
                        }
                    }
                }
            });
            const columnWidths = childrenWidth.filter(i => i !== undefined);
            return columnWidths;
        }
        else {
            return new Array(this.columnsCount).fill(mediumColWidth);
        }
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
    parseCaption(element) {
        return new HtmlParser_1.HtmlParser(this.exportOptions).parseHtmlTree(element.children).map(i => {
            if (i instanceof TextBlock_1.TextBlock) {
                i.options.alignment = docx_1.AlignmentType.CENTER;
            }
            return i;
        });
    }
}
exports.TableCreator = TableCreator;
