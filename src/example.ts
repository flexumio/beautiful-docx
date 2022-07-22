import { HtmlToDocx } from './index';
import * as fs from 'fs';

const exampleText = `
<h1>H1 <strong>Example</strong></h1>
<h2>H2 Example</h2>
<h3>H3 Example</h3>
<h4>H4 Example</h4>
<p>
  <s>Something</s>
  <br/>
  <i>sometimes</i>
  <u>sometimes</u>
  <strong>sometimes</strong>
</p>
<br/>
<br/>
<p>Something</p>
<strong>bold</strong>
<ul>
  <li>List Item</li>
  <li>List Item</li>
  <li>List Item</li>
</ul>
<ol>
  <li>List Item</li>
  <li>List Item</li>
  <li>List Item</li>
</ol>
<blockquote>
  <p>Blockquote</p> and just text
</blockquote>
`;

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
