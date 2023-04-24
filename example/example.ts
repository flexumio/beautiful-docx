/* istanbul ignore file */
import { HtmlToDocx } from '../src';
import * as fs from 'fs';
import { exampleText } from './exampleText';
import { AlignmentType, NumberFormat } from 'docx';

const main = async () => {
  console.time('Loading');
  const htmlToDocx = new HtmlToDocx({
    page: {
      size: {
        width: 5.5,
        height: 8,
      },
      numbering: { type: NumberFormat.LOWER_LETTER, align: AlignmentType.END },
    },
    font: {
      baseFontFamily: 'Calibri',
      headersFontFamily: 'Calibri',
    },
    verticalSpaces: 10,
  });
  const buffer = await htmlToDocx.generateDocx(exampleText);
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

void main();
