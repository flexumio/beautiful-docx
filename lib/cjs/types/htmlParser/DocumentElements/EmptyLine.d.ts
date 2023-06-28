import { Paragraph } from 'docx';
import { DocumentElement, DocumentElementType } from './DocumentElement';
export declare class EmptyLine implements DocumentElement {
    type: DocumentElementType;
    getContent(): DocumentElement[];
    transformToDocx(): Paragraph[];
}
//# sourceMappingURL=EmptyLine.d.ts.map