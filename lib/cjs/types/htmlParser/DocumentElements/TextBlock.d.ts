import { Paragraph } from 'docx';
import { DocxExportOptions, IParagraphOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { Mutable } from '../utils';
export declare class TextBlock implements DocumentElement {
    options: Mutable<IParagraphOptions>;
    children: DocumentElement[];
    private readonly exportOptions?;
    type: DocumentElementType;
    constructor(options: Mutable<IParagraphOptions>, children?: DocumentElement[], exportOptions?: DocxExportOptions | undefined);
    getContent(): DocumentElement[];
    transformToDocx(): Paragraph[];
}
//# sourceMappingURL=TextBlock.d.ts.map