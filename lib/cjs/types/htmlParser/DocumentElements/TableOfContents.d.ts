import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TableOfContents as DocxTableOfContents } from 'docx';
export declare class TableOfContents implements DocumentElement {
    type: DocumentElementType;
    getContent(): DocumentElement[];
    transformToDocx(): DocxTableOfContents[];
}
//# sourceMappingURL=TableOfContents.d.ts.map