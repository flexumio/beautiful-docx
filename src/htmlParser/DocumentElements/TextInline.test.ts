import { ExternalHyperlink, TextRun, UnderlineType } from 'docx';
import { Element, Node, parse } from 'himalaya';
import { TextInline } from './TextInline';

describe('TextInline', () => {
  test('creating from unsupported tag should throw error', () => {
    const html = '<p></p>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

    try {
      new TextInline(element);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unsupported');
    }
  });

  test('creating from empty string', () => {
    const html = '      ';
    const node = parse(html).find(i => i.type === 'text') as Node;

    const instance = new TextInline(node);

    expect(instance.isEmpty).toBe(true);
  });

  describe('created from plan text', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = 'just plan text';
      const text = parse(html).find(i => i.type === 'text' && i.content === html) as Node;

      instance = new TextInline(text);
    });

    test('type should be "text"', () => {
      expect(instance.type).toBe('text');
    });

    test('getContent should be array with 1 TextInline element', () => {
      const content = instance.getContent();

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextInline);
    });

    test('should be not empty', () => {
      const isEmpty = instance.isEmpty;

      expect(isEmpty).toBe(false);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });

  describe('created from a comment', () => {
    let instance: TextInline;
    const html = '<!-- I am a comment! -->';
    beforeAll(() => {
      const text = parse(html).find(i => i.type === 'comment') as Node;

      instance = new TextInline(text);
    });

    test('type should be "text"', () => {
      expect(instance.type).toBe('text');
    });

    test('transformToDocx should return empty array', () => {
      expect(instance.transformToDocx().length).toBe(0);
    });
  });

  describe('created from "br" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<br/>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'br') as Element;

      instance = new TextInline(element);
    });

    test('type should be "br"', () => {
      expect(instance.type).toBe('br');
    });

    test('options should contain break value', () => {
      expect(instance.options.break).toBeDefined();
      expect(instance.options.break).toBe(1);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });
  describe('created from "strong" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<strong>strong</strong>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'strong') as Element;

      instance = new TextInline(element);
    });

    test('type should be "strong"', () => {
      expect(instance.type).toBe('strong');
    });

    test('options should contain bold value', () => {
      expect(instance.options.bold).toBeDefined();
      expect(instance.options.bold).toBe(true);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });

  describe('created from "i" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<i>italic</i>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'i') as Element;

      instance = new TextInline(element);
    });

    test('type should be "i"', () => {
      expect(instance.type).toBe('i');
    });

    test('options should contain italics value', () => {
      expect(instance.options.italics).toBeDefined();
      expect(instance.options.italics).toBe(true);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });

  describe('created from "u" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<u>underline</u>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'u') as Element;

      instance = new TextInline(element);
    });

    test('type should be "u"', () => {
      expect(instance.type).toBe('u');
    });

    test('options should contain underline value', () => {
      const expectedValue = { type: UnderlineType.SINGLE };

      expect(instance.options.underline).toBeDefined();
      expect(instance.options.underline).toStrictEqual(expectedValue);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });

  describe('created from "s" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<s>strike</s>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 's') as Element;

      instance = new TextInline(element);
    });

    test('type should be "s"', () => {
      expect(instance.type).toBe('s');
    });

    test('options should contain strike value', () => {
      expect(instance.options.strike).toBeDefined();
      expect(instance.options.strike).toBe(true);
    });

    test('transformToDocx should return array with 1 TextRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(TextRun);
    });
  });
  describe('created from "a" tag', () => {
    let instance: TextInline;

    beforeAll(() => {
      const html = '<a href="https://example.com">link</a>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'a') as Element;

      instance = new TextInline(element);
    });

    test('type should be "a"', () => {
      expect(instance.type).toBe('a');
    });

    test('transformToDocx should return array with 1 ExternalHyperLink element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(ExternalHyperlink);
    });

    test('created without href attribute', () => {
      const html = '<a>link</a>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'a') as Element;

      const instance = new TextInline(element);
      const docx = instance.transformToDocx();

      expect((docx[0] as ExternalHyperlink).options.link).toBe('');
    });
  });
});
