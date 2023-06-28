import { Paragraph, ParagraphChild } from 'docx';
import { IParagraphOptions } from '../../options';
import { Element } from 'himalaya';
import { BlockTextType, DocumentElement } from './DocumentElement';
export declare class Blockquote implements DocumentElement {
    private element;
    type: BlockTextType;
    options: IParagraphOptions;
    private readonly content;
    constructor(element: Element);
    private createContent;
    private parseChildren;
    private createInlineChild;
    getContent(): DocumentElement[];
    transformToDocx(): (Paragraph | ParagraphChild)[];
}
//# sourceMappingURL=Blockquote.d.ts.map