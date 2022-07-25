import { IImageOptions, IParagraphOptions, IRunOptions, Paragraph, ParagraphChild } from 'docx';
import { TextInline } from './TextInline';

// TODO: change naming
export interface IText {
  type: TextType;
  content: (string | IText)[];
  options?: IParagraphOptions | IRunOptions | IImageOptions;
  getContent(): IText[];
  transformToDocx(): (Paragraph | ParagraphChild)[];
}

export class TextBlock implements IText {
  type: TextType = 'paragraph';
  content: IText[];

  constructor(public options: IParagraphOptions, public children: IText[]) {
    this.content = [this];
    this.children = children.filter(i => !(i instanceof TextInline && i.isEmpty));
    if (this.children.length === 0) {
      this.content = [];
    }
  }

  getContent(): IText[] {
    return this.content;
  }

  transformToDocx() {
    return [
      new Paragraph({
        ...this.options,
        children: this.children.flatMap(i => i.transformToDocx()),
      }),
    ];
  }
}

export type TextType = InlineTextType | BlockTextType;
export type BlockTextType = 'paragraph' | 'text' | 'heading' | 'list' | 'list-item' | 'blockquote' | 'image' | 'figure';
export type InlineTextType = 'br' | 'text' | 'strong' | 'i' | 'u' | 's' | 'a';
