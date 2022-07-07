import { generateDocx } from './index';
import * as fs from 'fs';

const main = async () => {
  const buffer = await generateDocx('<p>Something</p>', {
    pageWidth: 5.5,
    pageHeight: 8,
    textFont: 'Calibri',
    titleFont: 'Calibri',
    verticalSpaces: 0,
  });

  fs.writeFileSync('test-lib.docx', buffer);
};

main();
