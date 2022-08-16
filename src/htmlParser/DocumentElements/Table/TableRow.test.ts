import { Element, parse } from 'himalaya';
import { TableRow as DocxTableRow } from 'docx';
import { defaultExportOptions } from '../../../options';
import { Cell } from './Cell';
import { TableRow } from './TableRow';

describe('TableRow', () => {
  describe('rows with th and td', () => {
    let instance: TableRow;
    beforeAll(() => {
      const html = `
      <tr>
        <th>heading</th>
        <td>cell</td>
      </tr>`;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'tr') as Element;

      instance = new TableRow(element, true, defaultExportOptions);
    });

    test('type should be "table-row"', () => {
      expect(instance.type).toBe('table-row');
    });

    test('children should be array of Cell elements', () => {
      const isCells = instance.children.every(child => child instanceof Cell);
      expect(isCells).toBe(true);
    });

    test('getContent should return array with 1 TableRow element', () => {
      const content = instance.getContent();

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TableRow);
    });

    test('transformToDocx should return array with 1 DocxTableRow element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(DocxTableRow);
    });
  });

  test('rows with unsupported tag should throw an error', () => {
    const html = `
      <tr>
        <th>heading</th>
        <td>cell</td>
        <p>paragraph</p>
      </tr>`;

    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'tr') as Element;
    try {
      new TableRow(element, true, defaultExportOptions);
      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unsupported row element');
    }
  });
});
