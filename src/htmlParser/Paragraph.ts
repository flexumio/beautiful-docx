import { convertMillimetersToTwip } from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../options';
import { parseParagraphChild } from './docxHtmlParser';
import { TextBlock } from './TextBlock';
import { getIndent, parseTextAlignment } from './utils';

export class Paragraph extends TextBlock {
  constructor(element: Element, index: number, exportOptions: DocxExportOptions) {
    const options = {
      alignment: parseTextAlignment(element.attributes),
      children: element.children.flatMap(child => parseParagraphChild(child)),
      indent: getIndent(index, exportOptions),
      spacing: { after: convertMillimetersToTwip(exportOptions.verticalSpaces) },
    };

    super(options);
  }
}
