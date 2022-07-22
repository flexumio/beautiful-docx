// import { IParagraphOptions, Paragraph } from 'docx';
// import { DocxFragment } from './DocxFragment';

// export class TextBlock<T = Paragraph> extends Paragraph implements DocxFragment<T> {
//   content: T[];
//   constructor(public options: IParagraphOptions) {
//     super(options);
//     this.content = [this as unknown as T];
//   }

//   getContent() {
//     return this.content;
//   }
// }
import { IParagraphOptions, IRunOptions, Paragraph, ParagraphChild } from 'docx';
import { TextInline } from './TextInline';

export interface IText {
  type: TextType;
  content: (string | IText)[];
  options: IParagraphOptions | IRunOptions;
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
export type BlockTextType = 'paragraph' | 'text' | 'heading' | 'list' | 'list-item' | 'blockquote';
export type InlineTextType = 'br' | 'text' | 'strong' | 'i' | 'u' | 's' | 'a';
