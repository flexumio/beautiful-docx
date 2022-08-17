import { File } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { exampleText } from './exampleText';
import { HtmlParser } from './htmlParser';
import { defaultExportOptions } from './options';

describe('DocumentBuilder', () => {
  test('should return File', async () => {
    const html = exampleText;
    const content = await new HtmlParser(defaultExportOptions).parse(html);

    const instance = new DocumentBuilder(defaultExportOptions);

    expect(instance.build(content)).toBeInstanceOf(File);
  });
});
