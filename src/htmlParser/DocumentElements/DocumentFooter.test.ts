import { Footer } from 'docx';
import { defaultExportOptions } from '../../options';
import { DocumentFooter } from './DocumentFooter';
import { TextBlock } from './TextBlock';

describe('DocumentFooter', () => {
  let instance: DocumentFooter;

  beforeAll(() => {
    instance = new DocumentFooter(defaultExportOptions);
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

  test('creation without page numbering', () => {
    const create = () => {
      new DocumentFooter({
        ...defaultExportOptions,
        page: { ...defaultExportOptions.page, numbering: false },
      });
    };

    expect(create).not.toThrowError();
  });
});
