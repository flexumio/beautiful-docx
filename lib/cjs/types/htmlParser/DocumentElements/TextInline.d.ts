import { Node } from 'himalaya';
import { IRunOptions, ParagraphChild } from 'docx';
import { InlineTextType, DocumentElement } from './DocumentElement';
export declare const supportedTextTypes: InlineTextType[];
export declare class TextInline implements DocumentElement {
    private element;
    options: IRunOptions;
    type: InlineTextType;
    content: (string | DocumentElement)[];
    isEmpty: boolean;
    constructor(element: Node, options?: IRunOptions);
    getContent(): this[];
    transformToDocx(): ParagraphChild[];
}
//# sourceMappingURL=TextInline.d.ts.map