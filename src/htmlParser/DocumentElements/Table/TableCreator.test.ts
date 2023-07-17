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

  describe('table width should calculates by defined "width" style attribute', () => {
    test('should support percentage value', () => {
      const html = `
      <table style="width: 50%">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 4536;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });
    test('should support vw value', () => {
      const html = `
      <table style="width: 50vw">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 4536;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });
    test('should support vh value', () => {
      const html = `
      <table style="width: 50vh">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support "auto" value', () => {
      const html = `
      <table style="width: auto">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support pt value, width < pageWidth', () => {
      const html = `
      <table style="width: 10pt">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 200;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);
      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support pt value, width > pageWidth', () => {
      const html = `
      <table style="width: 1000pt">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);
      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support px value, width < pageWidth', () => {
      const html = `
      <table style="width: 10px">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 150;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support px value, width > pageWidth', () => {
      const html = `
      <table style="width: 10000px">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support em value, width < pageWidth', () => {
      const html = `
      <table style="width: 10em">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 2400;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support em value, width > pageWidth', () => {
      const html = `
      <table style="width: 100em">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support rem value, width < pageWidth', () => {
      const html = `
      <table style="width: 10rem">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 2400;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });

    test('should support rem value, width > pageWidth', () => {
      const html = `
      <table style="width: 100rem">
        <tbody>
          <tr><td>First</td></tr>
        </tbody>
      </table>
      `;
      const expectedWidthInTwip = 9072;

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;

      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.width).toBeDefined();
      expect(instance.options.width?.size).toBe(expectedWidthInTwip);
    });
  });

  describe('column width should calculates by defined "width" style attribute', () => {
    test('should support percentage value', () => {
      const html = `
       <table style="width:120px;">
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

      const expectedColumnsWidthInTwip = [900, 900];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });

    test('should support vw value', () => {
      const html = `
    <table style="width:120px;">
     <colgroup>
       <col style="width:50vw;">
       <col style="width:50vw;">
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

      const expectedColumnsWidthInTwip = [900, 900];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });
    test('should support vh value', () => {
      const html = `
    <table style="width:120px;">
     <colgroup>
       <col style="width:50vh;">
       <col style="width:50vh;">
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

      const expectedColumnsWidthInTwip = [900, 900];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });

    test('should support "auto" value', () => {
      const html = `
    <table style="width:120px;">
     <colgroup>
       <col style="width:auto;">
       <col style="width:auto;">
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

      const expectedColumnsWidthInTwip = [900, 900];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });

    test('should support pt value', () => {
      const html = `
    <table>
     <colgroup>
       <col style="width:10pt;">
       <col style="width:10pt;">
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

      const expectedColumnsWidthInTwip = [200, 200];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });
    test('should support px value', () => {
      const html = `
    <table>
     <colgroup>
       <col style="width:10px;">
       <col style="width:10px;">
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

      const expectedColumnsWidthInTwip = [150, 150];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });

    test('should support em value', () => {
      const html = `
    <table>
     <colgroup>
       <col style="width:10em;">
       <col style="width:10em">
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

      const expectedColumnsWidthInTwip = [2400, 2400];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });

    test('should support rem value', () => {
      const html = `
      <table>
       <colgroup>
         <col style="width:10rem;">
         <col style="width:10rem;">
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

      const expectedColumnsWidthInTwip = [2400, 2400];

      const element = parse(html).find(i => i.type === 'element' && i.tagName === 'table') as Element;
      const instance = new TableCreator(element, defaultExportOptions);

      expect(instance.options.columnWidths).toBeDefined();
      expect(instance.options.columnWidths).toStrictEqual(expectedColumnsWidthInTwip);
    });
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
