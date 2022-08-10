import { convertMillimetersToTwip } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { TextInline } from './TextInline';
import { TextBlock } from './TextBlock';
import { getIndent, parseTextAlignment } from '../utils';

export class Paragraph extends TextBlock {
  constructor(element: Element, index: number, exportOptions: DocxExportOptions) {
    const options = {
      alignment: parseTextAlignment(element.attributes),

      indent: getIndent(index, exportOptions),
      spacing: { after: convertMillimetersToTwip(exportOptions.verticalSpaces) },
    };

    super(
      options,
      element.children.flatMap(child => new TextInline(child).getContent())
    );
  }
}
