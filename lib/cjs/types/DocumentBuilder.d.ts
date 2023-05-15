import { DocumentElement, TextBlock } from './htmlParser/DocumentElements';
import { DocxExportOptions } from './options';
export declare class DocumentBuilder {
    options: DocxExportOptions;
    constructor(options: DocxExportOptions);
    build(content: DocumentElement[]): import("docx").Document;
    private postProcessContent;
    isBr(item: DocumentElement): item is TextBlock;
}
//# sourceMappingURL=DocumentBuilder.d.ts.map