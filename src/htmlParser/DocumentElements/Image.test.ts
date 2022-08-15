import axios from 'axios';
import { HorizontalPositionAlign, ImageRun, TextWrappingSide, TextWrappingType } from 'docx';
import { Element, parse } from 'himalaya';
import { defaultExportOptions, DocxExportOptions } from '../../options';
import { convertTwipToPixels, getPageWidth } from '../utils';
import { Image } from './Image';
const imageSourceUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png';

const bigImageSourceUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png';

const defaultHtml = `
    <figure class='image'>
      <img src='${imageSourceUrl}'/>
    </figure>`;

describe('Image', () => {
  let instance: Image;

  beforeAll(async () => {
    const element = parse(defaultHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

    const imageBuffer = await axios
      .get(imageSourceUrl, { responseType: 'arraybuffer' })
      .then(response => Buffer.from(response.data, 'binary'));

    const exportOptions: DocxExportOptions = {
      ...defaultExportOptions,
      images: {
        [imageSourceUrl]: imageBuffer,
      },
    };

    instance = new Image(element, exportOptions);
  });

  test('type should be "image"', () => {
    expect(instance.type).toBe('image');
  });

  test('throw error if image is not available', async () => {
    try {
      const element = parse(defaultHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;
      new Image(element, defaultExportOptions);
      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe('Cannot handle image insertion');
    }
  });

  describe('options', () => {
    describe('image size', () => {
      test('should have size like an image size without attributes', () => {
        const expectedSize = { width: 640, height: 557 };

        expect(instance.options.transformation).toStrictEqual(expectedSize);
      });

      test('should be less than page size', async () => {
        const html = `
          <figure class='image'>
            <img src='${bigImageSourceUrl}'/>
          </figure>;
        `;

        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

        const imageBuffer = await axios
          .get(bigImageSourceUrl, { responseType: 'arraybuffer' })
          .then(response => Buffer.from(response.data, 'binary'));

        const exportOptions: DocxExportOptions = {
          ...defaultExportOptions,
          images: {
            [bigImageSourceUrl]: imageBuffer,
          },
        };

        const expectedSize = convertTwipToPixels(getPageWidth(exportOptions));

        const instance = new Image(element, exportOptions);

        expect(instance.options.transformation.width).toBe(expectedSize);
      });

      test('should be changed for width percent', async () => {
        const html = `
          <figure style="width: 10%" class='image'>
            <img src='${imageSourceUrl}'/>
          </figure>;
        `;

        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

        const imageBuffer = await axios
          .get(imageSourceUrl, { responseType: 'arraybuffer' })
          .then(response => Buffer.from(response.data, 'binary'));

        const exportOptions: DocxExportOptions = {
          ...defaultExportOptions,
          images: {
            [imageSourceUrl]: imageBuffer,
          },
        };

        const expectedWidth = '68';
        const expectedHeight = '59';

        const instance = new Image(element, exportOptions);

        expect(instance.options.transformation.width.toFixed()).toBe(expectedWidth);
        expect(instance.options.transformation.height.toFixed()).toBe(expectedHeight);
      });
    });

    describe('horizontal align', () => {
      test('horizontal align should be "center" be default', () => {
        const expectedAlign = HorizontalPositionAlign.CENTER;

        expect(instance.options.floating).toBeDefined();
        expect(instance.options.floating?.horizontalPosition.align).toBe(expectedAlign);
      });

      describe('depend on classes', () => {
        test('should be left aligned', async () => {
          const html = `
            <figure class='image image-style-block-align-left'>
              <img src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const imageBuffer = await axios
            .get(imageSourceUrl, { responseType: 'arraybuffer' })
            .then(response => Buffer.from(response.data, 'binary'));

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };
          const expectedAlign = HorizontalPositionAlign.LEFT;

          const instance = new Image(element, exportOptions);

          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.horizontalPosition.align).toBe(expectedAlign);
        });

        test('should be right aligned', async () => {
          const html = `
            <figure class='image image-style-block-align-right'>
              <img src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const imageBuffer = await axios
            .get(imageSourceUrl, { responseType: 'arraybuffer' })
            .then(response => Buffer.from(response.data, 'binary'));

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };
          const expectedAlign = HorizontalPositionAlign.RIGHT;

          const instance = new Image(element, exportOptions);

          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.horizontalPosition.align).toBe(expectedAlign);
        });
      });
    });

    describe('wrapping', () => {
      test('default wrapping', () => {
        const expectedWrapping = {
          type: TextWrappingType.TOP_AND_BOTTOM,
          side: TextWrappingSide.BOTH_SIDES,
        };

        expect(instance.options.floating).toBeDefined();
        expect(instance.options.floating?.wrap).toStrictEqual(expectedWrapping);
      });

      describe('depend on classes', () => {
        test('should be right-side wrapped', async () => {
          const html = `
            <figure class='image image-style-align-left'>
              <img src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const imageBuffer = await axios
            .get(imageSourceUrl, { responseType: 'arraybuffer' })
            .then(response => Buffer.from(response.data, 'binary'));

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };
          const expectedWrapping = {
            type: TextWrappingType.SQUARE,
            side: TextWrappingSide.RIGHT,
          };

          const instance = new Image(element, exportOptions);

          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.wrap).toStrictEqual(expectedWrapping);
        });

        test('should be left-side wrapped', async () => {
          const html = `
            <figure class='image image-style-align-right'>
              <img src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const imageBuffer = await axios
            .get(imageSourceUrl, { responseType: 'arraybuffer' })
            .then(response => Buffer.from(response.data, 'binary'));

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };
          const expectedWrapping = {
            type: TextWrappingType.SQUARE,
            side: TextWrappingSide.LEFT,
          };

          const instance = new Image(element, exportOptions);

          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.wrap).toStrictEqual(expectedWrapping);
        });
      });
    });
  });

  describe('getImageOrientation', () => {
    test('default', () => {
      expect(instance.getImageRotation()).toStrictEqual({});
    });

    test('horizontal', () => {
      expect(instance.getImageRotation(1)).toStrictEqual({});
    });

    test('mirror horizontal', () => {
      expect(instance.getImageRotation(2)).toStrictEqual({ flip: { horizontal: true } });
    });

    test('rotate 180 degrees', () => {
      expect(instance.getImageRotation(3)).toStrictEqual({ rotation: 180 });
    });

    test('mirror vertical', () => {
      expect(instance.getImageRotation(4)).toStrictEqual({ flip: { vertical: true } });
    });

    test('mirror horizontal and rotate 270', () => {
      expect(instance.getImageRotation(5)).toStrictEqual({ flip: { horizontal: true }, rotation: 270 });
    });

    test('rotate 90 degrees', () => {
      expect(instance.getImageRotation(6)).toStrictEqual({ rotation: 90 });
    });

    test('mirror horizontal and rotate 90', () => {
      expect(instance.getImageRotation(7)).toStrictEqual({ flip: { horizontal: true }, rotation: 90 });
    });

    test('rotate 270 degrees', () => {
      expect(instance.getImageRotation(8)).toStrictEqual({ rotation: 270 });
    });
  });

  test('getContent should return array with 1 Image element', () => {
    const content = instance.getContent();

    expect(content).toBeInstanceOf(Array);
    expect(content.length).toBe(1);
    expect(content[0]).toBeInstanceOf(Image);
  });

  test('getContent should return array with 1 ImageRun element', () => {
    const docx = instance.transformToDocx();

    expect(docx).toBeInstanceOf(Array);
    expect(docx.length).toBe(1);
    expect(docx[0]).toBeInstanceOf(ImageRun);
  });
});
