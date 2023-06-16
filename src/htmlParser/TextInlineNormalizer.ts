import { DocumentElement, TextInline } from './DocumentElements';
import { hasSpacesAtEnd, hasSpacesAtStart } from './utils';

export class TextInlineNormalizer {
  private children: DocumentElement[] = [];

  constructor(private items: DocumentElement[]) {}

  normalize() {
    this.items
      .filter(i => !(this.isInline(i) && i.isEmpty), this)
      .forEach((i, idx) => {
        const isCurrentInlineBlock = this.isInline(i);

        if (!isCurrentInlineBlock) {
          return this.children.push(i);
        }

        if (idx === 0) {
          return this.processDefault(i);
        }

        const prevChild = this.children[idx - 1];

        if (!this.isInline(prevChild)) {
          return this.processDefault(i);
        }

        const currentTextContentRef: [string] | null = this.getTextContentRefFromChild(i);
        const prevTextContentRef: [string] | null = this.getTextContentRefFromChild(prevChild);

        if (currentTextContentRef === null) {
          return this.children.push(i);
        }

        if (prevTextContentRef === null) {
          return this.processDefault(i);
        }

        const prevText = prevTextContentRef[0];
        const currentText = currentTextContentRef[0];

        if (hasSpacesAtEnd(prevText) && hasSpacesAtStart(currentText)) {
          currentTextContentRef[0] = currentTextContentRef[0].trimStart();
          prevTextContentRef[0] = prevTextContentRef[0].trimEnd() + ' ';
        }
        if (hasSpacesAtEnd(prevText) && !hasSpacesAtStart(currentText)) {
          prevTextContentRef[0] = prevTextContentRef[0].trimEnd() + ' ';
        }

        if (!hasSpacesAtEnd(prevText) && hasSpacesAtStart(currentText)) {
          currentTextContentRef[0] = ' ' + currentTextContentRef[0].trimStart();
        }

        return this.children.push(i);
      }, this);

    return this.children;
  }

  private processDefault(child: TextInline) {
    const ref = this.getTextContentRefFromChild(child);
    if (ref !== null) {
      ref[0] = ref[0].trimStart();
    }
    return this.children.push(child);
  }

  private isInline(child: DocumentElement): child is TextInline {
    return child instanceof TextInline;
  }

  private getTextContentRefFromChild(child: TextInline) {
    const currentItemContent = child.content[0];
    if (typeof currentItemContent === 'string') {
      return child.content as [string];
    }

    if (currentItemContent instanceof TextInline) {
      return typeof currentItemContent.content[0] === 'string' ? (currentItemContent.content as [string]) : null;
    }
    return null;
  }
}
