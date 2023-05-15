import { ITableRowOptions, Paragraph, ParagraphChild } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
export declare class TableRow implements DocumentElement {
    private isHeader;
    type: DocumentElementType;
    children: DocumentElement[];
    options: ITableRowOptions;
    constructor(element: Element, isHeader: boolean, exportOptions: DocxExportOptions);
    transformToDocx(): (Paragraph | ParagraphChild)[];
    getContent(): this[];
    get cellCount(): number;
}
//# sourceMappingURL=TableRow.d.ts.map