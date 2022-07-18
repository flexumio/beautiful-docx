import { Node, Element } from 'himalaya';
import { ExternalHyperlink, IRunOptions, ParagraphChild, TextRun, UnderlineType } from 'docx';

import { DocxExportOptions } from '../options';
import { parseTable } from './tableParser';
import { cleanTextContent, getAttributeMap, ParseResult } from './utils';
import { parseImage } from './imageParser';

export const parseParagraphChild = (element: Node, textOptions: IRunOptions = {}): ParagraphChild[] => {
  if (element.type === 'text') {
    return [new TextRun({ text: cleanTextContent(element.content), ...textOptions })];
  }

  if (element.type === 'element') {
    switch (element.tagName) {
      case 'br':
        return [new TextRun({ break: 1 })];
      case 'strong':
        return element.children.flatMap(child => parseParagraphChild(child, { ...textOptions, bold: true }));
      case 'i':
        return element.children.flatMap(child => parseParagraphChild(child, { ...textOptions, italics: true }));
      case 'u':
        return element.children.flatMap(child =>
          parseParagraphChild(child, {
            ...textOptions,
            underline: { type: UnderlineType.SINGLE },
          })
        );
      case 's':
        return element.children.flatMap(child =>
          parseParagraphChild(child, {
            ...textOptions,
            strike: true,
          })
        );
      case 'a':
        return [
          new ExternalHyperlink({
            link: element.attributes.find(item => item.key === 'href')?.value || '',
            children: element.children.flatMap(child =>
              parseParagraphChild(child, {
                ...textOptions,
              })
            ),
          }),
        ];
      default:
        throw new Error(`Unsupported ${element.tagName} tag`);
    }
  }

  return [];
};

export const parseFigure = (element: Element, docxExportOptions: DocxExportOptions): ParseResult[] => {
  const attributesMap = getAttributeMap(element.attributes);
  const classString = attributesMap['class'] || '';
  const classes = classString.split(' ');

  if (classes.includes('table')) {
    return parseTable(element, docxExportOptions);
  } else if (classes.includes('image')) {
    return parseImage(element, docxExportOptions);
  }

  throw new Error(`Unsupported figure with class ${attributesMap['class']}`);
};

export class Figure {
  private children: ParseResult[];
  constructor(element: Element, docxExportOptions: DocxExportOptions) {
    const attributesMap = getAttributeMap(element.attributes);
    // TODO: rework with tagName
    const classString = attributesMap['class'] || '';
    const classes = classString.split(' ');

    if (classes.includes('table')) {
      this.children = parseTable(element, docxExportOptions);
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
