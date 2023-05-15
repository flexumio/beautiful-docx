import { ITableOptions, Table } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../../options';
import { TableRow } from './TableRow';
import { DocumentElement, DocumentElementType } from '../DocumentElement';
export declare class TableCreator implements DocumentElement {
    private element;
    private exportOptions;
    type: DocumentElementType;
    options: ITableOptions;
    children: TableRow[];
    private readonly attr;
    private colGroup;
    private readonly styles;
    private readonly content;
    private caption?;
    constructor(element: Element, exportOptions: DocxExportOptions);
    transformToDocx(): Table[];
    private createRows;
    private parseTableRowsFragment;
    private setColGroup;
    getContent(): DocumentElement[];
    private get columnsCount();
    private get width();
    private get columnWidth();
    private get borders();
    private parseCaption;
}
//# sourceMappingURL=TableCreator.d.ts.map