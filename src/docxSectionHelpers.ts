import { convertInchesToTwip, convertMillimetersToTwip } from 'docx';
import { DocxExportOptions } from './options';

const TABLE_LEFT_INDENT = 0.06;

export const getPageWidth = (exportOptions: DocxExportOptions): number => {
  return (
    convertInchesToTwip(exportOptions.page.size.width) -
    convertMillimetersToTwip(exportOptions.page.margins.right) -
    convertMillimetersToTwip(exportOptions.page.margins.left)
  );
};

export const getTableIndent = (): number => {
  return convertInchesToTwip(TABLE_LEFT_INDENT);
};
