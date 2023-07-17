import { File } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { HtmlParser } from './htmlParser';
import { defaultExportOptions } from './options';
import * as fs from 'fs';

describe('DocumentBuilder', () => {
  test('should return File', async () => {
    const exampleText = fs.readFileSync('./example/exampleText.html', 'utf8');

    const content = await new HtmlParser(defaultExportOptions).parse(exampleText);

    const instance = new DocumentBuilder(defaultExportOptions);

    expect(instance.build(content)).toBeInstanceOf(File);
  });
});
