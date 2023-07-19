"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlParser = void 0;
const docx_1 = require("docx");
const himalaya_1 = require("himalaya");
const DocumentElements_1 = require("./DocumentElements");
const ImagesAdapter_1 = require("./ImagesAdapter");
const TableOfContents_1 = require("./DocumentElements/TableOfContents");
class HtmlParser {
    constructor(options, containerWidth) {
        this.options = options;
        this.containerWidth = containerWidth;
        this.parseTopLevelElement = (element, pIndex) => {
            switch (element.tagName) {
                case 'html':
                case 'body':
                case 'header':
                case 'nav':
                case 'main':
                case 'aside':
                case 'footer':
                case 'div':
                case 'article':
                case 'section':
                case 'pre': {
                    return this.parseHtmlTree(element.children);
                }
                case 'p': {
                    return new DocumentElements_1.Paragraph(element, pIndex, this.options).getContent();
                }
                case 'br': {
                    return new DocumentElements_1.TextBlock({}, new DocumentElements_1.TextInline(element).getContent()).getContent();
                }
                case 'strong':
                case 'b':
                case 'i':
                case 'em':
                case 'u':
                case 'del':
                case 's':
                case 'span':
                case 'sup':
                case 'sub': {
                    return new DocumentElements_1.TextBlock({}, new DocumentElements_1.TextInline(element).getContent()).getContent();
                }
                case 'h1': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_1).getContent();
                }
                case 'h2': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_2).getContent();
                }
                case 'h3': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_3).getContent();
                }
                case 'h4': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_4).getContent();
                }
                case 'h5': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_5).getContent();
                }
                case 'h6': {
                    return new DocumentElements_1.Header(element, docx_1.HeadingLevel.HEADING_6).getContent();
                }
                case 'ul':
                case 'ol': {
                    return new DocumentElements_1.List(element, 0, this.options).getContent();
                }
                case 'figure': {
                    return new DocumentElements_1.Figure(element, this.options, this.containerWidth).getContent();
                }
                case 'table': {
                    return new DocumentElements_1.TableCreator(element, this.options).getContent();
                }
                case 'img': {
                    return new DocumentElements_1.Image(this.coverWithFigure(element), this.options, this.containerWidth).getContent();
                }
                case 'blockquote': {
                    return new DocumentElements_1.Blockquote(element).getContent();
                }
                case 'page-break': {
                    return new DocumentElements_1.PageBreak().getContent();
                }
                case 'table-of-contents': {
                    return new TableOfContents_1.TableOfContents().getContent();
                }
                default: {
                    throw new Error(`Unsupported top tag ${element.tagName}`);
                }
            }
        };
    }
    parse(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedContent = (0, himalaya_1.parse)(content);
            yield this.setImages(parsedContent);
            return this.parseHtmlTree(parsedContent);
        });
    }
    setImages(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield new ImagesAdapter_1.ImagesAdapter(this.options.images).downloadImages(content);
            this.options = Object.assign(Object.assign({}, this.options), { images });
        });
    }
    parseHtmlTree(root) {
        const paragraphs = [];
        let pCounts = 0;
        for (const child of root) {
            switch (child.type) {
                case 'text': {
                    paragraphs.push(...new DocumentElements_1.TextBlock({}, new DocumentElements_1.TextInline(child).getContent()).getContent());
                    break;
                }
                case 'element': {
                    const topLevelElement = this.parseTopLevelElement(child, pCounts);
                    paragraphs.push(...topLevelElement);
                    if (child.tagName === 'p') {
                        pCounts++;
                    }
                    break;
                }
            }
        }
        return paragraphs;
    }
    coverWithFigure(node) {
        const figureHtml = `<figure></figure>`;
        const element = (0, himalaya_1.parse)(figureHtml).find(i => i.type === 'element' && i.tagName === 'figure');
        element.children = [node];
        return element;
    }
}
exports.HtmlParser = HtmlParser;
