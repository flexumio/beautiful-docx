import { Paragraph, ParagraphChild } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../options';

import { Image } from './Image';
import { TableCreator } from './Table';
import { DocumentElement, DocumentElementType } from './DocumentElement';

export class Figure implements DocumentElement {
  public type: DocumentElementType = 'figure';

  private readonly content: DocumentElement[];
  constructor(element: Element, docxExportOptions: DocxExportOptions) {
    const tableNode = element.children.find(i => i.type === 'element' && i.tagName === 'table');
    const imageNode = element.children.find(i => i.type === 'element' && i.tagName === 'img');

    if (tableNode) {
      this.content = new TableCreator(tableNode as Element, docxExportOptions).getContent();
    } else if (imageNode) {
      this.content = new Image(element, docxExportOptions).getContent();
    } else {
      const tagsNames = element.children.map(i => (i.type === 'element' ? i.tagName : i.type)).join(', ');
      throw new Error(`Unsupported figure with content: ${tagsNames}`);
    }
  }

  getContent() {
    return this.content;
  }

  transformToDocx(): (Paragraph | ParagraphChild)[] {
    return this.content.flatMap(i => i.transformToDocx());
  }
}
