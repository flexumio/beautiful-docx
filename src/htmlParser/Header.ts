import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';

import { parseParagraphChild } from './docxHtmlParser';
import { parseTextAlignment } from './utils';

export class Header extends TextBlock {
  constructor(element: Element, level: HeadingLevel) {
    const options = {
      heading: level,
      alignment: parseTextAlignment(element.attributes),
      children: element.children.flatMap(child => parseParagraphChild(child)),
    };
    super(options);
    this.options = options;
  }
}
