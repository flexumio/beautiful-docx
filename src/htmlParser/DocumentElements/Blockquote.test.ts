import { Element, parse } from 'himalaya';
import { Paragraph as DocxParagraph } from 'docx';
import { Blockquote, TextBlock, TextInline } from '.';

describe('Blockquote', () => {
  let instance: Blockquote;
  beforeAll(() => {
    const html = `
    <blockquote>
      <p>Blockquote</p> and just text
    </blockquote>`;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'blockquote') as Element;
    instance = new Blockquote(element);
  });

  test('type should be "blockquote"', () => {
    expect(instance.type).toBe('blockquote');
  });

  test('getContent should return array of TextBlock and TextInline', () => {
    const content = instance.getContent();
    const isInstancesOfTextBlockAndTextInline = content.every(i => i instanceof TextBlock || i instanceof TextInline);

    expect(content).toBeInstanceOf(Array);
    expect(isInstancesOfTextBlockAndTextInline).toBe(true);
  });

  test('transformToDocx should return array of DocxParagraph elements', () => {
    const docx = instance.transformToDocx();
    const isInstancesOfDocxParagraph = docx.every(i => i instanceof DocxParagraph);

    expect(docx).toBeInstanceOf(Array);
    expect(isInstancesOfDocxParagraph).toBe(true);
  });
});
