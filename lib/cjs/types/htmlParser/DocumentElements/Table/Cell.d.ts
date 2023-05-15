import { ITableCellOptions, TableCell } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
export declare class Cell implements DocumentElement {
    private element;
    private exportOptions;
    private isHeader;
    type: DocumentElementType;
    options: ITableCellOptions;
    private readonly attributes;
    private readonly styles;
    constructor(element: Element, exportOptions: DocxExportOptions, isHeader: boolean);
    getContent(): this[];
    transformToDocx(): TableCell[];
    get tableCellChildren(): DocumentElement[];
    private get cellShading();
    private get borders();
    private get verticalAlign();
    private get margins();
}
//# sourceMappingURL=Cell.d.ts.map