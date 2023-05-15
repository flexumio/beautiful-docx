"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableOfContents = void 0;
const docx_1 = require("docx");
class TableOfContents {
    constructor() {
        this.type = 'table-of-contents';
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [
            new docx_1.TableOfContents('Table of Contents', {
                hyperlink: true,
                headingStyleRange: '1-6',
            }),
        ];
    }
}
exports.TableOfContents = TableOfContents;
