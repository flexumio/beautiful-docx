import { AlignmentType, Paragraph as DocxParagraph, IParagraphOptions } from 'docx';
import { parse } from 'himalaya';
import { DocumentElement, TextBlock, TextInline } from '.';

describe('TextBlock', () => {
  const defaultOptions: IParagraphOptions = {
    alignment: AlignmentType.CENTER,
    indent: { start: 0, end: 10 },
    spacing: { before: 10 },
  };

  describe('created without children', () => {
    let instance: TextBlock;
    beforeAll(() => {
      instance = new TextBlock(defaultOptions);
    });

    test('options should be initialized', () => {
      expect(instance.options).toStrictEqual(defaultOptions);
    });

    test('children should be empty array', () => {
      const expectedArray: [] = [];

      expect(instance.children).toEqual(expectedArray);
    });

    test('type should be "text"', () => {
      const expectedType = 'text';

      expect(instance.type).toBe(expectedType);
    });

    test('getContent should return empty array', () => {
      expect(instance.getContent().length).toBe(0);
    });

    test('transformToDocx should return empty array', () => {
      expect(instance.transformToDocx().length).toBe(0);
    });
  });

  describe('created with children', () => {
    let instance: TextBlock;

    beforeAll(() => {
      const html = `
          <s>text1</s>
          <br/>
          <i>text2</i>
          <u>text3</u>
          <strong>text4</strong>
          \n\n\n
        `;

      const nodes = parse(html);
      const defaultChildren: DocumentElement[] = nodes.map(node => {
        return new TextInline(node);
      });

      instance = new TextBlock(defaultOptions, defaultChildren);
    });

    test('options should be initialized', () => {
      expect(instance.options).toStrictEqual(defaultOptions);
    });

    test('children should be array array of DocumentElement', () => {
      const result = instance.children.every(child => child instanceof TextInline);
      expect(result).toBeTruthy();
    });

    test('children should not contain empty text elements', () => {
      const result = instance.children.every(child => {
        if (child instanceof TextInline) {
          return !child.isEmpty;
        }
        return true;
      });

      expect(result).toBeTruthy();
    });

    test('getContent should return array with 1 BlockText element', () => {
      const content = instance.getContent();

      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('transformToDocx should return array with 1 DocxParagraph element', () => {
      const docx = instance.transformToDocx();

      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(DocxParagraph);
    });
  });
});
