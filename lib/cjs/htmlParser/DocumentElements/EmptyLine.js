"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyLine = void 0;
const docx_1 = require("docx");
class EmptyLine {
    constructor() {
        this.type = 'empty-line';
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [new docx_1.Paragraph({})];
    }
}
exports.EmptyLine = EmptyLine;
