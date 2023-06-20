import { Element } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { TextInline } from './TextInline';
import { TextBlock } from './TextBlock';
import { getIndent, parseTextAlignment } from '../utils';
import { DocumentElementType } from './DocumentElement';

export class Paragraph extends TextBlock {
  type: DocumentElementType = 'paragraph';

  constructor(element: Element, index: number, exportOptions: DocxExportOptions) {
    const options = {
      alignment: parseTextAlignment(element.attributes),
      indent: getIndent(index, exportOptions),
    };

    super(
      options,
      element.children.flatMap(child => new TextInline(child).getContent())
    );
  }
}
