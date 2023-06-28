"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.DEFAULT_NUMBERING_REF = exports.PAGE_TITLE_STYLE_ID = exports.FONT_TO_LINE_RATIO = void 0;
const docx_1 = require("docx");
const DocumentFooter_1 = require("./DocumentFooter");
const FONT_RATIO = 2;
exports.FONT_TO_LINE_RATIO = 10 * FONT_RATIO;
exports.PAGE_TITLE_STYLE_ID = 'PageTitle';
exports.DEFAULT_NUMBERING_REF = 'default-numbering';
const OL_START_INDENT = 350;
const OL_HANGING_INDENT = 260;
class Document {
    constructor(exportOptions, children) {
        this.exportOptions = exportOptions;
        this.children = children;
        this.getDefaultSectionsProperties = () => {
            const { numbering } = this.exportOptions.page;
            const pageNumbersConfig = numbering ? { start: numbering.start, formatType: numbering.type } : {};
            return {
                page: {
                    size: {
                        width: (0, docx_1.convertInchesToTwip)(this.exportOptions.page.size.width),
                        height: (0, docx_1.convertInchesToTwip)(this.exportOptions.page.size.height),
                    },
                    margin: {
                        top: (0, docx_1.convertMillimetersToTwip)(this.exportOptions.page.margins.top),
                        right: (0, docx_1.convertMillimetersToTwip)(this.exportOptions.page.margins.right),
                        bottom: (0, docx_1.convertMillimetersToTwip)(this.exportOptions.page.margins.bottom),
                        left: (0, docx_1.convertMillimetersToTwip)(this.exportOptions.page.margins.left),
                    },
                    pageNumbers: pageNumbersConfig,
                },
            };
        };
    }
    transformToDocx() {
        return new docx_1.Document({
            features: { updateFields: true },
            styles: this.getStyles(),
            numbering: this.getNumberingConfig(),
            sections: [
                {
                    properties: this.getDefaultSectionsProperties(),
                    footers: {
                        default: this.footer.transformToDocx(),
                    },
                    children: this.children.flatMap(i => i.transformToDocx()),
                },
            ],
        });
    }
    getStyles() {
        return {
            paragraphStyles: [
                {
                    id: exports.PAGE_TITLE_STYLE_ID,
                    name: 'Page Title',
                    basedOn: 'Normal',
                    next: 'Normal',
                    quickFormat: true,
                    run: {
                        font: this.exportOptions.font.headersFontFamily,
                        size: this.exportOptions.font.headersSizes.h1 * FONT_RATIO,
                        bold: true,
                    },
                    paragraph: {
                        alignment: docx_1.AlignmentType.CENTER,
                        spacing: { line: this.exportOptions.font.headersSizes.h1 * exports.FONT_TO_LINE_RATIO },
                    },
                },
            ],
            default: {
                document: this.getFontSettings(),
                listParagraph: this.getFontSettings(),
                heading1: this.getFontSettings('h1'),
                heading2: this.getFontSettings('h2'),
                heading3: this.getFontSettings('h3'),
                heading4: this.getFontSettings('h4'),
                heading5: this.getFontSettings('h5'),
                heading6: this.getFontSettings('h6'),
            },
        };
    }
    getNumberingConfig() {
        return {
            config: [
                {
                    reference: exports.DEFAULT_NUMBERING_REF,
                    levels: this.generateNumbering(),
                },
            ],
        };
    }
    generateNumbering() {
        return [0, 1, 2, 3, 4].map(level => ({
            level,
            format: docx_1.LevelFormat.DECIMAL,
            text: `%${level + 1}.`,
            suffix: docx_1.LevelSuffix.SPACE,
            style: {
                paragraph: {
                    indent: { left: OL_START_INDENT * (level + 2), hanging: OL_HANGING_INDENT },
                },
            },
        }));
    }
    get footer() {
        return new DocumentFooter_1.DocumentFooter(this.exportOptions);
    }
    getFontSettings(level) {
        if (level) {
            return {
                run: {
                    font: this.exportOptions.font.headersFontFamily,
                    size: this.exportOptions.font.headersSizes[level] * FONT_RATIO,
                    bold: true,
                },
                paragraph: {
                    spacing: {
                        line: this.exportOptions.font.headersSizes[level] * exports.FONT_TO_LINE_RATIO * this.exportOptions.verticalSpaces,
                    },
                },
            };
        }
        return {
            run: {
                font: this.exportOptions.font.baseFontFamily,
                size: this.exportOptions.font.baseSize * FONT_RATIO,
                bold: false,
            },
            paragraph: {
                spacing: {
                    line: this.exportOptions.font.baseSize * exports.FONT_TO_LINE_RATIO * this.exportOptions.verticalSpaces,
                },
            },
        };
    }
}
exports.Document = Document;
