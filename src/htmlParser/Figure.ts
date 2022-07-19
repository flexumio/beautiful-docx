import { Element } from 'himalaya';
import { DocxExportOptions } from '../options';
import { parseImage } from './imageParser';
import { TableCreator } from './Table';
import { getAttributeMap, ParseResult } from './utils';

export class Figure {
  private children: ParseResult[];
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

      this.children = new TableCreator(tableNode, docxExportOptions).create();
    } else if (classes.includes('image')) {
      this.children = parseImage(element, docxExportOptions);
    } else {
      throw new Error(`Unsupported figure with class ${attributesMap['class']}`);
    }
  }
  getChildren() {
    return this.children;
  }
}
