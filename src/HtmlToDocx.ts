import { Packer } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { HtmlParser } from './htmlParser';

import { DocxExportOptions, OptionsBuilder } from './options';
import { DeepPartial } from './utils';

export class HtmlToDocx {
  options: DocxExportOptions;

  constructor(docxExportOptions?: DeepPartial<DocxExportOptions>) {
    const optionsBuilder = new OptionsBuilder();
    optionsBuilder.mergeOptions(docxExportOptions);
    this.options = optionsBuilder.options;
  }

  public async generateDocx(html: string): Promise<Buffer> {
    const documentContent = await new HtmlParser(this.options).parse(html);
    const doc = new DocumentBuilder(this.options).build(documentContent);

    return await Packer.toBuffer(doc);
  }
}
