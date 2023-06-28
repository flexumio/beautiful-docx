"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockquote = void 0;
const docx_1 = require("docx");
const TextInline_1 = require("./TextInline");
const utils_1 = require("../utils");
const TextBlock_1 = require("./TextBlock");
const BLOCKQUOTE_SIZE = 25;
const BLOCKQUOTE_COLOR = '#cccccc';
const BLOCKQUOTE_SPACE = 12;
class Blockquote {
    constructor(element) {
        this.element = element;
        this.type = 'blockquote';
        this.options = {
            alignment: (0, utils_1.parseTextAlignment)(element.attributes),
            border: {
                left: { style: docx_1.BorderStyle.SINGLE, size: BLOCKQUOTE_SIZE, color: BLOCKQUOTE_COLOR, space: BLOCKQUOTE_SPACE },
            },
            indent: { left: (0, docx_1.convertMillimetersToTwip)(6) },
        };
        this.content = this.createContent(this.element);
    }
    createContent(element) {
        const childrenNodes = this.parseChildren(element);
        const children = childrenNodes.flatMap(node => {
            return new TextBlock_1.TextBlock(this.options, this.createInlineChild(node)).getContent();
        });
        return children.map(i => {
            i.type = 'blockquote';
            return i;
        });
    }
    parseChildren(element) {
        return element.children.flatMap(i => {
            const isElement = i.type === 'element';
            return isElement ? this.parseChildren(i) : i;
        }, this);
    }
    createInlineChild(node) {
        return new TextInline_1.TextInline(node, {
            italics: true,
        }).getContent();
    }
    getContent() {
        return this.content;
    }
    transformToDocx() {
        return this.content.flatMap(i => i.transformToDocx());
    }
}
exports.Blockquote = Blockquote;
