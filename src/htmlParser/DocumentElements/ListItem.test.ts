import { IParagraphOptions } from '../../options/docxOptions';
import { Element, parse } from 'himalaya';
import { ListItem, TextInline } from '.';

describe('ListItem', () => {
  const bulletListItemOptions: IParagraphOptions = {
    bullet: { level: 1 },
  };

  test('Type should be a "list-item"', () => {
    const expectedType = 'list-item';
    const html = '<li>List item</li>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'li') as Element;

    const instance = new ListItem(element, bulletListItemOptions, 1);

    expect(instance.type).toBe(expectedType);
  });

  test('Created from a wrong tag', () => {
    const html = '<p>paragraph</p>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'p') as Element;

    const createListItem = () => new ListItem(element, bulletListItemOptions, 1);

    expect(createListItem).toThrowError();
  });

  describe('Created from a list item without nested list', () => {
    let instance: ListItem;

    beforeAll(() => {
      const html = '<li>List item</li>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'li') as Element;

      instance = new ListItem(element, bulletListItemOptions, 1);
    });

    test('content should be array with 1 ListItem element', () => {
      const content = instance.getContent();

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(ListItem);
    });

    test('children should be array with TextInline elements', () => {
      const children = instance.children;
      const isChildrenTextInline = children.every(child => child instanceof TextInline);

      expect(children).toBeInstanceOf(Array);
      expect(isChildrenTextInline).toBe(true);
    });
  });

  describe('Created from list item with nested list', () => {
    let instance: ListItem;

    beforeAll(() => {
      const html = `
       <li>
          List item
          <ul>
            <li>List Item2</li>
          </ul>
       </li>`;
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'li') as Element;

      instance = new ListItem(element, bulletListItemOptions, 1);
    });

    test('content should be array with ListItem elements', () => {
      const content = instance.getContent();

      const isContentListItems = content.every(i => i instanceof ListItem);

      expect(content).toBeInstanceOf(Array);
      expect(isContentListItems).toBeTruthy();
    });

    test('children should be array with TextInline elements', () => {
      const children = instance.children;
      const isChildrenTextInline = children.every(child => child instanceof TextInline);

      expect(children).toBeInstanceOf(Array);
      expect(isChildrenTextInline).toBe(true);
    });
  });
});
