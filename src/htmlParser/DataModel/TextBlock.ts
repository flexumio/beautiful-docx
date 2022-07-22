import { IParagraphOptions, Paragraph } from 'docx';

export interface IText {
  type: BlockType;
  children: (string | IText)[];
  options: IParagraphOptions;
  getContent(): IText[];
  transformToDocx(): Paragraph[];
}

export class TextBlock implements IText {
  type: BlockType = 'paragraph';
  children: TextBlock[];

  constructor(public options: IParagraphOptions) {
    this.children = [this];
  }

  getContent(): IText[] {
    return this.children;
  }

  transformToDocx() {
    return [new Paragraph(this.options)];
  }
}

type BlockType = 'paragraph' | 'text' | 'heading';
