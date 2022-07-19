import { IParagraphOptions, Paragraph } from 'docx';
import { DocxFragment } from './DocxFragment';

export class TextBlock<T = Paragraph> extends Paragraph implements DocxFragment<T> {
  content: T[];
  constructor(public options: IParagraphOptions) {
    super(options);
    this.content = [this as unknown as T];
  }

  getContent() {
    return this.content;
  }
}
