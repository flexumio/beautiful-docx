import { Footer } from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';
export declare class DocumentFooter {
    children: DocumentElement[];
    constructor(exportOptions: DocxExportOptions);
    transformToDocx(): Footer;
}
//# sourceMappingURL=DocumentFooter.d.ts.map