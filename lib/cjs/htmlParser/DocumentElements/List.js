"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Document_1 = require("./Document");
const ListItem_1 = require("./ListItem");
const TextBlock_1 = require("./TextBlock");
const TextInline_1 = require("./TextInline");
class List {
    constructor(element, level, exportOptions) {
        this.level = level;
        this.exportOptions = exportOptions;
        this.type = 'list';
        switch (element.tagName) {
            case 'ul': {
                this.childrenOptions = { bullet: { level } };
                this.children = this.getList(element.children);
                break;
            }
            case 'ol': {
                this.childrenOptions = {
                    numbering: { reference: Document_1.DEFAULT_NUMBERING_REF, level },
                };
                this.children = this.getList(element.children);
                break;
            }
            default:
                throw new Error(`Unsupported list type ${element.tagName}`);
        }
    }
    getList(children) {
        return children.flatMap(child => {
            if (child.type === 'element') {
                return new ListItem_1.ListItem(child, this.childrenOptions, this.level, this.exportOptions).getContent();
            }
            const textContent = new TextInline_1.TextInline(child).getContent();
            return new TextBlock_1.TextBlock({}, textContent).getContent();
        });
    }
    getContent() {
        return this.children;
    }
    transformToDocx() {
        return this.children.flatMap(i => i.transformToDocx());
    }
}
exports.List = List;
