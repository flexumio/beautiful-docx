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

      const isCurrentItemBr = this.isBr(currentItem);
      const isNextElementBr = this.isBr(nextItem);

      if (isCurrentItemBr) {
        iterator += 1;
        continue;
      }

      if (isNextElementBr) {
        if (currentItem instanceof TextBlock) {
          currentItem.children.push(nextItem.children[0]);
        }
      }

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

  isBr(item: DocumentElement): item is TextBlock {
    return item instanceof TextBlock && item.children.length === 1 && item.children[0].type === 'br';
  }
}
