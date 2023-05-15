"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Figure = void 0;
const Image_1 = require("./Image");
const Table_1 = require("./Table");
class Figure {
    constructor(element, docxExportOptions) {
        this.type = 'figure';
        const tableNode = element.children.find(i => i.type === 'element' && i.tagName === 'table');
        const imageNode = element.children.find(i => i.type === 'element' && i.tagName === 'img');
        if (tableNode) {
            this.content = new Table_1.TableCreator(tableNode, docxExportOptions).getContent();
        }
        else if (imageNode) {
            this.content = new Image_1.Image(element, docxExportOptions).getContent();
        }
        else {
            const tagsNames = element.children.map(i => (i.type === 'element' ? i.tagName : i.type)).join(', ');
            throw new Error(`Unsupported figure with content: ${tagsNames}`);
        }
    }
    getContent() {
        return this.content;
    }
    transformToDocx() {
        return this.content.flatMap(i => i.transformToDocx());
    }
}
exports.Figure = Figure;
