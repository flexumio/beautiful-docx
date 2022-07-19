# html-to-docx-ts

## Examples:

The simplest example is:

```typescript
import { HtmlToDocx } from 'html-to-docx-ts';
import * as fs from 'fs';

const htmlToDocx = new HtmlToDocx();
const buffer = await htmlToDocx.generateDocx('<p>Something</p>');

fs.writeFileSync('test.docx', buffer);
```

It's possible to overwrite default docx options:

```typescript
import { generateDocx } from 'html-to-docx-ts';
import * as fs from 'fs';

const htmlToDocx = new HtmlToDocx({
  pageWidth: 5,
  pageHeight: 6,
});
const buffer = await htmlToDocx.generateDocx('<p>Something</p>');

fs.writeFileSync('test.docx', buffer);
```

## Options:

`pageWidth`: `number` - page width in inches (default: `5.5`)

`pageHeight`: `number` - page height in inches (default: `8`)

`textFont`: `string` - text font type (default: `Calibri`)

`titleFont`: `string` - headers font type (default: `Calibri`)

`verticalSpaces`: `number` - vertical space between lines in millimeters (default: `0`)
