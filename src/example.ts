import { HtmlToDocx } from './index';
import * as fs from 'fs';

const main = async () => {
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
  const buffer = await htmlToDocx.generateDocx('<p>Something</p>');

  fs.writeFileSync('test-lib.docx', buffer);
};

main();
