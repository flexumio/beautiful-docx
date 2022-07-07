import { AlignmentType, Footer, PageNumber, Paragraph, TextRun } from 'docx';

export const getDefaultFooter = (): Footer => {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT] })],
      }),
    ],
  });
};
