/// <reference types="node" />
import { Mutable } from '../htmlParser/utils';
import { AlignmentType, NumberFormat, IParagraphOptions as ParagraphOptions } from 'docx';
export declare type ImageMap = {
    [url: string]: Buffer;
};
declare type LengthUnit = number;
declare type FontSize = number;
export declare enum PageOrientation {
    Portrait = "portrait",
    Landscape = "landscape"
}
export declare type PageFormatType = 'A3' | 'A4' | 'A5' | 'A6';
export declare type PageSize = {
    width: LengthUnit;
    height: LengthUnit;
};
export declare type PageFormatSizes = {
    [x in PageFormatType]: PageSize;
};
export declare type NumberingOptions = false | {
    type: NumberFormat;
    start?: number;
    align?: AlignmentType;
};
export declare type PageOptions = {
    orientation: PageOrientation;
    size: PageSize;
    margins: {
        top: LengthUnit;
        right: LengthUnit;
        bottom: LengthUnit;
        left: LengthUnit;
    };
    numbering: NumberingOptions;
};
export declare type FontOptions = {
    baseSize: FontSize;
    baseFontFamily: string;
    headersFontFamily: string;
    headersSizes: {
        h1: FontSize;
        h2: FontSize;
        h3: FontSize;
        h4: FontSize;
        h5: FontSize;
        h6: FontSize;
    };
};
export declare type DocxExportOptions = {
    page: PageOptions;
    font: FontOptions;
    verticalSpaces: number;
    ignoreIndentation: boolean;
    images?: ImageMap;
    table: TableOptions;
};
export declare type TableOptions = {
    cellPaddings: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
};
export declare type IParagraphOptions = Mutable<ParagraphOptions>;
export {};
//# sourceMappingURL=types.d.ts.map