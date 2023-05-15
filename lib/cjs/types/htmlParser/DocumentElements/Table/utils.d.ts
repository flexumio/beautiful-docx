import { BorderStyle, IBorderOptions } from 'docx';
import { Node, Styles } from 'himalaya';
export declare const isInlineTextElement: (node: Node) => boolean;
export declare const parseBorderStyle: (style: string | undefined) => BorderStyle;
export declare const parseBorderOptions: (styles: Styles) => IBorderOptions;
export declare const getTableIndent: () => number;
//# sourceMappingURL=utils.d.ts.map