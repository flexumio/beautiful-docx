import { IImageOptions, ImageRun, IMediaTransformation } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TextBlock } from './TextBlock';
declare enum ImageOrientation {
    Horizontal = 1,
    MirrorHorizontal = 2,
    Rotate180 = 3,
    MirrorVertical = 4,
    MirrorHorizontalAndRotate270 = 5,
    Rotate90 = 6,
    MirrorHorizontalAndRotate90 = 7,
    Rotate270 = 8
}
export declare class Image implements DocumentElement {
    private imageFigure;
    private exportOptions;
    type: DocumentElementType;
    options: IImageOptions;
    isFloating: boolean;
    private readonly style;
    constructor(imageFigure: Element, exportOptions: DocxExportOptions);
    private createOptions;
    private get floating();
    private getHorizontalPositionAlign;
    private getImageSize;
    getImageRotation(orientation?: ImageOrientation): Partial<IMediaTransformation>;
    private get margins();
    private getWrapping;
    getContent(): this[];
    transformToDocx(): ImageRun[];
    static getStaticImageElement(image: Image): TextBlock;
}
export {};
//# sourceMappingURL=Image.d.ts.map