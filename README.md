# Html To Docx

# Motivation

On one of our projects, a challenge arose: to convert an html document into a docx. The converter must support ToC generation, basic styling, image downloading, and typing.

At first, we used a paid API for this, specializing in html to docx conversion. But the results were not satisfactory - very low customization and lack of support for many important features for us.

After that, there was a search for libraries that would meet our requirements, but none of them came up.

Subsequently, we switched to a self-written solution - conversion to docx based on the open library - [`docx`](https://www.npmjs.com/package/docx).
After successfully using it on our own project, we decided to turn our converter into an open-source library to help solve similar problems.

Our goal is to create a flexible and easy-to-customize html to docx conversion tool.

Its code must support typing and be fully covered by tests. Documentation should be transparent, accurately describe the capabilities and support of the library.

# Competitors

## **Open source tools**

### **html-to-docx**

**Github:** [https://github.com/privateOmega/html-to-docx](https://github.com/privateOmega/html-to-docx)

**Weekly downloads:** 6k.

**Github stars:** 150.

**Maintainability:** the project is maintained by one person and the last changes were made 2 months ago.

**Documentation:** simple README file with the description of some options.

**Why we didn’t choose this project:** doesn’t support TOC generation, pure documentation, pure image support

**Advantages:**

1. Supports docx specific options (page orientation, page margins)
2. Supports page breaks (`<div class=“page-break”></div>`)

**Disadvantages:**

1. Pure documentation. Hard to know what it supports.
2. Supports only base64 images without wrapping options
3. Pure code quality
4. Cannot create TOC
5. Doesn’t support custom page sizes

### **html-docx-js**

**Github:** [https://github.com/evidenceprime/html-docx-js](https://github.com/evidenceprime/html-docx-js)

**Weekly downloads:** 7k

**Github stars:** 878

**Maintainability:** last updated 6 years ago

**Why we didn’t choose this project:** doesn’t support TOC generation, pure documentation, pure image support, doesn’t support custom page sizes

**Disadvantages:**

1. Pure documentation. Hard to know what it supports.
2. Supports only base64 images without wrapping options
3. Cannot create TOC
4. Doesn’t support custom page sizes

### **html-docx-js-typescript**

**Github:** [https://github.com/caiyexiang/html-docx-js-typescript](https://github.com/caiyexiang/html-docx-js-typescript)

**Weekly downloads:** 3k

**Github stars:** 31

**Maintainability:** last updated 2 years ago.

**Why we didn’t choose this project:** it’s based on html-docx-js but with typescript support and contains the same problems as html-docx-js project

**Advantages:**

1. Supports Typescript

**Disadvantages:**

1. The same as html-docx-js

## **Paid tools**

### **CKEditor Docx Converter**

[https://docx-converter.cke-cs.com/docs#section/General](https://docx-converter.cke-cs.com/docs#section/General)

**Advantages:**

1. Great documentation
2. Supports CSS

**Disadvantages:**

1. Doesn’t support custom page sizes
2. Doesn’t support TOC generation
3. Paid tool

## **ConvertAPI**

[https://www.convertapi.com/html-to-docx](https://www.convertapi.com/html-to-docx)

**Advantages:**

1. Nice Live Demo Page

**Disadvantages:**

1. Lack of documentation. It isn’t possible to know what it supports.

## **What will differentiate us from our competitors?**

1. **Supporting images by URL and preloading images.**
2. **TOC generation**
3. **Supporting more configuration options (page size, font type, etc.)**
4. **Typescript**
5. **100% test coverage**
6. **Clear documentation**

# **Html tags**

**Supported**: a, article, blockquote, br, caption, col, colgroup, div, figure, h1-h4, i, img, li, ol, p, s, section, strong, table, tbody, td, tfoot,  th, tr, u, ul

**Support will be added in the future:** abbr, address, b, cite, code, dd, del, din, dl, dt, em, figcaption, h5-h6, hr, ins, kbd, mark, picture, pre, q, small, span!!, sub, sup, time

**Custom tags:** page-break, table-of-contents

# **Get started**

## **Install**

```bash
npm install -S html-to-docx-ts
```

## **Usage**

You create a converter instance. It receives parameters as input, or uses default parameters.

The converter has a `generateDocx` method that receives an html string and returns a buffer with the finished document.

```tsx
import { HtmlToDocx } from 'html-to-docx-ts';
import * as fs from 'fs';

const html = `
<div>
	<p>Example</p>
</div>
`;

const htmlToDocx = new HtmlToDocx({
  page: {
    size: {
      width: 5.5,
      height: 8,
    },
  },
});

const buffer = await htmlToDocx.generateDocx(html);

fs.writeFileSync('example.docx', buffer);
```

# **Options**

Options is an object with next fields

### `page: PageOptions`

Sets document page settings.

- `orientation: PageOrientaion`

  Page orientation.

  **Available values**: `portrait`, `landscape`

  **Default**: `portrait`

  **Example**:

  ```tsx
  import { PageOrientation } from 'html-to-docx-ts';

  const options = {
    page: {
      orientation: PageOrientation.Portrait,
    },
  };
  ```

- `size: PageSize`
  Page sizes in inches.

  - `width: number`

  - `height: number`

    You can use ready-made page sizes - `PageFormat`

    **Available values**: `A3, A4, A5, A6`;

    **Default:** `A4` (8.3’x11.7’)

    **Example**:

  ```tsx
  import { PageFormat } from 'html-to-docx-ts';

  const options = {
    page: {
      sizes: PageFormat.A4,
    },
  };
  ```

  ```tsx
  const options = {
    page: {
      sizes: {
        width: 8.3,
        height: 11.7,
      },
    },
  };
  ```

- `margins: object`

  Page margins in millimeters

  - `top: number`

    **Default:** 19 мм

  - `left: number`

    **Default:** 19 мм

  - `bottom: number`

    **Default:** 19 мм

  - `right: number`

    **Default:** 12.7 мм

    **Example:**

  ```tsx
  const options = {
    page: {
      margins: {
        top: 25,
        left: 25,
        right: 20,
        bottom: 25,
      },
    },
  };
  ```

- `numbering: boolean`

  Responsible for displaying page numbering.

  **Default:** `true`

  **Example:**

  ```tsx
  const options = {
    page: {
      numbering: false,
    },
  };
  ```

### `font: FontOptions`

Configuration of font sizes and font-family

- `baseSize: number`

  Base text font size in points.

  **Default:** `12`

  **Example:**

  ```tsx
  const options = {
    font: {
      baseSize: 11,
    },
  };
  ```

- `headersSizes: object`
  Header font sizes of different levels

  - `h1: number`

    **Default:** `19.5`

  - `h2: number`

    **Default:** `16.5`

  - `h3: number`

    **Default:** `15`

  - `h4: number`

    **Default:** `13.5`

    **Example:**

  ```tsx
  const options = {
    font: {
      headerSizes: {
        h1: 22,
        h2: 20,
        h3: 18,
        h4: 16,
      },
    },
  };
  ```

- `baseFontFamily: string`

  Font family for base text

  **Available values**: any Microsoft Office Word font.

  **Default**: `'Arial'`

  **Example:**

  ```tsx
  const options = {
    font: {
      baseFontFamily: 'Times New Roman',
    },
  };
  ```

- `headersFontFamily: string`

  Font family for headers.

  **Available values**: any Microsoft Office Word font.

  **Default**: `'Arial'`

  **Example:**

  ```tsx
  const options = {
    font: {
      headersFontFamily: 'Times New Roman',
    },
  };
  ```

### `table: TableOptions`

Properties of tables

- `cellPaddings: object`

  Table cell paddings configuration in pixels

  - `top: number`

    **Default:** `5`

  - `left: number`

    **Default:** `5`

  - `right: number`

    **Default:** `5`

  - `bottom: number`

    **Default:** `5`

**Example:**

```tsx
const options = {
  table: {
    cellPaddings: {
      top: 10,
      left: 15,
    },
  },
};
```

### `images: ImageMap | undefined`

The `images` parameter allows you to preload the images used in the `html`

This is an object in which the `urls` of the images are the keys, and the `Buffer` with the image is the value.

If you do not pass the `images` parameter, the images will be automatically loaded from the `src` attributes of the `img` tags.

**Example:**

```tsx
const imageSourceUrl = 'https://example.com/image.png';
const html = `
<img src="${imageSourceUrl}" />
`;

const res = await axios.get(imageSourceUrl, { responseType: 'arraybuffer' });
const imageBuffer = Buffer.from(res.data, 'binary');

const options = {
  images: {
    [imageSourceUrl]: imageBuffer,
  },
};
```

### `verticalSpaces: number`

Vertical indents between lines in millimeters.

**Default:** `0`

**Example:**

```tsx
const options: {
  verticalSpaces: 10;
};
```

### `ignoreIndentation: boolean`

If `false`, adds an indent for the first line of the paragraph.

Indentation is ignored for the first paragraph in a block.

**Default:** `false`

**Example:**

```tsx
const options: {
  textIndentation: true;
};
```

# Supported type of contents

The `html-to-docx-ts` library supports various types of `html` input content.

## Plan text

Will be reformatted into a paragraph with appropriate content.

**Example:**

```tsx
const html = 'Some plain text'; // equal to <p>Some plain text</p>
```

## Supported inline tags

The library supports the following inline tags: `'strong', 'i', 'u', 's', 'br'`;

Each of them will be converted into a paragraph with the corresponding content. Accordingly, each tape will start on a new line.

To avoid this, it is necessary to immediately wrap the inline content in the `<p>` tag

**Example:**

```tsx
const html = `
<strong>strong</strong>
<i>italic</i>
`;
// equal to:
// <p><strong>strong</strong></p>
// <p><i>italic</i></p>
```

## **Container tags**

The library supports the following container tags: `'div', 'article', 'section'`

These tags will be ignored and their content will be treated as root content, following the same rules.

**Example:**

```tsx
const html = `
<div>plain text</div>
<section><p>paragraph</p></section>
`;
// equal to:
// <p>plain text</p>
// <p>paragraph</p>
```

## Block tags

The library supports the following block tags: `'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'figure', 'blockquote', 'table', 'img'`

Block tags cannot be nested in other block tags, except for the cases provided for in the exceptions (see the description of a specific tag)

**Example:**

```tsx
const html = `
  <h1>H1 Example</h1>
  <h2>H2 Example</h2>
  <h3>H3 Example</h3>
  <h4>H4 Example</h4>
  <p>paragraph with <i>italic</i> text</p>
  <ol>
    <li>List Item</li>
    <li>List Item</li>
    <li>List Item</li>
  </ol>
`;
```

## Custom tags

Supported custom tags: `page-break`, `table-of-contents`

Custom tags are required to insert additional content

# Tags - support and nesting

## `div, article, section`

Tags containers.

**Can be nested in:**

- document root
- container tag

**Supported content:**

- root content

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<section>
  <article>
    <div>
      <p>Paragraph</p>
    </div>
  </article>
</section>
`;
```

## `p`

Block tag. Converts to a paragraph with text.

**Can be nested in:**

- document root
- container tag
- `li` (partial support - displayed from a new line)
- `blockquote`
- `caption`
- `td`

**Supported content:**

- plain text
- inline-tags
- `img`

**Attributes**: not supported

**Inline-styles**:

- `text-align` - horizontal text position

  **Available values:** `justify`, `left`, `center`, `right`

  **Default**: `left`

**Extra:**

By default, `text-indent` is added for paragraphs (except the first paragraph in each block). This can be disabled by passing `ignoreIndentation: true`;

If necessary, you can add vertical indents between paragraphs. For this, you need to pass the parameter `verticalSpaces`.

**Example**:

```tsx
const html = `
<p style='text-align: center'>Paragraph 1</p>
<p>Paragraph 2</p>
<ul>
  <li>
    <p>List item</p>
  </li>
</ul>
`;
```

## `h1-h4`

Block tags. They are converted into headings of the appropriate level. Participate in `table-of-contents` formation

**Can be nested in:**

- document root
- container tag
- `li` (partial support - displayed from a new line)
- `caption`
- `td`

**Supported content:**

- plain text
- inline-tags
- `img`

**Attributes**: not supported

**Inline-styles**:

- `text-align` - horizontal text position

  **Available values:** `justify`, `left`, `center`, `right`

  **Default**: `left`

**Extra:**

For headings, you can set the `font size` and `font-family`. To do this, you need to pass the appropriate parameters: `font.headersSize`, `font.headersFontFamily`

**Example**:

```tsx
const html = `
  <h1 style='text-align: center'>Page Title</h1>
  <h2><i>Page subtitle</i></h2>
`;
```

## `ul, ol`

Block tags. Convert to lists.

**Can be nested in:**

- document root
- container tag
- `li` - are displayed as lower-level lists
- `caption`
- `td`

**Supported content:**

- `li`
- plain text - not recommended. Displayed from a new line as a paragraph

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<ul>
  <li>List item
      <ol>
        <li>List Item</li>
        <li>List Item</li>
        <li>List Item</li>
      </ol>
  </li>
  <li>List item</li>
<ul>
`;
```

## `li`

Block tag. Tag container. Displayed as a list item

**Can be nested in:**

- `ul`

**Supported content:**

- plain text - displayed as a list item
- root content - is displayed from a new line as plain text
- `ul` - nested list

**Attributes**: not supported

**Inline-styles**:

- `text-align` - horizontal text position

  **Available values:** `justify`, `left`, `center`, `right`

  **Default**: `left`

**Example:**

```tsx
const html = `
<ul>
  <li>List item
      <ol>
        <li>List Item</li>
        <li>List Item</li>
        <li>List Item</li>
      </ol>
  </li>
  <li>List item</li>
<ul>
`;
```

## `figure`

Block tag

**Can be nested in:**

- document root
- container tag
- `li`
- `caption`
- `td`

**Supported content:**

- `img`
- `table`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<figure>
  <img src='https://example.com/image.png'/>
</figure>
<figure>
  <table>
    <tbody>
      <tr>
        <td>Example</td>
      </tr>
    </tbody>
  </table>
</figure>
`;
```

## `img`

Inline-block tag. Responsible for displaying images.

**Can be nested in:**

- document root
- container tag
- `li`
- `caption`
- `td`
- `figure`

**Supported content:** not supported

**Attributes**:

- `src`

  Url to download the image.

**Inline-styles**:

- `float`

  Necessary for horizontal image positioning. Without an attribute - the image will be located in the center of the page

  **Available values:** `left, right, center`

  **Default:** `center`

- `width`

  Image width.
  Available units - `%, px, vw`

  If you do not specify the width, it will be automatically calculated from the initial dimensions of the image.
  If the width of the image is greater than the dimensions of the page - the image will be displayed on the entire width of the page.

  If you set the width in `%` or `vw` - the width will be calculated based on the page size.

  If you set the width in `px` - the width of the image will be equal to the value, but not more than the width of the page.
  Image height is calculated automatically based on image width and aspect ratio.

**Extra:**

Image orientation is calculated automatically based on file metadata.

Images for insertion can be preloaded (if they are found locally on the device or server). To do this, you need to download the image as a buffer and insert it into the `images` parameter

If a paragraph is found after the image, the image will be "linked" to this paragraph. If there is no paragraph after the image, it will be created automatically.

**Example:**

```tsx
const url = 'https://example.com/image.png';
const html = `
<figure>
  <img src='${url}'/>
</figure>
<img style='width: 100px; float: right' src='${url}'/>
<img style='width: 50%; float: left' src='${url}'/>	
`;
```

## `table`

Block tag. Responsible for displaying tables.

**Can be nested in:**

- document root
- container tag
- `li`
- `td`
- `figure`

**Supported content:**

- `thead`
- `tr`
- `tfoot`
- `tr`
- `colgroup`
- `caption`

**Attributes**: not supported

**Inline-styles**:

- `width`

  Supported units: `%`, `px`, `pt`, `vw`, `auto`, `em`, `rem`

  Without the attribute or with `auto` value - the table will stretch to the entire width of the page

  `vh` value ignored.

  `em`, `rem` sets table width relative to `options.font.baseSize` value

**Example:**

```tsx
const html = `
<table>
  <caption>Table</caption>
  <colgroup>
    <col style="width:30%;">
    <col style="width:70%;">
  </colgroup>
  <tbody>
    <tr>
  	  <td>First</td>
  	  <td>Second</td>
    </tr>
    <tr>
  	  <td>First</td>
  	  <td>Second</td>
    </tr>
  </tbody>
</table>
`;
```

## `caption`

Block tag. Container tag. Responsible for displaying the table header.

**Can be nested in:**

- `table`

**Supported content:**

- root-content (except table)

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <caption>Table</caption>
  <tbody>
    <tr>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
`;
```

## `thead`

Responsible for displaying rows of the table with a header.

**Can be nested in:**

- `table`

**Supported content:**

- `tr`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <thead>
    <tr>
      <td>Cell</td>
    </tr>
  </thead>
</table>
`;
```

## `tbody`

Responsible for displaying the body of the table

**Can be nested in:**

- `table`

**Supported content:**

- `tr`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <tbody>
    <tr>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
`;
```

## `tfoot`

Responsible for displaying the footer of the table

**Can be nested in:**

- `table`

**Supported content:**

- `tr`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <tfoot>
    <tr>
      <td>Cell</td>
    </tr>
  </tfoot>
</table>
`;
```

## `tr`

Responsible for displaying table rows

**Can be nested in:**

- `table`
- `tbody`
- `thead`
- `tfoot`

**Supported content:**

- `td`
- `th`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <tbody>
    <tr>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
`;
```

## `colgroup`

Responsible for setting column widths and styles for those columns

**Can be nested in:**

- `table`

**Supported content:**

- `col`

**Attributes**: not supported

**Inline-styles**: not supported

**Example:**

```tsx
const html = `
<table>
  <colgroup>
    <col style="width:30%;">
    <col style="width:70%;">
  </colgroup>
  <tbody>
    <tr>
      <td>First</td>
      <td>Second</td>
    </tr>
    <tr>
      <td>First</td>
      <td>Second</td>
    </tr>
  </tbody>
</table>
`;
```

## `td, th`

Responsible for table cells and their display

**Can be nested in:**

- `tbody`
- `tr`
- `thead`
- `tfoot`

**Supported content:**

- root content

**Attributes**:

- `rowspan, colspan`

  To merge cells into one horizontally and vertically.

  **Default:** `1`

**Inline-styles**:

- `background-color`

  Cell background.

  **Default:** `transparent`

  If the cell is inside `thead` - default background will be - `#F2F2F2`

- `border`

  Sets the table cell border.

  **Format:** `{widht} {style} {color}`

  **Default:** `4px solid #bfbfbf`

- `border-width`

  **Default:** `4px`

- `border-color`

  **Default:** `#bfbfbf`

- `border-style`

  **Default:** `solid`

The `border-width, border-color, border-style` styles are more specific and overwrite the `border` value if it is passed

- `vertical-align`

  Vertical content positioning

  **Available values:** `top, bottom, center`

  **Default:** `center`

- `padding`

  Internal cell indents

  **Format:**

  - `{top} {right} {bottom} {left}`
  - `{top} {left, right} {bottom}`
  - `{top, bottom} {left, right}`
  - `{top, left, right, bottom}`

  **Default value:** `5px`

- `padding-left`, `padding-right`, `padding-top`, `padding-bottom`

  Indent accordingly for each side of the cell.

  **Default:** `5px`

Also, the internal indents of the table cells can be set for the entire table through the parameter `table.cellPaddings`.

Values written through the `style` property have greater specificity than values passed through parameters and are overwritten accordingly.

Values specific to each side of the cell have greater specificity than padding values and are overwritten accordingly.

**Example:**

```tsx
const html = `
<table>
  <colgroup>
    <col style="width:30%;">
    <col style="width:70%;">
  </colgroup>
  <tbody>
    <tr>
      <td style="border: 5px solid #000; padding: 10px">First</td>
      <td rowspan="2">Second</td>
    </tr>
    <tr>
      <td>First</td>
    </tr>
  </tbody>
</table>
`;
```

## `col`

Responsible for setting the width of the column.

**Can be nested in:**

- `colgroup`

**Supported content:** not supported

**Attributes**: not supported

**Inline-styles**:

- `width`

  Responsible for the width of the table columns.
  Supported units: `%`, `px`, `pt`, `vw`, `auto`, `em`, `rem`

  Without the attribute or with `auto` value - the size of the column will be automatically calculated from the width of the table and the number of columns.

  `vh` value ignored.

  `em`, `rem` sets table columns width relative to `options.font.baseSize` value

  If the number of `col` does not correspond to the number of columns - the size of the columns will be automatically calculated from the width of the table and the number of columns

**Example:**

```tsx
const html = `
<table>
  <colgroup>
    <col style="width:30%;">
    <col style="width:70%;">
  </colgroup>
  <tbody>
    <tr>
      <td>First</td>
      <td>Second</td>
    </tr>
    <tr>
      <td>First</td>
      <td>Second</td>
    </tr>
  </tbody>
</table>
`;
```

## `br`

Inline tag. Adds line break.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

When present in the root of the document or container tags, it is wrapped in a paragraph, which visually adds 2 line breaks.

**Supported content:** not supported

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <br/> new line<p>
`;
```

## `strong`

Inline tag. Makes the text bold.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

If there are containers in the root of the document or tags - it is wrapped in a paragraph, which is why it is displayed from a new line.

**Supported content:**

- plain text
- inline-tags

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <strong>strong</strong><p>
`;
```

## `i`

Inline tag. Makes the text italic.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

If there are containers in the root of the document or tags - it is wrapped in a paragraph, which is why it is displayed from a new line.

**Supported content:**

- plain text
- inline-tags

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <i>italic</i><p>
`;
```

## `u`

Inline tag. Makes the text underlined.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

If there are containers in the root of the document or tags - it is wrapped in a paragraph, which is why it is displayed from a new line.

**Supported content:**

- plain text
- inline-tags

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <u>underlined</u><p>
`;
```

## `s`

Inline tag. Makes the text crossed out.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

If there are containers in the root of the document or tags - it is wrapped in a paragraph, which is why it is displayed from a new line.

**Supported content:**

- plain text
- inline-tags

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <s>strikethrough</s><p>
`;
```

## `a`

Inline tag. Inserts a link.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`
- `p`
- `h1-h4`

If there are containers in the root of the document or tags - it is wrapped in a paragraph, which is why it is displayed from a new line.

**Supported content:**

- plain text
- inline-tags

**Attributes**:

- `href`

  The `URL` of the page that should open when clicked.

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>some text <a href='https://example.com'>example.com</a><p>
`;
```

## `page-break`

Adds a page break.

**Can be nested in:**

- document root
- container tag
- `li`
- `blockquote`
- `caption`
- `td`

**Supported content:** not supported

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<p>Page 1</p>
<page-break/>
<p>Page 2</p>
`;
```

## `table-of-contents`

Adds a table of contents to the document, automatically generated based on the headings.

**Can be nested in:**

- document rott
- container tag
- `li`
- `blockquote`
- `caption`
- `td`

**Supported content:** not supported

**Attributes**: not supported

**Inline-styles**: not supported

**Example**:

```tsx
const html = `
<table-of-contents/>
<h1>H1 Example</h1>
<h2>H2 Example</h2>
<h3>H3 Example</h3>
<h4>H4 Example</h4>
`;
```

# **Directions for further work**

1. Increased support for html tags.
2. Support CSS
3. Support CSS-classes
4. HTML validation
5. Creating a live-page demo

# Contributing

…

# License

…
