import { TableOfContents as DocxTableOfContents } from 'docx';
import { TableOfContents } from './TableOfContents';

describe('TableOfContents', () => {
  let instance: TableOfContents;

  beforeAll(() => {
    instance = new TableOfContents();
  });

  test('type should be "table-of-contents"', () => {
    const expectedType = 'table-of-contents';

    expect(instance.type).toBe(expectedType);
  });

  test('getContent should return array with 1 TableOfContents element', () => {
    const content = instance.getContent();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(TableOfContents);
  });
  test('transformToDocx should return array with 1 DocxTableOfContents element', () => {
    const content = instance.transformToDocx();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(DocxTableOfContents);
  });
});
