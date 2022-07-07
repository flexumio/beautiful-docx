import { Document, Packer } from 'docx';
import { defaultExportOptions, DocxExportOptions } from './docxExportOptions';
import { getDefaultSectionsProperties } from './docxSectionHelpers';
import { getDefaultFooter } from './docxFooterHelpers';
import { getDocumentStyles, getNumberingConfig } from './docxStylesHelper';
import { parseHtmlContent } from './htmlParser';

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

export const generateDocx = async (html: string, docxExportOptions?: Partial<DocxExportOptions>): Promise<Buffer> => {
  const doc = await getDocument(html, { ...defaultExportOptions, ...docxExportOptions });

  return await Packer.toBuffer(doc);
};
