import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';

import { TextInline } from './TextInline';
import { parseTextAlignment } from '../utils';
import { DocumentElementType } from './DocumentElement';

export class Header extends TextBlock {
  type: DocumentElementType = 'heading';
  constructor(element: Element, level: HeadingLevel) {
    const options = {
      heading: level,
      alignment: parseTextAlignment(element.attributes),
    };
    super(
      options,
      element.children.flatMap(child => new TextInline(child).getContent())
    );
  }
}
