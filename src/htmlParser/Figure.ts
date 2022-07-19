import { Element } from 'himalaya';
import { DocxExportOptions } from '../options';
import { DocxFragment } from './DocxFragment';
import { parseImage } from './imageParser';
import { TableCreator } from './Table';
import { getAttributeMap, ParseResult } from './utils';

export class Figure implements DocxFragment<ParseResult> {
  content: ParseResult[];
  constructor(element: Element, docxExportOptions: DocxExportOptions) {
    const attributesMap = getAttributeMap(element.attributes);
    // TODO: rework with tagName
    const classString = attributesMap['class'] || '';
    const classes = classString.split(' ');

    if (classes.includes('table')) {
      const tableNode = element.children.find(i => i.type === 'element' && i.tagName === 'table') as Element;

      if (!tableNode) {
        throw new Error('No table element found');
      }

      this.content = new TableCreator(tableNode, docxExportOptions).getContent();
    } else if (classes.includes('image')) {
      this.content = parseImage(element, docxExportOptions);
    } else {
      throw new Error(`Unsupported figure with class ${attributesMap['class']}`);
    }
  }
  getContent() {
    return this.content;
  }
}
