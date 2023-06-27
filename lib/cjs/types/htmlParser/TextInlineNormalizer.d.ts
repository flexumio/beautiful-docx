import { DocumentElement } from './DocumentElements';
export declare class TextInlineNormalizer {
    private items;
    private children;
    constructor(items: DocumentElement[]);
    normalize(): DocumentElement[];
    private processDefault;
    private isInline;
    private getTextContentRefFromChild;
}
//# sourceMappingURL=TextInlineNormalizer.d.ts.map