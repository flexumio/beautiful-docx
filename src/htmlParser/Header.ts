import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';

import { TextInline } from './TextInline';
import { parseTextAlignment } from './utils';

export class Header extends TextBlock {
  constructor(element: Element, level: HeadingLevel) {
    const options = {
      heading: level,
      alignment: parseTextAlignment(element.attributes),
      children: element.children.flatMap(child => new TextInline(child).getContent()),
    };
    super(options);
  }
}
