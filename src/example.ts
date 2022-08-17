/* istanbul ignore file */
import { HtmlToDocx } from './index';
import * as fs from 'fs';
import { exampleText } from './exampleText';

const main = async () => {
  console.time('Loading');
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
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

main();
