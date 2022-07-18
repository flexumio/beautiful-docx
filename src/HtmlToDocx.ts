import { Packer } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { parseHtmlContent } from './htmlParser';
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
    const documentContent = await parseHtmlContent(html, this.options);
    const doc = new DocumentBuilder(this.options).build(documentContent);

    return await Packer.toBuffer(doc);
  }
}
