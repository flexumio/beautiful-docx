import { Paragraph, ParagraphChild, TableCell } from 'docx';
export interface DocumentElement {
    type: DocumentElementType;
    getContent(): DocumentElement[];
    transformToDocx(): (Paragraph | ParagraphChild | TableCell)[];
}
export type DocumentElementType = InlineTextType | BlockTextType | TableElementType | ContainerElementType | ImageType | PageBreakType | TableOfContentsType | EmptyLineType;
export type BlockTextType = 'paragraph' | 'text' | 'heading' | 'list' | 'list-item' | 'blockquote';
export type InlineTextType = 'br' | 'text' | 'strong' | 'i' | 'u' | 's' | 'del' | 'a' | 'b' | 'em' | 'span' | 'sup' | 'sub';
export type TableElementType = 'table' | 'table-row' | 'table-cell';
export type ContainerElementType = 'figure';
export type ImageType = 'image';
export type PageBreakType = 'page-break';
export type TableOfContentsType = 'table-of-contents';
export type EmptyLineType = 'empty-line';
//# sourceMappingURL=DocumentElement.d.ts.map