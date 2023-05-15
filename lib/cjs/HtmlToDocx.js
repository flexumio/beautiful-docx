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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlToDocx = void 0;
const docx_1 = require("docx");
const DocumentBuilder_1 = require("./DocumentBuilder");
const htmlParser_1 = require("./htmlParser");
const ts_deepmerge_1 = __importDefault(require("ts-deepmerge"));
const options_1 = require("./options");
class HtmlToDocx {
    constructor(docxExportOptions) {
        if (docxExportOptions === undefined) {
            this.options = options_1.defaultExportOptions;
        }
        else {
            options_1.userOptionsSchema.parse(docxExportOptions);
            this.options = (0, ts_deepmerge_1.default)(options_1.defaultExportOptions, docxExportOptions);
        }
        this.parser = new htmlParser_1.HtmlParser(this.options);
        this.builder = new DocumentBuilder_1.DocumentBuilder(this.options);
    }
    generateDocx(html) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentContent = yield this.parser.parse(html);
            const doc = this.builder.build(documentContent);
            return yield docx_1.Packer.toBuffer(doc);
        });
    }
}
exports.HtmlToDocx = HtmlToDocx;
