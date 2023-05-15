import { Paragraph } from 'docx';
import { Node } from 'himalaya';
import { TextBlock } from './TextBlock';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { DocxExportOptions, IParagraphOptions } from '../../options';
export declare class ListItem extends TextBlock {
    type: DocumentElementType;
    private readonly nestedElements;
    constructor(element: Node, options: IParagraphOptions, level: number, exportOptions: DocxExportOptions);
    getContent(): DocumentElement[];
    transformToDocx(): Paragraph[];
}
//# sourceMappingURL=ListItem.d.ts.map