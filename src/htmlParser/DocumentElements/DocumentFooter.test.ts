import { Footer } from 'docx';
import { DocumentFooter } from './DocumentFooter';
import { TextBlock } from './TextBlock';

describe('DocumentFooter', () => {
  let instance: DocumentFooter;

  beforeAll(() => {
    instance = new DocumentFooter();
  });

  test('children should be array with 1 TextBlock element', () => {
    const children = instance.children;

    expect(children).toBeInstanceOf(Array);
    expect(children.length).toBe(1);
    expect(children[0]).toBeInstanceOf(TextBlock);
  });

  test('transformToDocx should return Footer instance', () => {
    const docx = instance.transformToDocx();

    expect(docx).toBeInstanceOf(Footer);
  });
});
