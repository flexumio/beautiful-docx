import { HtmlToDocx } from './index';
import * as fs from 'fs';

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
  const buffer = await htmlToDocx.generateDocx(
    '<p><s>Something</s><br/><i>sometimes</i></p> <br/> <br/><p>Something</p> <strong>bold</strong>'
  );
  console.timeEnd('Loading');
  fs.writeFileSync('test-lib.docx', buffer);
};

main();
