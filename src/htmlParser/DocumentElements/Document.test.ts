import { Document as DocxDocument } from 'docx';
import { defaultExportOptions } from '../../options';
import { HtmlParser } from '../HtmlParser';
import { Document } from './Document';

describe('Document', () => {
  let instance: Document;

  beforeAll(async () => {
    const html = '<p>Paragraph</p>';
    const documentContent = await new HtmlParser(defaultExportOptions).parse(html);

    instance = new Document(defaultExportOptions, documentContent);
  });

  test('transformToDocx should return DocxDocument instance', () => {
    const docx = instance.transformToDocx();

    expect(docx).toBeInstanceOf(DocxDocument);
  });
});
