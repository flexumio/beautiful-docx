import { DocxExportOptions, IParagraphOptions } from '../../options';
import { Element } from 'himalaya';
import { DocumentElement, DocumentElementType } from './DocumentElement';
export declare class List implements DocumentElement {
    private level;
    private readonly exportOptions;
    type: DocumentElementType;
    children: DocumentElement[];
    childrenOptions: IParagraphOptions;
    constructor(element: Element, level: number, exportOptions: DocxExportOptions);
    private getList;
    getContent(): DocumentElement[];
    transformToDocx(): (import("docx").Paragraph | import("docx").ParagraphChild | import("docx").TableCell)[];
}
//# sourceMappingURL=List.d.ts.map