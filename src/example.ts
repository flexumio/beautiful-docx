import { generateDocx } from './index';
import * as fs from 'fs';

const main = async () => {
  const buffer = await generateDocx('<p>Something</p>', {
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

  fs.writeFileSync('test-lib.docx', buffer);
};

main();
