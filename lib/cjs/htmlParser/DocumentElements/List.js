"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const options_1 = require("../../options");
const ListItem_1 = require("./ListItem");
const TextBlock_1 = require("./TextBlock");
const TextInline_1 = require("./TextInline");
const utils_1 = require("../utils");
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
                const reference = `${options_1.DEFAULT_NUMBERING_REF}-${(0, utils_1.getUUID)()}`;
                this.exportOptions.numberingReference.push(reference);
                this.childrenOptions = {
                    numbering: { reference, level },
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
