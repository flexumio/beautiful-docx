import { Paragraph as DocxParagraph } from 'docx';
import { PageBreak } from './PageBreak';

describe('PageBreak', () => {
  let instance: PageBreak;

  beforeAll(() => {
    instance = new PageBreak();
  });

  test('type should be "page-break"', () => {
    const expectedType = 'page-break';

    expect(instance.type).toBe(expectedType);
  });

  test('getContent should return array with 1 PageBreak element', () => {
    const content = instance.getContent();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(PageBreak);
  });
  test('transformToDocx should return array with 1 DocxParagraph element', () => {
    const content = instance.transformToDocx();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(DocxParagraph);
  });
});
