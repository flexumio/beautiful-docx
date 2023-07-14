import { Element, parse } from 'himalaya';
import { AlignmentType, convertMillimetersToTwip, Paragraph as DocxParagraph } from 'docx';
import { Paragraph, TextInline } from '.';
import { defaultExportOptions } from '../../options';
import { FIRST_LINE_INDENT_MILLIMETERS } from '../utils';

describe('Paragraph', () => {
  describe('created from empty p tag', () => {
    const html = '<p></p>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

    let instance: Paragraph;

    beforeAll(() => {
      instance = new Paragraph(element, 0, defaultExportOptions);
    });

    test('getContent should return empty array', () => {
      const content = instance.getContent();

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(0);
    });

    test('transformToDocx should return empty array', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(0);
    });
  });

  describe('created from p tag with content', () => {
    describe('content is plan text', () => {
      const html = `<p>
      Paragraph
      paragraph
      </p>`;
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

      let instance: Paragraph;

      beforeAll(() => {
        instance = new Paragraph(element, 0, defaultExportOptions);
      });

      test('content should be array with 1 Paragraph element', () => {
        const content = instance.getContent();

        expect(content).toBeInstanceOf(Array);
        expect(content[0]).toBeInstanceOf(Paragraph);
      });

      test('children should be array with TextInline elements', () => {
        const children = instance.children;
        const isChildrenTextInline = children.every(child => child instanceof TextInline);

        expect(children).toBeInstanceOf(Array);
        expect(isChildrenTextInline).toBe(true);
      });
    });

    describe('content is inline tags', () => {
      const html = `<p>
      <s>Something</s>
      <br/>
      <i>sometimes</i>
      <u>sometimes</u>
      <strong>sometimes</strong>
      </p>`;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

      let instance: Paragraph;

      beforeAll(() => {
        instance = new Paragraph(element, 0, defaultExportOptions);
      });

      test('content should be array with 1 Paragraph element', () => {
        const content = instance.getContent();

        expect(content).toBeInstanceOf(Array);
        expect(content[0]).toBeInstanceOf(Paragraph);
      });

      test('children should be array with TextInline elements', () => {
        const children = instance.children;
        const isChildrenTextInline = children.every(child => child instanceof TextInline);
        expect(children).toBeInstanceOf(Array);
        expect(isChildrenTextInline).toBe(true);
      });

      test('transformToDocx should return array with 1 DocxParagraph element', () => {
        const docx = instance.transformToDocx();

        expect(docx).toBeInstanceOf(Array);
        expect(docx.length).toBe(1);
        expect(docx[0]).toBeInstanceOf(DocxParagraph);
      });
    });
  });

  describe('options', () => {
    // TODO: move this tests to parseTextAlignment function tests
    describe('alignment calculated from style attribute', () => {
      test('should be "left" by default', () => {
        const expectedAlignment = AlignmentType.LEFT;
        const html = '<p>Paragraph</p>';
        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

        const instance = new Paragraph(element, 0, defaultExportOptions);

        expect(instance.options.alignment).toBeDefined();
        expect(instance.options.alignment).toBe(expectedAlignment);
      });

      test('should be suitable by defined text-align property', () => {
        const expectedAlignment = AlignmentType.CENTER;
        const html = `<p style='text-align: center;'>Paragraph</p>`;
        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

        const instance = new Paragraph(element, 0, defaultExportOptions);

        expect(instance.options.alignment).toBeDefined();
        expect(instance.options.alignment).toBe(expectedAlignment);
      });

      test('should be "left" by wrong text-align property', () => {
        const expectedAlignment = AlignmentType.LEFT;
        const html = `<p style='text-align: foo;'>Paragraph</p>`;
        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

        const instance = new Paragraph(element, 0, defaultExportOptions);

        expect(instance.options.alignment).toBeDefined();
        expect(instance.options.alignment).toBe(expectedAlignment);
      });
    });

    describe('indent calculated from element index and export options', () => {
      test('should be undefined for first paragraph', () => {
        const html = '<p>Paragraph</p>';
        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

        const instance = new Paragraph(element, 0, defaultExportOptions);

        expect(instance.options.indent).toBeUndefined();
      });

      describe('not first paragraph', () => {
        test('should have default value', () => {
          const html = '<p>Paragraph</p>';
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;
          const expectedIndent = { firstLine: convertMillimetersToTwip(FIRST_LINE_INDENT_MILLIMETERS) };

          const instance = new Paragraph(element, 1, { ...defaultExportOptions, ignoreIndentation: false });

          expect(instance.options.indent).toBeDefined();
          expect(instance.options.indent).toStrictEqual(expectedIndent);
        });

        test('should be undefined by ignoreIndentation option', () => {
          const html = '<p>Paragraph</p>';
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;
          const exportOptions = { ...defaultExportOptions, ignoreIndentation: true };

          const instance = new Paragraph(element, 1, exportOptions);

          expect(instance.options.indent).toBeUndefined();
        });
      });
    });
  });

  test('type should be "paragraph"', () => {
    const expectedType = 'paragraph';
    const html = '<p>Paragraph</p>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

    const instance = new Paragraph(element, 0, defaultExportOptions);

    expect(instance.type).toBe(expectedType);
  });
});
