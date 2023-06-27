import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';
import { DocumentElementType } from './DocumentElement';
export declare class Header extends TextBlock {
    type: DocumentElementType;
    constructor(element: Element, level: HeadingLevel);
}
//# sourceMappingURL=Header.d.ts.map