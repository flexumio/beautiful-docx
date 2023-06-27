"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const TextBlock_1 = require("./TextBlock");
const TextInline_1 = require("./TextInline");
const utils_1 = require("../utils");
class Header extends TextBlock_1.TextBlock {
    constructor(element, level) {
        const options = {
            heading: level,
            alignment: (0, utils_1.parseTextAlignment)(element.attributes),
        };
        super(options, element.children.flatMap(child => new TextInline_1.TextInline(child).getContent()));
        this.type = 'heading';
    }
}
exports.Header = Header;
