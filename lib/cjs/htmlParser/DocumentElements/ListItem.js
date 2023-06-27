"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItem = void 0;
const docx_1 = require("docx");
const TextInline_1 = require("./TextInline");
const List_1 = require("./List");
const TextBlock_1 = require("./TextBlock");
const utils_1 = require("../utils");
const utils_2 = require("./Table/utils");
const HtmlParser_1 = require("../HtmlParser");
class ListItem extends TextBlock_1.TextBlock {
    constructor(element, options, level, exportOptions) {
        if (!(element.type === 'element' && element.tagName === 'li')) {
            throw new Error('The child of list should be list item');
        }
        const liOptions = Object.assign(Object.assign({}, options), { alignment: (0, utils_1.parseTextAlignment)(element.attributes) });
        const children = [];
        const nestedElements = [];
        element.children.forEach(child => {
            if ((0, utils_2.isInlineTextElement)(child)) {
                children.push(...new TextInline_1.TextInline(child).getContent());
                return;
            }
            if (child.type === 'element' && (0, utils_1.isListTag)(child.tagName)) {
                nestedElements.push(...new List_1.List(child, level + 1, exportOptions).getContent());
                return;
            }
            nestedElements.push(...new HtmlParser_1.HtmlParser(exportOptions).parseHtmlTree([child]));
        });
        super(liOptions, children);
        this.type = 'list-item';
        this.nestedElements = [];
        this.nestedElements = nestedElements;
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [
            new docx_1.Paragraph(Object.assign(Object.assign({}, this.options), { children: this.children.flatMap(i => i.transformToDocx()) })),
            ...this.nestedElements.flatMap(i => i.transformToDocx()),
        ];
    }
}
exports.ListItem = ListItem;
