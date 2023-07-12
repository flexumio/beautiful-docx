import { defaultExportOptions } from '../options';
import { Header, Image, ListItem, Paragraph, TableCreator, TextBlock } from './DocumentElements';
import { HtmlParser } from '.';
import { Element, parse } from 'himalaya';
import axios from 'axios';

const imageSourceUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png';

describe('HtmlParser', () => {
  describe('parse', () => {
    test('should return array of TextBlock or Image element', async () => {
      const html = `
      <p>Paragraph</p>
      <p>Text</p>
      <strong>Bold</strong>
      <s>Strike</s>
      <figure class="image"><img src='${imageSourceUrl}'/></figure>
      `;
      const instance = new HtmlParser(defaultExportOptions);
      const tree = await instance.parse(html);

      const isRightInstances = tree.every(i => i instanceof TextBlock || i instanceof Image);
      expect(tree).toBeInstanceOf(Array);
      expect(isRightInstances).toBe(true);
    });
  });
  describe('parseTopLevelElement', () => {
    let instance: HtmlParser;
    beforeAll(async () => {
      const buffer = await axios
        .get(imageSourceUrl, { responseType: 'arraybuffer' })
        .then(response => Buffer.from(response.data, 'binary'));

      const images = { [imageSourceUrl]: buffer };
      instance = new HtmlParser({ ...defaultExportOptions, images: images });
    });

    test('top level elements', () => {
      const html = '<html><body>Text</body></html>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "p"', () => {
      const html = '<p>Paragraph</p>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Paragraph);
    });

    test('tag "strong"', () => {
      const html = '<strong>strong</strong>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "i"', () => {
      const html = '<i>i</i>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "u"', () => {
      const html = '<u>u</u>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "s"', () => {
      const html = '<s>s</s>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "br"', () => {
      const html = '<br/>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('tag "h1"', () => {
      const html = '<h1>h1</h1>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "h2"', () => {
      const html = '<h2>h2</h2>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "h3"', () => {
      const html = '<h3>h3</h3>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "h4"', () => {
      const html = '<h4>h4</h4>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "h5"', () => {
      const html = '<h5>h5</h5>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "h6"', () => {
      const html = '<h6>h6</h6>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Header);
    });

    test('tag "ul"', () => {
      const html = '<ul><li>li</li></ul>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);
      const isListItems = content.every(i => i instanceof ListItem);

      expect(content).toBeInstanceOf(Array);
      expect(isListItems).toBe(true);
    });

    test('tag "ol"', () => {
      const html = '<ol><li>li</li></ol>';
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);
      const isListItems = content.every(i => i instanceof ListItem);

      expect(content).toBeInstanceOf(Array);
      expect(isListItems).toBe(true);
    });

    test('tag "figure" as image', () => {
      const html = `<figure class="image">
        <img src='${imageSourceUrl}'/>
      </figure>`;
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(Image);
    });

    test('tag "figure" as table', () => {
      const html = `<figure class="table">
        <table>
          <tbody>
            <tr>
              <td>Figure</td>
            </tr>
          </tbody>
        </table>
      </figure>`;
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);
      const isTableContent = content.every(i => i instanceof TableCreator || i instanceof TextBlock);

      expect(content).toBeInstanceOf(Array);
      expect(isTableContent).toBe(true);
    });

    test('tag "blockquote"', () => {
      const html = `<blockquote>blockquote</blockquote>`;
      const element = parse(html)[0] as Element;

      const content = instance.parseTopLevelElement(element, 0);

      expect(content).toBeInstanceOf(Array);
      expect(content.length).toBe(1);
      expect(content[0]).toBeInstanceOf(TextBlock);
    });

    test('unsupported tag should throw an error', () => {
      const html = `<text>text</text>`;
      const element = parse(html)[0] as Element;

      try {
        instance.parseTopLevelElement(element, 0);
        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toContain('Unsupported top tag');
      }
    });
  });
});
