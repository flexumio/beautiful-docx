# html-to-docx-ts

## Examples:

The simplest example is:

```typescript
import { generateDocx } from 'html-to-docx-ts';
import * as fs from 'fs';

const buffer = await generateDocx('<p>Something</p>');

fs.writeFileSync('test.docx', buffer);
```

It's possible to overwrite default docx options:

```typescript
import { generateDocx } from 'html-to-docx-ts';
import * as fs from 'fs';

const buffer = await generateDocx('<p>Something</p>', {
  pageWidth: 5,
  pageHeight: 6,
});

fs.writeFileSync('test.docx', buffer);
```

## Options:

`pageWidth`: `number` - page width in inches (default: `5.5`)

`pageHeight`: `number` - page height in inches (default: `8`)

`textFont`: `string` - text font type (default: `Calibri`)

`titleFont`: `string` - headers font type (default: `Calibri`)

`verticalSpaces`: `number` - vertical space between lines in millimeters (default: `0`)
