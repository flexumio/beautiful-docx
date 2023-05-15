"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paragraph = void 0;
const TextInline_1 = require("./TextInline");
const TextBlock_1 = require("./TextBlock");
const utils_1 = require("../utils");
class Paragraph extends TextBlock_1.TextBlock {
    constructor(element, index, exportOptions) {
        const options = {
            alignment: (0, utils_1.parseTextAlignment)(element.attributes),
            indent: (0, utils_1.getIndent)(index, exportOptions),
        };
        super(options, element.children.flatMap(child => new TextInline_1.TextInline(child).getContent()), exportOptions);
        this.type = 'paragraph';
    }
}
exports.Paragraph = Paragraph;
