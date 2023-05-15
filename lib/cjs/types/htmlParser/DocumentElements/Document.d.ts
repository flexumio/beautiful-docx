import { Document as DocxDocument } from 'docx';
import { DocxExportOptions } from '../../options';
import { DocumentElement } from './DocumentElement';
export declare const FONT_TO_LINE_RATIO: number;
export declare const PAGE_TITLE_STYLE_ID = "PageTitle";
export declare const DEFAULT_NUMBERING_REF = "default-numbering";
export declare class Document {
    exportOptions: DocxExportOptions;
    children: DocumentElement[];
    constructor(exportOptions: DocxExportOptions, children: DocumentElement[]);
    transformToDocx(): DocxDocument;
    private getStyles;
    private getNumberingConfig;
    private getDefaultSectionsProperties;
    private get footer();
    private getHeadingFontSettings;
}
//# sourceMappingURL=Document.d.ts.map