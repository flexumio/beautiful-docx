/// <reference types="node" />
/// <reference types="node" />
import { DocxExportOptions } from './options';
import { DeepPartial } from './utils';
export declare class DocxGenerator {
    readonly options: DocxExportOptions;
    private parser;
    private builder;
    constructor(docxExportOptions?: DeepPartial<DocxExportOptions>);
    generateDocx(html: string): Promise<Buffer>;
}
//# sourceMappingURL=DocxGenerator.d.ts.map