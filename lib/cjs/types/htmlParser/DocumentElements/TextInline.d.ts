import { Node, Attribute } from 'himalaya';
import { IRunOptions, ParagraphChild } from 'docx';
import { InlineTextType, DocumentElement } from './DocumentElement';
export declare const supportedTextTypes: InlineTextType[];
export declare class TextInline implements DocumentElement {
    private element;
    options: IRunOptions;
    type: InlineTextType;
    content: (string | DocumentElement)[];
    isEmpty: boolean;
    constructor(element: Node & {
        attributes?: [Attribute] | undefined;
    }, options?: IRunOptions);
    getContent(): this[];
    transformToDocx(): ParagraphChild[];
    private get textColor();
    private get textShading();
}
//# sourceMappingURL=TextInline.d.ts.map