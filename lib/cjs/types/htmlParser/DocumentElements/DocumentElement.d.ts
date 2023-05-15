import { Paragraph, ParagraphChild, TableCell } from 'docx';
export interface DocumentElement {
    type: DocumentElementType;
    getContent(): DocumentElement[];
    transformToDocx(): (Paragraph | ParagraphChild | TableCell)[];
}
export declare type DocumentElementType = InlineTextType | BlockTextType | TableElementType | ContainerElementType | ImageType | PageBreakType | TableOfContentsType;
export declare type BlockTextType = 'paragraph' | 'text' | 'heading' | 'list' | 'list-item' | 'blockquote';
export declare type InlineTextType = 'br' | 'text' | 'strong' | 'i' | 'u' | 's' | 'a' | 'b' | 'em' | 'span' | 'sup' | 'sub';
export declare type TableElementType = 'table' | 'table-row' | 'table-cell';
export declare type ContainerElementType = 'figure';
export declare type ImageType = 'image';
export declare type PageBreakType = 'page-break';
export declare type TableOfContentsType = 'table-of-contents';
//# sourceMappingURL=DocumentElement.d.ts.map