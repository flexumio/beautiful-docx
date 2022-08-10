import { Document, DocumentElement, Image, Paragraph, TextBlock } from './htmlParser/DocumentElements';
import { DocxExportOptions } from './options';

export class DocumentBuilder {
  constructor(public options: DocxExportOptions) {}

  build(content: DocumentElement[]) {
    return new Document(this.options, this.postProcessContent(content)).transformToDocx();
  }

  private postProcessContent(docxTree: DocumentElement[]) {
    const results: DocumentElement[] = [];
    let iterator = 0;
    while (iterator < docxTree.length) {
      const currentItem = docxTree[iterator];
      const nextItem = docxTree[iterator + 1];
      const isCurrentItemImage = currentItem instanceof Image;
      const isNextItemParagraph = nextItem instanceof Paragraph;
      if (!isCurrentItemImage) {
        results.push(currentItem);
        iterator += 1;
        continue;
      }

      if (isNextItemParagraph) {
        nextItem.children.push(currentItem);
        results.push(nextItem);
        iterator += 2;
      } else {
        results.push(new TextBlock({}, [currentItem]));
        iterator += 1;
      }
    }
    return results;
  }
}
