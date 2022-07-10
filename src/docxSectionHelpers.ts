import { convertInchesToTwip, convertMillimetersToTwip, ISectionPropertiesOptions, NumberFormat } from 'docx';
import { DocxExportOptions } from './options';

const TABLE_LEFT_INDENT = 0.06;

export const getDefaultSectionsProperties = (exportOptions: DocxExportOptions): ISectionPropertiesOptions => {
  return {
    page: {
      size: {
        width: convertInchesToTwip(exportOptions.page.size.width),
        height: convertInchesToTwip(exportOptions.page.size.height),
      },
      margin: {
        top: convertMillimetersToTwip(exportOptions.page.margins.top),
        right: convertMillimetersToTwip(exportOptions.page.margins.right),
        bottom: convertMillimetersToTwip(exportOptions.page.margins.bottom),
        left: convertMillimetersToTwip(exportOptions.page.margins.left),
      },
      pageNumbers: {
        formatType: NumberFormat.DECIMAL,
      },
    },
  };
};

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
