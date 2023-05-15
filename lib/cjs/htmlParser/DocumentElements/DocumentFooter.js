"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentFooter = void 0;
const docx_1 = require("docx");
const TextBlock_1 = require("./TextBlock");
const TextInline_1 = require("./TextInline");
class DocumentFooter {
    constructor(exportOptions) {
        if (!exportOptions.page.numbering) {
            this.children = [];
        }
        else {
            this.children = new TextBlock_1.TextBlock({ alignment: exportOptions.page.numbering.align }, new TextInline_1.TextInline({ type: 'text', content: 'Number' }, { children: [docx_1.PageNumber.CURRENT] }).getContent(), exportOptions).getContent();
        }
    }
    transformToDocx() {
        return new docx_1.Footer({ children: this.children.flatMap(i => i.transformToDocx()) });
    }
}
exports.DocumentFooter = DocumentFooter;
