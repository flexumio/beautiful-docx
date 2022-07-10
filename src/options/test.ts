import { mergeWithDefaultOptions } from './defaultOptions';
import { PageFormat } from './docxOptions';

// TODO: rewrite this with actual tests

console.log(1);
console.log(mergeWithDefaultOptions(undefined));

console.log(2);
console.log(mergeWithDefaultOptions({ page: { size: PageFormat.A3 } }));
