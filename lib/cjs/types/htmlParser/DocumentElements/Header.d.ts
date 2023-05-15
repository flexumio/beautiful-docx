import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';
import { DocumentElementType } from './DocumentElement';
import { DocxExportOptions } from '../../options';
export declare class Header extends TextBlock {
    type: DocumentElementType;
    constructor(element: Element, level: HeadingLevel, exportOptions: DocxExportOptions);
}
//# sourceMappingURL=Header.d.ts.map