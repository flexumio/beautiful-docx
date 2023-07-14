import { Paragraph as DocxParagraph } from 'docx';
import { Element, parse } from 'himalaya';
import { List, ListItem } from '.';
import { defaultExportOptions } from '../../options';

describe('List', () => {
  test('type should be "list"', () => {
    const html = `
      <ul></ul>`;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'ul') as Element;
    const instance = new List(element, 1, defaultExportOptions);

    expect(instance.type).toBe('list');
  });

  describe('Unordered list', () => {
    let instance: List;

    beforeAll(() => {
      const html = `
      <ul>
        <li>List Item</li>
        <li>List Item</li>
      </ul>`;
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'ul') as Element;
      instance = new List(element, 1, defaultExportOptions);
    });

    test('children should have bullet option', () => {
      const expectedOptions = { bullet: { level: 1 } };

      const options = instance.childrenOptions;

      expect(options).toStrictEqual(expectedOptions);
    });

    test('children should be ListItem elements', () => {
      const isListItemElements = instance.children.every(child => child instanceof ListItem);

      expect(isListItemElements).toBe(true);
    });

    test('transformToDocx should return array of DocxParagraph', () => {
      const docx = instance.transformToDocx();
      const isDocxParagraphElements = docx.every(child => child instanceof DocxParagraph);

      expect(docx).toBeInstanceOf(Array);
      expect(isDocxParagraphElements).toBe(true);
    });
  });

  describe('Ordered list', () => {
    let instance: List;

    beforeAll(() => {
      const html = `
      <ol>
        <li>List Item</li>
        <li>List Item</li>
      </ol>`;
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'ol') as Element;
      instance = new List(element, 1, defaultExportOptions);
    });

    test('children should have numbering option', () => {
      const numbering = instance.childrenOptions.numbering;

      expect(numbering).toBeDefined();
    });

    test('children should be ListItem elements', () => {
      const isListItemElements = instance.children.every(child => child instanceof ListItem);

      expect(isListItemElements).toBe(true);
    });

    test('transformToDocx should return array of DocxParagraph', () => {
      const docx = instance.transformToDocx();
      const isDocxParagraphElements = docx.every(child => child instanceof DocxParagraph);

      expect(docx).toBeInstanceOf(Array);
      expect(isDocxParagraphElements).toBe(true);
    });
  });

  describe('Not list tag', () => {
    test('should throw error', () => {
      const html = `
      <p>
        <li>List Item</li>
        <li>List Item</li>
      </p>`;
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

      const createList = () => new List(element, 1, defaultExportOptions);
      try {
        createList();
        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toContain('Unsupported list type');
      }
    });
  });
});
