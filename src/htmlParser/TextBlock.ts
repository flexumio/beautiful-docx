import { IParagraphOptions, Paragraph } from 'docx';

export class TextBlock extends Paragraph {
  constructor(public options: IParagraphOptions) {
    super(options);
  }
}
