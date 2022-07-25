import { Paragraph, ParagraphChild } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../options';

import { Image } from './Image';
import { IText, TextType } from './TextBlock';
import { getAttributeMap } from './utils';

export class Figure implements IText {
  type: TextType = 'figure';
  content: IText[];
  constructor(element: Element, docxExportOptions: DocxExportOptions) {
    const attributesMap = getAttributeMap(element.attributes);
    // TODO: rework with tagName
    const classString = attributesMap['class'] || '';
    const classes = classString.split(' ');

    // if (classes.includes('table')) {
    //   const tableNode = element.children.find(i => i.type === 'element' && i.tagName === 'table') as Element;

    //   if (!tableNode) {
    //     throw new Error('No table element found');
    //   }

    //   this.content = new TableCreator(tableNode, docxExportOptions).getContent();
    // } else
    // TODO: remove dependency on class
    if (classes.includes('image')) {
      this.content = new Image(element, docxExportOptions).getContent();
    } else {
      throw new Error(`Unsupported figure with class ${attributesMap['class']}`);
    }
  }
  getContent() {
    return this.content;
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
