"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.DEFAULT_NUMBERING_REF = exports.PAGE_TITLE_STYLE_ID = exports.FONT_TO_LINE_RATIO = void 0;
const docx_1 = require("docx");
const DocumentFooter_1 = require("./DocumentFooter");
const FONT_RATIO = 2;
exports.FONT_TO_LINE_RATIO = 10 * FONT_RATIO;
exports.PAGE_TITLE_STYLE_ID = 'PageTitle';
exports.DEFAULT_NUMBERING_REF = 'default-numbering';
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
                document: {
                    run: {
                        font: this.exportOptions.font.baseFontFamily,
                        size: this.exportOptions.font.baseSize * FONT_RATIO,
                        bold: false,
                    },
                },
                heading1: this.getHeadingFontSettings('h1'),
                heading2: this.getHeadingFontSettings('h2'),
                heading3: this.getHeadingFontSettings('h3'),
                heading4: this.getHeadingFontSettings('h4'),
                heading5: this.getHeadingFontSettings('h5'),
                heading6: this.getHeadingFontSettings('h6'),
            },
        };
    }
    getNumberingConfig() {
        return {
            config: [
                {
                    reference: exports.DEFAULT_NUMBERING_REF,
                    levels: [
                        {
                            level: 0,
                            format: docx_1.LevelFormat.DECIMAL,
                            text: '%1.',
                            suffix: docx_1.LevelSuffix.SPACE,
                        },
                        {
                            level: 1,
                            format: docx_1.LevelFormat.DECIMAL,
                            text: '%1.',
                            suffix: docx_1.LevelSuffix.SPACE,
                        },
                        {
                            level: 2,
                            format: docx_1.LevelFormat.DECIMAL,
                            text: '%1.',
                            suffix: docx_1.LevelSuffix.SPACE,
                        },
                        {
                            level: 3,
                            format: docx_1.LevelFormat.DECIMAL,
                            text: '%1.',
                            suffix: docx_1.LevelSuffix.SPACE,
                        },
                        {
                            level: 4,
                            format: docx_1.LevelFormat.DECIMAL,
                            text: '%1.',
                            suffix: docx_1.LevelSuffix.SPACE,
                        },
                    ],
                },
            ],
        };
    }
    get footer() {
        return new DocumentFooter_1.DocumentFooter(this.exportOptions);
    }
    getHeadingFontSettings(level) {
        return {
            run: {
                font: this.exportOptions.font.headersFontFamily,
                size: this.exportOptions.font.headersSizes[level] * FONT_RATIO,
                bold: true,
            },
            paragraph: {
                spacing: { line: this.exportOptions.font.headersSizes[level] * exports.FONT_TO_LINE_RATIO },
            },
        };
    }
}
exports.Document = Document;
