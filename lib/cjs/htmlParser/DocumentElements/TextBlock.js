"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBlock = void 0;
const docx_1 = require("docx");
const TextInline_1 = require("./TextInline");
class TextBlock {
    constructor(options, children = [], exportOptions) {
        this.options = options;
        this.children = children;
        this.exportOptions = exportOptions;
        this.type = 'text';
        this.children = children.filter(i => !(i instanceof TextInline_1.TextInline && i.isEmpty));
    }
    getContent() {
        if (this.children.length === 0) {
            return [];
        }
        return [this];
    }
    transformToDocx() {
        var _a;
        if (this.children.length === 0) {
            return [];
        }
        return [
            new docx_1.Paragraph(Object.assign(Object.assign({}, this.options), { spacing: { after: (0, docx_1.convertMillimetersToTwip)(((_a = this.exportOptions) === null || _a === void 0 ? void 0 : _a.verticalSpaces) || 0) }, children: this.children.flatMap(i => i.transformToDocx()) })),
        ];
    }
}
exports.TextBlock = TextBlock;
