import { AlignmentType } from 'docx';
import { Attribute, Styles } from 'himalaya';
import { DocxExportOptions } from '../options';
export declare const FIRST_LINE_INDENT_MILLIMETERS = 6;
export declare const PIXELS_TO_POINT_RATIO: number;
export type AttributeMap = {
    [k: string]: string;
};
export declare const getAttributeMap: (attribs: Attribute[]) => AttributeMap;
export declare const parseStyles: (stylesString: string | undefined) => Styles;
export declare const convertPixelsToPoints: (pixels: string | number) => number;
export declare const convertPointsToPixels: (points: string | number) => number;
export declare const convertPixelsToTwip: (pixels: number) => number;
export declare const convertTwipToPixels: (twip: number) => number;
export declare const convertEmuToMillimeters: (emu: number) => number;
export declare const convertMillimetersToEmu: (millimeters: number) => number;
export declare const convertPointsToTwip: (points: number) => number;
export declare const parseTextAlignment: (attribs: Attribute[]) => AlignmentType;
export declare const cleanTextContent: (content: string) => string;
export declare const getIndent: (paragraphIndex: number, docxExportOptions: DocxExportOptions) => {
    firstLine: number;
} | undefined;
export declare const isListTag: (tagName: string) => boolean;
export declare const getPageWidth: (exportOptions: DocxExportOptions) => number;
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
type PaddingsStyle = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare const parsePaddings: (styles: Styles) => Partial<PaddingsStyle>;
export declare const parsePaddingsMergedValue: (padding: string) => {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export type SizeUnit = 'px' | 'pt' | 'em' | 'rem' | 'vh' | 'vw' | '%' | 'auto';
export declare const parseSizeValue: (value: string | number) => [number, SizeUnit];
export declare const hasSpacesAtStart: (str: string) => boolean;
export declare const hasSpacesAtEnd: (str: string) => boolean;
export declare const getUUID: () => string;
export {};
//# sourceMappingURL=utils.d.ts.map