import { File } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { exampleText } from '../example/exampleText';
import { HtmlParser } from './htmlParser';
import { defaultExportOptions } from './options';

describe('DocumentBuilder', () => {
  test('should return File', async () => {
    const content = await new HtmlParser(defaultExportOptions).parse(exampleText);

    const instance = new DocumentBuilder(defaultExportOptions);

    expect(instance.build(content)).toBeInstanceOf(File);
  });
});
