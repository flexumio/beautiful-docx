import { Document, Packer } from 'docx';
import { DocxExportOptions, mergeWithDefaultOptions } from './options';
import { getDefaultSectionsProperties } from './docxSectionHelpers';
import { getDefaultFooter } from './docxFooterHelpers';
import { getDocumentStyles, getNumberingConfig } from './docxStylesHelper';
import { parseHtmlContent } from './htmlParser';
import { DeepPartial } from './utils';

const getDocument = async (html: string, docxExportOptions: DocxExportOptions): Promise<Document> => {
  const parsedContent = await parseHtmlContent(html, docxExportOptions);

  return new Document({
    features: { updateFields: true },
    styles: getDocumentStyles(docxExportOptions),
    numbering: getNumberingConfig(),
    sections: [
      {
        properties: getDefaultSectionsProperties(docxExportOptions),
        footers: {
          default: getDefaultFooter(),
        },
        children: [...parsedContent],
      },
    ],
  });
};

export const generateDocx = async (
  html: string,
  docxExportOptions?: DeepPartial<DocxExportOptions>
): Promise<Buffer> => {
  const docxOptions = mergeWithDefaultOptions(docxExportOptions);
  const doc = await getDocument(html, docxOptions);

  return await Packer.toBuffer(doc);
};
