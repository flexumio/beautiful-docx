"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBlock = void 0;
const docx_1 = require("docx");
const TextInlineNormalizer_1 = require("../TextInlineNormalizer");
class TextBlock {
    constructor(options, children = []) {
        this.options = options;
        this.type = 'text';
        this.children = [];
        this.children = new TextInlineNormalizer_1.TextInlineNormalizer(children).normalize();
    }
    getContent() {
        if (this.children.length === 0) {
            return [];
        }
        return [this];
    }
    transformToDocx() {
        if (this.children.length === 0) {
            return [];
        }
        return [
            new docx_1.Paragraph(Object.assign(Object.assign({}, this.options), { children: this.children.flatMap(i => i.transformToDocx()) })),
        ];
    }
}
exports.TextBlock = TextBlock;
