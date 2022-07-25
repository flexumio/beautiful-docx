import {
  AlignmentType,
  convertInchesToTwip,
  convertMillimetersToTwip,
  Document,
  Footer,
  ImageRun,
  LevelFormat,
  LevelSuffix,
  NumberFormat,
  PageNumber,
  Paragraph,
  Table,
  TextRun,
} from 'docx';
import { DocumentElement } from './htmlParser/DocumentElements';
import { DocxExportOptions } from './options';

export const FONT_TO_LINE_RATIO = 10;
export const PAGE_TITLE_STYLE_ID = 'PageTitle';
export const DEFAULT_NUMBERING_REF = 'default-numbering';

export class DocumentBuilder {
  constructor(public options: DocxExportOptions) {}

  build(content: DocumentElement[]) {
    return new Document({
      features: { updateFields: true },
      styles: this.getStyles(),
      numbering: this.getNumberingConfig(),
      sections: [
        {
          properties: this.getDefaultSectionsProperties(),
          footers: {
            default: this.getFooter(),
          },
          children: this.postProcessContent(content.flatMap(i => i.transformToDocx()) as Paragraph[]),
        },
      ],
    });
  }

  private postProcessContent(docxTree: Paragraph[]) {
    const results: (Paragraph | Table)[] = [];
    let iterator = 0;
    while (iterator < docxTree.length) {
      const currentItem = docxTree[iterator];
      const nextItem = docxTree[iterator + 1];
      const isCurrentItemImage = currentItem instanceof ImageRun;
      const isNextItemParagraph = nextItem instanceof Paragraph;
      if (isCurrentItemImage && isNextItemParagraph) {
        nextItem.addChildElement(currentItem);
        results.push(nextItem);
        iterator += 2;
        continue;
      }
      if (isCurrentItemImage && !isNextItemParagraph) {
        results.push(new Paragraph({ children: [currentItem] }));
        iterator += 1;
        continue;
      }
      results.push(currentItem);
      iterator += 1;
    }
    return results;
  }

  private getStyles() {
    return {
      paragraphStyles: [
        {
          id: PAGE_TITLE_STYLE_ID,
          name: 'Page Title',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: this.options.font.headersFontFamily,
            size: this.options.font.headersSizes.h1,
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: { line: this.options.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
          },
        },
      ],
      default: {
        document: {
          run: {
            font: this.options.font.baseFontFamily,
            size: this.options.font.baseSize,
            bold: false,
          },
        },
        heading1: {
          run: {
            font: this.options.font.headersFontFamily,
            size: this.options.font.headersSizes.h1,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.options.font.headersSizes.h1 * FONT_TO_LINE_RATIO },
          },
        },
        heading2: {
          run: {
            font: this.options.font.headersFontFamily,
            size: this.options.font.headersSizes.h2,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.options.font.headersSizes.h2 * FONT_TO_LINE_RATIO },
          },
        },
        heading3: {
          run: {
            font: this.options.font.headersFontFamily,
            size: this.options.font.headersSizes.h3,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.options.font.headersSizes.h3 * FONT_TO_LINE_RATIO },
          },
        },
        heading4: {
          run: {
            font: this.options.font.headersFontFamily,
            size: this.options.font.headersSizes.h4,
            bold: true,
          },
          paragraph: {
            spacing: { line: this.options.font.headersSizes.h4 * FONT_TO_LINE_RATIO },
          },
        },
      },
    };
  }

  private getNumberingConfig() {
    return {
      config: [
        {
          reference: DEFAULT_NUMBERING_REF,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 2,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 3,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
            {
              level: 4,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              suffix: LevelSuffix.SPACE,
            },
          ],
        },
      ],
    };
  }

  private getDefaultSectionsProperties = () => {
    return {
      page: {
        size: {
          width: convertInchesToTwip(this.options.page.size.width),
          height: convertInchesToTwip(this.options.page.size.height),
        },
        margin: {
          top: convertMillimetersToTwip(this.options.page.margins.top),
          right: convertMillimetersToTwip(this.options.page.margins.right),
          bottom: convertMillimetersToTwip(this.options.page.margins.bottom),
          left: convertMillimetersToTwip(this.options.page.margins.left),
        },
        pageNumbers: {
          formatType: NumberFormat.DECIMAL,
        },
      },
    };
  };

  private getFooter() {
    return new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT] })],
        }),
      ],
    });
  }
}
