import { TextBlock } from './TextBlock';
import { HeadingLevel } from 'docx';
import { Element } from 'himalaya';

import { TextInline } from './TextInline';
import { parseTextAlignment } from '../utils';
import { DocumentElementType } from './DocumentElement';
import { DocxExportOptions } from '../../options';

export class Header extends TextBlock {
  public type: DocumentElementType = 'heading';

  constructor(element: Element, level: HeadingLevel, exportOptions: DocxExportOptions) {
    const options = {
      heading: level,
      alignment: parseTextAlignment(element.attributes),
    };
    super(
      options,
      element.children.flatMap(child => new TextInline(child).getContent()),
      exportOptions
    );
  }
}
