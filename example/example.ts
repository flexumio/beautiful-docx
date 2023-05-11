/* istanbul ignore file */
import { HtmlToDocx } from '../src';
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
      numbering: false,
    },
    font: {
      baseFontFamily: 'Calibri',
      headersFontFamily: 'Calibri',
    },
    verticalSpaces: 2,
  });
  const buffer = await htmlToDocx.generateDocx(exampleText);
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

void main();
