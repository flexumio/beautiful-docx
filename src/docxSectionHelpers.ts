import { convertInchesToTwip, convertMillimetersToTwip, ISectionPropertiesOptions, NumberFormat } from 'docx';
import { DocxExportOptions } from './docxExportOptions';

const TOP_MARGIN_DEFAULT = 19;
const RIGHT_MARGIN_DEFAULT = 12.7;
const BOTTOM_MARGIN_DEFAULT = 19;
const LEFT_MARGIN_DEFAULT = 19;

const TOP_MARGIN_POETRY = 19;
const RIGHT_MARGIN_POETRY = 27;
const BOTTOM_MARGIN_POETRY = 19;
const LEFT_MARGIN_POETRY = 29;

const TABLE_LEFT_INDENT = 0.06;

export const getDefaultSectionsProperties = (exportOptions: DocxExportOptions): ISectionPropertiesOptions => {
  return {
    page: {
      size: {
        width: convertInchesToTwip(exportOptions.pageWidth),
        height: convertInchesToTwip(exportOptions.pageHeight),
      },
      margin: {
        top: convertMillimetersToTwip(TOP_MARGIN_DEFAULT),
        right: convertMillimetersToTwip(RIGHT_MARGIN_DEFAULT),
        bottom: convertMillimetersToTwip(BOTTOM_MARGIN_DEFAULT),
        left: convertMillimetersToTwip(LEFT_MARGIN_DEFAULT),
      },
      pageNumbers: {
        formatType: NumberFormat.DECIMAL,
      },
    },
  };
};

export const getPoetrySectionsProperties = (exportOptions: DocxExportOptions): ISectionPropertiesOptions => {
  return {
    page: {
      size: {
        width: convertInchesToTwip(exportOptions.pageWidth),
        height: convertInchesToTwip(exportOptions.pageHeight),
      },
      margin: {
        top: convertMillimetersToTwip(TOP_MARGIN_POETRY),
        right: convertMillimetersToTwip(RIGHT_MARGIN_POETRY),
        bottom: convertMillimetersToTwip(BOTTOM_MARGIN_POETRY),
        left: convertMillimetersToTwip(LEFT_MARGIN_POETRY),
      },
      pageNumbers: {
        formatType: NumberFormat.DECIMAL,
      },
    },
  };
};

export const getPageWidth = (exportOptions: DocxExportOptions): number => {
  return (
    convertInchesToTwip(exportOptions.pageWidth) -
    convertMillimetersToTwip(RIGHT_MARGIN_DEFAULT) -
    convertMillimetersToTwip(LEFT_MARGIN_DEFAULT)
  );
};

export const getTableIndent = (): number => {
  return convertInchesToTwip(TABLE_LEFT_INDENT);
};
