/* istanbul ignore file */
import { DocxGenerator } from '../src';
import * as fs from 'fs';
import { exampleText } from './exampleText';
import { AlignmentType, NumberFormat } from 'docx';
import { PageFormat } from '../src/options';

const main = async () => {
  console.time('Loading');
  const docxGenerator = new DocxGenerator({
    page: {
      size: PageFormat.A5,
      numbering: { type: NumberFormat.DECIMAL, align: AlignmentType.END },
      margins: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 15,
      },
    },
    font: {
      baseFontFamily: 'Times New Roman',
      headersFontFamily: 'Times New Roman',
      baseSize: 12,
      headersSizes: {
        h1: 16,
        h2: 14,
        h3: 12,
      },
    },
    ignoreIndentation: true,
    verticalSpaces: 1.15,
  });
  const buffer = await docxGenerator.generateDocx(exampleText);
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

void main();
