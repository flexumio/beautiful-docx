import { Paragraph } from 'docx';
import { IParagraphOptions } from '../../options';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { Mutable } from '../utils';
export declare class TextBlock implements DocumentElement {
    options: Mutable<IParagraphOptions>;
    type: DocumentElementType;
    children: DocumentElement[];
    constructor(options: Mutable<IParagraphOptions>, children?: DocumentElement[]);
    getContent(): DocumentElement[];
    transformToDocx(): Paragraph[];
}
//# sourceMappingURL=TextBlock.d.ts.map