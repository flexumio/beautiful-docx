import { HeadingLevel } from 'docx';
import { Element, parse } from 'himalaya';
import { Header, TextInline } from '.';
import { defaultExportOptions } from '../../options';

describe('Header', () => {
  let instance: Header;
  const headingLevel = HeadingLevel.HEADING_1;
  beforeAll(() => {
    const html = '<h1>Heading 1</h1>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'h1') as Element;

    instance = new Header(element, headingLevel, defaultExportOptions);
  });
  test('type should be "heading"', () => {
    expect(instance.type).toBe('heading');
  });

  describe('options', () => {
    test('heading should be as a level', () => {
      expect(instance.options.heading).toBeDefined();
      expect(instance.options.heading).toBe(headingLevel);
    });
  });

  test('children should be array from TextInline elements', () => {
    const children = instance.children;
    const isChildrenTextInline = children.every(child => child instanceof TextInline);

    expect(children).toBeInstanceOf(Array);
    expect(isChildrenTextInline).toBe(true);
  });
});
