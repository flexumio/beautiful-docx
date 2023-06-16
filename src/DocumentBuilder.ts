import { Document, DocumentElement, EmptyLine, Image, Paragraph, TextBlock } from './htmlParser/DocumentElements';
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

      if (isCurrentItemBr) {
        results.push(new EmptyLine());
        iterator += 1;
        continue;
      }

      if (!isCurrentItemImage) {
        results.push(currentItem);
        iterator += 1;
        continue;
      }

      if (isNextItemParagraph && currentItem.isFloating) {
        nextItem.children.push(currentItem);
        results.push(nextItem);
        iterator += 2;
      } else {
        results.push(Image.getStaticImageElement(currentItem));
        iterator += 1;
      }
    }

    return results;
  }

  isBr(item: DocumentElement): item is TextBlock {
    return item instanceof TextBlock && item.children.length === 1 && item.children[0].type === 'br';
  }
}
