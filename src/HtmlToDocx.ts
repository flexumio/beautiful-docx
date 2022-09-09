import { Packer } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { HtmlParser } from './htmlParser';
import merge from 'ts-deepmerge';

import { defaultExportOptions, DocxExportOptions, userOptionsSchema } from './options';
import { DeepPartial } from './utils';

export class HtmlToDocx {
  public readonly options: DocxExportOptions;
  private parser: HtmlParser;
  private builder: DocumentBuilder;

  constructor(docxExportOptions?: DeepPartial<DocxExportOptions>) {
    if (docxExportOptions === undefined) {
      this.options = defaultExportOptions;
    } else {
      userOptionsSchema.parse(docxExportOptions);

      this.options = merge(defaultExportOptions, docxExportOptions);
    }

    this.parser = new HtmlParser(this.options);
    this.builder = new DocumentBuilder(this.options);
  }

  public async generateDocx(html: string): Promise<Buffer> {
    const documentContent = await this.parser.parse(html);
    const doc = this.builder.build(documentContent);

    return await Packer.toBuffer(doc);
  }
}
