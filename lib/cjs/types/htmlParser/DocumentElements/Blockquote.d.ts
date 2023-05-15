import { Paragraph, ParagraphChild } from 'docx';
import { DocxExportOptions, IParagraphOptions } from '../../options';
import { Element } from 'himalaya';
import { BlockTextType, DocumentElement } from './DocumentElement';
export declare class Blockquote implements DocumentElement {
    private element;
    private readonly exportOptions;
    type: BlockTextType;
    options: IParagraphOptions;
    private readonly content;
    constructor(element: Element, exportOptions: DocxExportOptions);
    private createContent;
    private parseChildren;
    private createInlineChild;
    getContent(): DocumentElement[];
    transformToDocx(): (Paragraph | ParagraphChild)[];
}
//# sourceMappingURL=Blockquote.d.ts.map