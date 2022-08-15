import axios from 'axios';
import { Table, Paragraph as DocxParagraph, ImageRun } from 'docx';
import { Element, parse } from 'himalaya';
import { Figure, TextBlock, TableCreator, Image } from '.';
import { defaultExportOptions, DocxExportOptions } from '../../options';

const tableHtml = `
<figure class="table">
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

const imageSourceUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png';

export const imageHtml = `
    <figure class='image'>
      <img src='${imageSourceUrl}'/>
    </figure>`;

describe('Figure', () => {
  test('unknown element name should throw an error', () => {
    const html = `<figure class="foo"></figure>`;
    const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

    try {
      new Figure(element, defaultExportOptions);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unsupported figure with class');
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

    test('should throw an error if has no table element', () => {
      const html = `<figure class='table'><p></p></figure>`;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;
      try {
        new Figure(element, defaultExportOptions);
        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toBe('No table element found');
      }
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

      const imageBuffer = await axios
        .get(imageSourceUrl, { responseType: 'arraybuffer' })
        .then(response => Buffer.from(response.data, 'binary'));

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
