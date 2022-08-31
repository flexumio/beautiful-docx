import { HtmlToDocx } from '.';
import { exampleText } from './exampleText';

describe('HtmlToDocx', () => {
  test('should return buffer', async () => {
    const htmlToDocx = new HtmlToDocx({
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
      verticalSpaces: 0,
    });
    const buffer = await htmlToDocx.generateDocx(exampleText);

    expect(buffer).toBeInstanceOf(Buffer);
  });
});
