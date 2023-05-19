/* istanbul ignore file */
import { DocxGenerator } from '../src';
import * as fs from 'fs';
import { exampleText } from './exampleText';
import { AlignmentType, NumberFormat } from 'docx';

const main = async () => {
  console.time('Loading');
  const docxGenerator = new DocxGenerator({
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
    verticalSpaces: 2,
  });
  const buffer = await docxGenerator.generateDocx(exampleText);
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

void main();
