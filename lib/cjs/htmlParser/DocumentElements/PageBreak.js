"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageBreak = void 0;
const docx_1 = require("docx");
class PageBreak {
    constructor() {
        this.type = 'page-break';
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [new docx_1.Paragraph({ children: [new docx_1.PageBreak()] })];
    }
}
exports.PageBreak = PageBreak;
