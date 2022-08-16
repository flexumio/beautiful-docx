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
<p><a href='https://github.com/'>link</a></p>
<ul>
  <li>List Item
   <ul>
    <li>list item</li>
    <li>list item</li>
    <li>list item</li>
   </ul>
   list item2
  </li>
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
<figure class='image'>
<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png'/>
</figure>
<p>Paragraph</p>
<figure class="table">
  <table>
    <colgroup>
      <col style="width:14.29%;">
      <col style="width:14.29%;">
      <col style="width:14.29%;">
      <col style="width:14.29%;">
      <col style="width:14.29%;">
      <col style="width:14.29%;">
      <col style="width:14.26%;">
    </colgroup>
    <tbody>
      <tr>
        <td>das</td><td>sad</td><td>ss</td><td>d</td><td>&nbsp;</td><td>sda</td><td>dasdad</td>
        </tr>
      <tr>
        <td>&nbsp;</td><td>asdas</td><td>ds</td><td>asd</td><td>sdsad</td><td>asd</td><td>sad</td>
      </tr>
      <tr>
        <td>sd</td><td>sd</td><td>sd</td><td>sdsd</td><td>sd</td><td>sd</td><td>sd</td>
      </tr>
      <tr>
        <td>d</td><td>sd</td><td>sd</td><td>sd</td><td>sd</td><td>sd</td><td>sd</td>
      </tr>
      <tr>
        <td>sd</td><td>sd</td><td>sd</td><td>d</td><td>sd</td><td>sdsd</td><td>a</td>
      </tr>
      <tr>
        <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</figure>
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
