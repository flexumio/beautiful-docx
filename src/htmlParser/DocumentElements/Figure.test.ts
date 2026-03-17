import { Table, Paragraph as DocxParagraph, ImageRun } from 'docx';
import { Element, parse } from 'himalaya';
import { Figure, TextBlock, TableCreator, Image } from '.';
import { defaultExportOptions, DocxExportOptions } from '../../options';
import * as fs from 'fs';
import * as path from 'path';

const tableHtml = `
<figure>
  <table>
    <colgroup>
      <col style="width:100%">
    </colgroup>
    <tbody>
      <tr>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</figure>`;

const imageSourceUrl = 'https://example.com/test-image.png';

export const imageHtml = `
    <figure>
      <img src='${imageSourceUrl}'/>
    </figure>`;

describe('Figure', () => {
  test('unknown element name should throw an error', () => {
    const html = `<figure><p>something</p>text</figure>`;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

    try {
      new Figure(element, defaultExportOptions);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unsupported figure ');
    }
  });

  describe('table', () => {
    let instance: Figure;
    beforeAll(() => {
      const element = parse(tableHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;
      instance = new Figure(element, defaultExportOptions);
    });

    test('type should be "figure"', () => {
      expect(instance.type).toBe('figure');
    });

    test('getContent should return array from TextBlock and TableCreator elements', () => {
      const content = instance.getContent();
      const isRightInstances = content.every(i => i instanceof TextBlock || i instanceof TableCreator);

      expect(content).toBeInstanceOf(Array);
      expect(isRightInstances).toBe(true);
    });

    test('transformToDocx should return array from DocxParagraph and Table elements', () => {
      const docx = instance.transformToDocx();
      const isRightInstances = docx.every(i => i instanceof DocxParagraph || i instanceof Table);

      expect(docx).toBeInstanceOf(Array);
      expect(isRightInstances).toBe(true);
    });
  });

  describe('image', () => {
    let instance: Figure;
    beforeAll(async () => {
      const element = parse(imageHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

      const imageBuffer = fs.readFileSync(path.join(__dirname, '../../../example/test-icon.png'));

      const exportOptions: DocxExportOptions = {
        ...defaultExportOptions,
        images: {
          [imageSourceUrl]: imageBuffer,
        },
      };
      instance = new Figure(element, exportOptions);
    });

    test('type should be "figure"', () => {
      expect(instance.type).toBe('figure');
    });

    test('getContent should return array from 1 Image element', () => {
      const content = instance.getContent();

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Image);
    });

    test('transformToDocx should return array with 1 ImageRun element', () => {
      const docx = instance.transformToDocx();

      expect(docx).toBeInstanceOf(Array);
      expect(docx.length).toBe(1);
      expect(docx[0]).toBeInstanceOf(ImageRun);
    });
  });
});
