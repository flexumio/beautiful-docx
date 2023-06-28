"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentBuilder = void 0;
const DocumentElements_1 = require("./htmlParser/DocumentElements");
class DocumentBuilder {
    constructor(options) {
        this.options = options;
    }
    build(content) {
        return new DocumentElements_1.Document(this.options, this.postProcessContent(content)).transformToDocx();
    }
    postProcessContent(docxTree) {
        const results = [];
        let iterator = 0;
        while (iterator < docxTree.length) {
            const currentItem = docxTree[iterator];
            const nextItem = docxTree[iterator + 1];
            const isCurrentItemImage = currentItem instanceof DocumentElements_1.Image;
            const isNextItemParagraph = nextItem instanceof DocumentElements_1.Paragraph;
            const isCurrentItemBr = this.isBr(currentItem);
            if (isCurrentItemBr) {
                results.push(new DocumentElements_1.EmptyLine());
                iterator += 1;
                continue;
            }
            if (!isCurrentItemImage) {
                results.push(currentItem);
                iterator += 1;
                continue;
            }
            if (isNextItemParagraph && currentItem.isFloating) {
                nextItem.children.push(currentItem);
                results.push(nextItem);
                iterator += 2;
            }
            else {
                results.push(DocumentElements_1.Image.getStaticImageElement(currentItem));
                iterator += 1;
            }
        }
        return results;
    }
    isBr(item) {
        return item instanceof DocumentElements_1.TextBlock && item.children.length === 1 && item.children[0].type === 'br';
    }
}
exports.DocumentBuilder = DocumentBuilder;
