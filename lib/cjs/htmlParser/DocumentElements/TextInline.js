"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInline = exports.supportedTextTypes = void 0;
const docx_1 = require("docx");
const utils_1 = require("../utils");
const colortranslator_1 = require("colortranslator");
const LINK_TEXT_COLOR = '2200CC';
exports.supportedTextTypes = [
    'br',
    'text',
    'strong',
    'i',
    'u',
    's',
    'del',
    'a',
    'b',
    'em',
    'span',
    'sub',
    'sup',
];
const inlineTextOptionsDictionary = {
    br: { break: 1 },
    text: {},
    strong: { bold: true },
    b: { bold: true },
    em: { italics: true },
    i: { italics: true },
    u: { underline: { type: docx_1.UnderlineType.SINGLE } },
    s: { strike: true },
    del: { strike: true },
    a: {
        color: LINK_TEXT_COLOR,
        underline: { type: docx_1.UnderlineType.SINGLE },
    },
    span: {},
    sup: { superScript: true },
    sub: { subScript: true },
};
class TextInline {
    constructor(element, options = {}) {
        this.element = element;
        this.options = options;
        this.isEmpty = false;
        if (this.element.type === 'text') {
            this.content = [this.element.content];
            this.type = 'text';
            this.isEmpty = this.element.content.trim() === '';
            return;
        }
        if (this.element.type !== 'element') {
            this.content = [];
            this.type = 'text';
            return;
        }
        if (!exports.supportedTextTypes.includes(this.element.tagName)) {
            throw new Error(`Unsupported ${this.element.tagName} tag`);
        }
        this.options = Object.assign(Object.assign({ color: this.textColor, shading: this.textShading }, this.options), inlineTextOptionsDictionary[this.element.tagName]);
        this.content = this.element.children.flatMap(i => {
            return new TextInline(i, this.options).getContent();
        });
        this.type = this.element.tagName;
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        if (this.type === 'br') {
            return [new docx_1.TextRun(this.options)];
        }
        return this.content.flatMap(content => {
            var _a;
            if (typeof content === 'string') {
                return [new docx_1.TextRun(Object.assign({ text: (0, utils_1.cleanTextContent)(content) }, this.options))];
            }
            else {
                if (this.type === 'a') {
                    const element = this.element;
                    return [
                        new docx_1.ExternalHyperlink({
                            link: ((_a = element.attributes.find(item => item.key === 'href')) === null || _a === void 0 ? void 0 : _a.value) || '',
                            children: element.children.flatMap(child => new TextInline(child, Object.assign({}, this.options)).transformToDocx()),
                        }),
                    ];
                }
                return content.transformToDocx();
            }
        });
    }
    get textColor() {
        if (!this.element.attributes)
            return undefined;
        const textAttr = (0, utils_1.getAttributeMap)(this.element.attributes);
        const styles = (0, utils_1.parseStyles)(textAttr['style']);
        const color = styles['color'];
        if (color) {
            const textColorTranslator = new colortranslator_1.ColorTranslator(color);
            return textColorTranslator.HEX;
        }
        return undefined;
    }
    get textShading() {
        if (!this.element.attributes)
            return undefined;
        const textAttr = (0, utils_1.getAttributeMap)(this.element.attributes);
        const styles = (0, utils_1.parseStyles)(textAttr['style']);
        const backgroundColor = styles['background-color'];
        const color = styles['color'];
        if (backgroundColor || color) {
            const shading = {
                fill: 'auto',
                color: 'auto',
                type: docx_1.ShadingType.CLEAR,
            };
            if (backgroundColor) {
                const backgroundColorTranslator = new colortranslator_1.ColorTranslator(backgroundColor);
                shading.fill = backgroundColorTranslator.HEX;
            }
            if (color) {
                const textColorTranslator = new colortranslator_1.ColorTranslator(color);
                shading.color = textColorTranslator.HEX;
            }
            return shading;
        }
        return undefined;
    }
}
exports.TextInline = TextInline;
