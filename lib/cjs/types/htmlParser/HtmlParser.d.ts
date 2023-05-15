import { Element, Node } from 'himalaya';
import { DocxExportOptions } from '../options';
import { DocumentElement } from './DocumentElements';
export declare class HtmlParser {
    options: DocxExportOptions;
    constructor(options: DocxExportOptions);
    parse(content: string): Promise<DocumentElement[]>;
    setImages(content: Node[]): Promise<void>;
    parseHtmlTree(root: Node[]): DocumentElement[];
    parseTopLevelElement: (element: Element, pIndex: number) => DocumentElement[];
    private coverWithFigure;
}
//# sourceMappingURL=HtmlParser.d.ts.map