import { ShadingType, TableCell, VerticalAlign } from 'docx';
import { Element, parse } from 'himalaya';
import { DocxExportOptions, defaultExportOptions } from '../../../options';
import { Cell } from './Cell';
import * as fs from 'fs';
import * as path from 'path';

const imageSourceUrl = path.join(__dirname, '../../../../', 'example/test-icon.png');
const imageBuffer = fs.readFileSync(imageSourceUrl);

describe('Cell', () => {
  let instance: Cell;

  beforeAll(() => {
    const html = '<td>Content</td>';
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
    const cellWidth = 1000;

    instance = new Cell(element, defaultExportOptions, true, cellWidth);
  });

  test('type should be "table-cell"', () => {
    expect(instance.type).toBe('table-cell');
  });

  test('options should contain shading key with predefined fill', () => {
    const expectedShading = { fill: 'F2F2F2', type: ShadingType.CLEAR, color: 'auto' };

    expect(instance.options.shading).toStrictEqual(expectedShading);
  });

  test('if fill defined shading should contain this color', () => {
    const expectedFill = '#FFFFFF';
    const html = `<td style="background-color: ${expectedFill};">Content</td>`;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
    const cellWidth = 1000;

    const instance = new Cell(element, defaultExportOptions, true, cellWidth);

    expect(instance.options.shading).toBeDefined();
    expect(instance.options.shading?.fill).toBe(expectedFill);
  });

  test('getContent should return array with 1 Cell element', () => {
    const content = instance.getContent();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(Cell);
  });

  test('transformToDocx should return array with 1 TableCell element', () => {
    const docx = instance.transformToDocx();

    expect(docx).toBeInstanceOf(Array);
    expect(docx.length).toBe(1);
    expect(docx[0]).toBeInstanceOf(TableCell);
  });

  describe('tableCellChildren', () => {
    test('should return array', () => {
      const html = '<td><p>Content</p>  </td>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
      const cellWidth = 1000;

      const instance = new Cell(element, defaultExportOptions, true, cellWidth);

      expect(instance.tableCellChildren).toBeInstanceOf(Array);
    });
  });

  describe('vertical align', () => {
    test('should be top', () => {
      const html = '<td style="vertical-align: top;">Content</td>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
      const cellWidth = 1000;
      const expectedAlign = VerticalAlign.TOP;

      const instance = new Cell(element, defaultExportOptions, true, cellWidth);

      expect(instance.options.verticalAlign).toBeDefined();
      expect(instance.options.verticalAlign).toBe(expectedAlign);
    });

    test('should be bottom', () => {
      const html = '<td style="vertical-align: bottom;">Content</td>';
      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
      const cellWidth = 1000;
      const expectedAlign = VerticalAlign.BOTTOM;

      const instance = new Cell(element, defaultExportOptions, true, cellWidth);

      expect(instance.options.verticalAlign).toBeDefined();
      expect(instance.options.verticalAlign).toBe(expectedAlign);
    });
  });

  test('image within table cell', () => {
    const html = `
      <td>
        <img src='${imageSourceUrl}'/>
      </td>
    `;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'td') as Element;
    const cellWidth = 1000;

    const exportOptions: DocxExportOptions = {
      ...defaultExportOptions,
      images: {
        [imageSourceUrl]: imageBuffer,
      },
    };

    const instance = new Cell(element, exportOptions, false, cellWidth);
    const docx = instance.transformToDocx();

    expect(docx).toBeDefined();
  });
});
