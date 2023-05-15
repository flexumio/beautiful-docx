import { Paragraph } from 'docx';
import { DocumentElement, PageBreakType } from './DocumentElement';
export declare class PageBreak implements DocumentElement {
    type: PageBreakType;
    getContent(): DocumentElement[];
    transformToDocx(): Paragraph[];
}
//# sourceMappingURL=PageBreak.d.ts.map