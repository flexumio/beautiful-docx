"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInlineNormalizer = void 0;
const DocumentElements_1 = require("./DocumentElements");
const utils_1 = require("./utils");
class TextInlineNormalizer {
    constructor(items) {
        this.items = items;
        this.children = [];
    }
    normalize() {
        this.items
            .filter(i => !(this.isInline(i) && i.isEmpty), this)
            .forEach((i, idx) => {
            const isCurrentInlineBlock = this.isInline(i);
            if (!isCurrentInlineBlock) {
                return this.children.push(i);
            }
            if (idx === 0) {
                return this.processDefault(i);
            }
            const prevChild = this.children[idx - 1];
            if (!this.isInline(prevChild)) {
                return this.processDefault(i);
            }
            const currentTextContentRef = this.getTextContentRefFromChild(i);
            const prevTextContentRef = this.getTextContentRefFromChild(prevChild);
            if (currentTextContentRef === null) {
                return this.children.push(i);
            }
            if (prevTextContentRef === null) {
                return this.processDefault(i);
            }
            const prevText = prevTextContentRef[0];
            const currentText = currentTextContentRef[0];
            if ((0, utils_1.hasSpacesAtEnd)(prevText) && (0, utils_1.hasSpacesAtStart)(currentText)) {
                currentTextContentRef[0] = currentTextContentRef[0].trimStart();
                prevTextContentRef[0] = prevTextContentRef[0].trimEnd() + ' ';
            }
            if ((0, utils_1.hasSpacesAtEnd)(prevText) && !(0, utils_1.hasSpacesAtStart)(currentText)) {
                prevTextContentRef[0] = prevTextContentRef[0].trimEnd() + ' ';
            }
            if (!(0, utils_1.hasSpacesAtEnd)(prevText) && (0, utils_1.hasSpacesAtStart)(currentText)) {
                currentTextContentRef[0] = ' ' + currentTextContentRef[0].trimStart();
            }
            return this.children.push(i);
        }, this);
        return this.children;
    }
    processDefault(child) {
        const ref = this.getTextContentRefFromChild(child);
        if (ref !== null) {
            ref[0] = ref[0].trimStart();
        }
        return this.children.push(child);
    }
    isInline(child) {
        return child instanceof DocumentElements_1.TextInline;
    }
    getTextContentRefFromChild(child) {
        const currentItemContent = child.content[0];
        if (typeof currentItemContent === 'string') {
            return child.content;
        }
        if (currentItemContent instanceof DocumentElements_1.TextInline) {
            return typeof currentItemContent.content[0] === 'string' ? currentItemContent.content : null;
        }
        return null;
    }
}
exports.TextInlineNormalizer = TextInlineNormalizer;
