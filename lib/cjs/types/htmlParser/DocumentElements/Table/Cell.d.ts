import { ITableCellOptions, TableCell } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
export declare class Cell implements DocumentElement {
    private element;
    private exportOptions;
    private isHeader;
    private cellWidth;
    type: DocumentElementType;
    options: ITableCellOptions;
    private readonly attributes;
    private readonly styles;
    constructor(element: Element, exportOptions: DocxExportOptions, isHeader: boolean, cellWidth: number);
    getContent(): this[];
    transformToDocx(): TableCell[];
    private get children();
    get tableCellChildren(): DocumentElement[];
    private get cellShading();
    private get borders();
    private get verticalAlign();
    private get margins();
    private get containerWidth();
}
//# sourceMappingURL=Cell.d.ts.map