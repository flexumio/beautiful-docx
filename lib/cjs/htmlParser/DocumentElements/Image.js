"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const image_size_1 = require("image-size");
const docx_1 = require("docx");
const utils_1 = require("../utils");
var ImageOrientation;
(function (ImageOrientation) {
    ImageOrientation[ImageOrientation["Horizontal"] = 1] = "Horizontal";
    ImageOrientation[ImageOrientation["MirrorHorizontal"] = 2] = "MirrorHorizontal";
    ImageOrientation[ImageOrientation["Rotate180"] = 3] = "Rotate180";
    ImageOrientation[ImageOrientation["MirrorVertical"] = 4] = "MirrorVertical";
    ImageOrientation[ImageOrientation["MirrorHorizontalAndRotate270"] = 5] = "MirrorHorizontalAndRotate270";
    ImageOrientation[ImageOrientation["Rotate90"] = 6] = "Rotate90";
    ImageOrientation[ImageOrientation["MirrorHorizontalAndRotate90"] = 7] = "MirrorHorizontalAndRotate90";
    ImageOrientation[ImageOrientation["Rotate270"] = 8] = "Rotate270";
})(ImageOrientation || (ImageOrientation = {}));
class Image {
    constructor(imageFigure, exportOptions) {
        this.imageFigure = imageFigure;
        this.exportOptions = exportOptions;
        this.type = 'image';
        // TODO: Update Figure and parseTopLevelElement after merge
        const image = imageFigure.children.find(item => item.type === 'element' && item.tagName === 'img');
        const imageAttr = (0, utils_1.getAttributeMap)(image.attributes);
        const imageSourceUrl = imageAttr['src'];
        this.style = (0, utils_1.parseStyles)(imageAttr['style']);
        if (!exportOptions.images) {
            throw new Error('Cannot handle image insertion');
        }
        const imageBuffer = exportOptions.images[imageSourceUrl];
        this.options = this.createOptions(imageBuffer);
    }
    createOptions(imageBuffer) {
        return {
            data: imageBuffer,
            transformation: this.getImageSize(imageBuffer),
            floating: {
                horizontalPosition: {
                    relative: docx_1.HorizontalPositionRelativeFrom.COLUMN,
                    align: this.getHorizontalPositionAlign(),
                },
                verticalPosition: {
                    relative: docx_1.VerticalPositionRelativeFrom.PARAGRAPH,
                    align: docx_1.VerticalPositionAlign.BOTTOM,
                },
                wrap: this.getWrapping(),
                margins: {
                    top: 200,
                    bottom: 200,
                    left: 200,
                    right: 200,
                },
            },
        };
    }
    getHorizontalPositionAlign() {
        if (this.style['float'] === 'left') {
            return docx_1.HorizontalPositionAlign.LEFT;
        }
        if (this.style['float'] === 'right') {
            return docx_1.HorizontalPositionAlign.RIGHT;
        }
        return docx_1.HorizontalPositionAlign.CENTER;
    }
    getImageSize(image) {
        var _a;
        const pageWidth = (0, utils_1.getPageWidth)(this.exportOptions);
        const pageWidthPixels = (0, utils_1.convertTwipToPixels)(pageWidth);
        const imageDimensions = (0, image_size_1.imageSize)(image);
        const originWidth = imageDimensions.width || 0;
        const originHeight = imageDimensions.height || 0;
        const imageRotation = this.getImageRotation(imageDimensions.orientation);
        const imageWidth = (_a = this.style['width']) === null || _a === void 0 ? void 0 : _a.trim();
        if (imageWidth) {
            const isPercentWidth = imageWidth.endsWith('%');
            const isPixelsWidth = imageWidth.endsWith('px');
            const isVwWidth = imageWidth.endsWith('vw');
            if (isPercentWidth || isVwWidth) {
                const widthPercent = parseFloat(imageWidth.slice(0, -1));
                const widthPixels = (pageWidthPixels * widthPercent) / 100;
                const resizeRatio = widthPixels / originWidth;
                return Object.assign({ width: widthPixels, height: originHeight * resizeRatio }, imageRotation);
            }
            if (isPixelsWidth) {
                const widthNumber = parseFloat(imageWidth.slice(0, -1));
                const widthPixels = widthNumber >= pageWidth ? pageWidth : widthNumber;
                const resizeRatio = widthPixels / originWidth;
                return Object.assign({ width: widthPixels, height: originHeight * resizeRatio }, imageRotation);
            }
        }
        const maxImageWidth = pageWidthPixels;
        if (originWidth > maxImageWidth) {
            const resizeRatio = maxImageWidth / originWidth;
            return Object.assign({ width: maxImageWidth, height: originHeight * resizeRatio }, imageRotation);
        }
        return Object.assign({ width: originWidth, height: originHeight }, imageRotation);
    }
    getImageRotation(orientation) {
        // types of image orientations can be found here
        // https://exiftool.org/TagNames/EXIF.html#:~:text=0x0112,8%20=%20Rotate%20270%20CW
        switch (orientation) {
            case ImageOrientation.Horizontal:
                return {};
            case ImageOrientation.MirrorHorizontal:
                return { flip: { horizontal: true } };
            case ImageOrientation.Rotate180:
                return { rotation: 180 };
            case ImageOrientation.MirrorVertical:
                return { flip: { vertical: true } };
            case ImageOrientation.MirrorHorizontalAndRotate270:
                return { flip: { horizontal: true }, rotation: 270 };
            case ImageOrientation.Rotate90:
                return { rotation: 90 };
            case ImageOrientation.MirrorHorizontalAndRotate90:
                return { flip: { horizontal: true }, rotation: 90 };
            case ImageOrientation.Rotate270:
                return { rotation: 270 };
            default:
                return {};
        }
    }
    getWrapping() {
        if (this.style.float === 'left') {
            return {
                type: docx_1.TextWrappingType.SQUARE,
                side: docx_1.TextWrappingSide.RIGHT,
            };
        }
        if (this.style.float === 'right') {
            return {
                type: docx_1.TextWrappingType.SQUARE,
                side: docx_1.TextWrappingSide.LEFT,
            };
        }
        return {
            type: docx_1.TextWrappingType.TOP_AND_BOTTOM,
            side: docx_1.TextWrappingSide.BOTH_SIDES,
        };
    }
    getContent() {
        return [this];
    }
    transformToDocx() {
        return [new docx_1.ImageRun(this.options)];
    }
}
exports.Image = Image;
