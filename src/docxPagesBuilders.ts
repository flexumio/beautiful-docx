import { Paragraph, TableOfContents } from 'docx';
import { PAGE_TITLE_STYLE_ID } from './docxStylesHelper';

export const constructTOCPage = (): (Paragraph | TableOfContents)[] => {
  return [
    new Paragraph({
      text: 'Table of Contents',
      pageBreakBefore: true,
      style: PAGE_TITLE_STYLE_ID,
    }),
    new TableOfContents('Table of Contents', {
      hyperlink: true,
      headingStyleRange: '1-4',
      // stylesWithLevels: [new StyleLevel("ChapterTitle", 1)]
    }),
  ];
};
