import { Paragraph, ParagraphChild } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
export declare class Figure implements DocumentElement {
    type: DocumentElementType;
    private readonly content;
    constructor(element: Element, docxExportOptions: DocxExportOptions);
    getContent(): DocumentElement[];
    transformToDocx(): (Paragraph | ParagraphChild)[];
}
//# sourceMappingURL=Figure.d.ts.map