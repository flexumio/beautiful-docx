import { Table, Paragraph as DocxParagraph } from 'docx';
import { Element, parse } from 'himalaya';
import { defaultExportOptions } from '../../../options';
import { TextBlock } from '../TextBlock';
import { TableCreator } from './TableCreator';

describe('TableCreator', () => {
  describe('Default creation', () => {
    let instance: TableCreator;

    beforeAll(() => {
      const html = `
       <table>
        <colgroup>
          <col style="width:50%;">
          <col style="width:50%;">
        </colgroup>
        <thead>
          <tr>
            <td>First</td>
            <td>Second</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First</td>
            <td>Second</td>
          </tr>
        </tbody>
      </table>
      `;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      instance = new TableCreator(element, defaultExportOptions);
    });

    test('type should be "table"', () => {
      expect(instance.type).toBe('table');
    });

    test('content should be array of TextBlock and TableCreator elements', () => {
      const content = instance.getContent();

      const isRightInstances = content.every(i => i instanceof TextBlock || i instanceof TableCreator);

      expect(isRightInstances).toBe(true);
    });

    test('transformToDocx should return array DocxParagraph and Table elements', () => {
      const docx = instance.transformToDocx();
      const isRightInstances = docx.every(i => i instanceof DocxParagraph || i instanceof Table);

      expect(isRightInstances).toBe(true);
    });
  });

  describe('Creations with errors', () => {
    test('unsupported table element', () => {
      const html = `
      <table>
        <p>Paragraph</p>
      </table>
      `;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      try {
        new TableCreator(element, defaultExportOptions);
        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toContain('Unsupported table element:');
      }
    });
    test('unsupported table fragment element', () => {
      const html = `
      <table>
        <tbody>
          <p>Paragraph</p>
        </tbody>
      </table>
      `;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      try {
        new TableCreator(element, defaultExportOptions);
        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toContain('Unsupported table fragment element:');
      }
    });
  });

  test('table width should calculates by defined "width" style attribute', () => {
    const html = `
      <table style="width: 50%">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
    const expectedWidthInTwip = 5077.5;

    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

    const instance = new TableCreator(element, defaultExportOptions);

    expect(instance.options.width).toBeDefined();
    expect(instance.options.width?.size).toBe(expectedWidthInTwip);
  });

  test('table without tbody should create without errors', () => {
    const html = `
       <table>
        <caption>New Table</caption>
        <tr>
          <td>First</td>
          <td>Second</td>
        </tr>     
      </table>
      `;

    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
    const instance = new TableCreator(element, defaultExportOptions);
    expect(instance.type).toBe('table');
  });
});
