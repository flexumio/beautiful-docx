import { DocxGenerator } from '.';
import { defaultExportOptions } from './options';
import * as fs from 'fs';

describe('DocxGenerator', () => {
  test('should return buffer', async () => {
    const htmlToDocx = new DocxGenerator({
      page: {
        size: {
          width: 5.5,
          height: 8,
        },
      },
      font: {
        baseFontFamily: 'Calibri',
        headersFontFamily: 'Calibri',
      },
      verticalSpaces: 1,
    });
    const exampleText = fs.readFileSync('./example/exampleText.html', 'utf8');

    const buffer = await htmlToDocx.generateDocx(exampleText);

    expect(buffer).toBeInstanceOf(Buffer);
  });

  test('should be created with default options without users options', () => {
    const instance = new DocxGenerator();

    expect(instance.options).toBeDefined();
    expect(instance.options).toStrictEqual(defaultExportOptions);
  });
});
