import { Document as DocxDocument } from 'docx';
import { DocxExportOptions, defaultExportOptions } from '../../options';
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

test('create Docx without numbering', async () => {
  const html = '<p>Paragraph</p>';
  const options: DocxExportOptions = {
    ...defaultExportOptions,
    page: { ...defaultExportOptions.page, numbering: false },
  };
  const documentContent = await new HtmlParser(options).parse(html);

  const instance = new Document(options, documentContent);
  const docx = instance.transformToDocx();

  expect(docx).toBeInstanceOf(DocxDocument);
});
