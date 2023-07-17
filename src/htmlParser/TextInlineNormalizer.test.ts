import { DocumentElement } from './DocumentElements';
import { TextInline } from './DocumentElements/TextInline';
import { TextInlineNormalizer } from './TextInlineNormalizer';
import { parse } from 'himalaya';

describe('TextInlineNormalizer', () => {
  test('normalize method should handle default child correctly', () => {
    const html = `
    <span>Text 1</span>
    <span>Text 2</span>
  `;
    const nodes = parse(html);
    const children: DocumentElement[] = nodes.map(node => {
      return new TextInline(node);
    });
    const normalizer = new TextInlineNormalizer(children);
    const normalizedChildren = normalizer.normalize();

    const child1 = normalizedChildren[0].getContent()[0] as TextInline;
    const child2 = normalizedChildren[1].getContent()[0] as TextInline;

    const result1 = child1.content[0] as TextInline;
    const result2 = child2.content[0] as TextInline;

    expect(normalizedChildren.length).toBe(2);
    expect(result1['content']).toStrictEqual(['Text 1']);
    expect(result2['content']).toStrictEqual(['Text 2']);
  });

  describe('trim spaces', () => {
    test('first text has spaces at start', () => {
      const html = `
          <span> Text 1</span>
      `;
      const nodes = parse(html);
      const children: DocumentElement[] = nodes.map(node => {
        return new TextInline(node);
      });
      const normalizer = new TextInlineNormalizer(children);
      const normalizedChildren = normalizer.normalize();

      const child = normalizedChildren[0].getContent()[0] as TextInline;
      const result = child.content[0] as TextInline;

      expect(result['content']).toStrictEqual(['Text 1']);
    });

    test('previous text has spaces at end && current text has spaces at start', () => {
      const html = `
        <span>Text 1 </span>
        <span> Text 2</span>
    `;
      const nodes = parse(html);
      const children: DocumentElement[] = nodes.map(node => {
        return new TextInline(node);
      });
      const normalizer = new TextInlineNormalizer(children);
      const normalizedChildren = normalizer.normalize();

      const child1 = normalizedChildren[0].getContent()[0] as TextInline;
      const child2 = normalizedChildren[1].getContent()[0] as TextInline;

      const result1 = child1.content[0] as TextInline;
      const result2 = child2.content[0] as TextInline;

      expect(result1['content']).toStrictEqual(['Text 1 ']);
      expect(result2['content']).toStrictEqual(['Text 2']);
    });

    test(`previous text has spaces at end && current text hasn't spaces at start`, () => {
      const html = `
      <span>Text 1 </span>
      <span>Text 2</span>
  `;
      const nodes = parse(html);
      const children: DocumentElement[] = nodes.map(node => {
        return new TextInline(node);
      });
      const normalizer = new TextInlineNormalizer(children);
      const normalizedChildren = normalizer.normalize();

      const child1 = normalizedChildren[0].getContent()[0] as TextInline;
      const child2 = normalizedChildren[1].getContent()[0] as TextInline;

      const result1 = child1.content[0] as TextInline;
      const result2 = child2.content[0] as TextInline;

      expect(result1['content']).toStrictEqual(['Text 1 ']);
      expect(result2['content']).toStrictEqual(['Text 2']);
    });

    test(`previous text hasn't spaces at end && current text has spaces at start`, () => {
      const html = `
      <span>Text 1</span>
      <span> Text 2</span>
  `;
      const nodes = parse(html);
      const children: DocumentElement[] = nodes.map(node => {
        return new TextInline(node);
      });
      const normalizer = new TextInlineNormalizer(children);
      const normalizedChildren = normalizer.normalize();

      const child1 = normalizedChildren[0].getContent()[0] as TextInline;
      const child2 = normalizedChildren[1].getContent()[0] as TextInline;

      const result1 = child1.content[0] as TextInline;
      const result2 = child2.content[0] as TextInline;

      expect(result1['content']).toStrictEqual(['Text 1']);
      expect(result2['content']).toStrictEqual([' Text 2']);
    });
  });

  test('child without content', () => {
    const html = `
    <span><span></span></span>
`;
    const nodes = parse(html);
    const children: DocumentElement[] = nodes.map(node => {
      return new TextInline(node);
    });
    const normalizer = new TextInlineNormalizer(children);
    const normalizedChildren = normalizer.normalize();

    const child = normalizedChildren[0].getContent()[0] as TextInline;

    const result = child.content[0] as TextInline;

    expect(result['content']).toStrictEqual([]);
  });
});
