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
exports.ImagesAdapter = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
class ImagesAdapter {
    constructor(currentImages) {
        this.imagesMap = {};
        this.imagesUrls = [];
        if (currentImages) {
            this.imagesMap = currentImages;
        }
    }
    downloadImages(root) {
        return __awaiter(this, void 0, void 0, function* () {
            this.parseImagesUrls(root);
            // TODO: configure downloading in pack with 5-10 images
            yield Promise.all(this.imagesUrls.map(i => this.addImageToMap(i)));
            return this.imagesMap;
        });
    }
    parseImagesUrls(root) {
        for (const child of root) {
            if (child.type !== 'element') {
                continue;
            }
            if (child.tagName === 'img') {
                const imageAttr = (0, utils_1.getAttributeMap)(child.attributes);
                this.imagesUrls.push(imageAttr['src']);
            }
            if (child.children.length) {
                this.parseImagesUrls(child.children);
            }
        }
    }
    addImageToMap(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.imagesMap[url]) {
                this.imagesMap[url] = yield this.downloadImage(url);
            }
        });
    }
    downloadImage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(res.data, 'binary');
        });
    }
}
exports.ImagesAdapter = ImagesAdapter;
