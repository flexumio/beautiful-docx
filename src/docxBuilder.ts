import { Document, Packer } from 'docx';
import { DocxExportOptions, OptionsBuilder } from './options';
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
  const optionsBuilder = new OptionsBuilder();
  optionsBuilder.mergeOptions(docxExportOptions);

  const doc = await getDocument(html, optionsBuilder.options);

  return await Packer.toBuffer(doc);
};
