import { HorizontalPositionAlign, ImageRun, TextWrappingSide, TextWrappingType } from 'docx';
import { Element, parse } from 'himalaya';
import { defaultExportOptions, DocxExportOptions } from '../../options';
import { convertTwipToPixels, getPageWidth } from '../utils';
import { Image } from './Image';
import * as fs from 'fs';
import * as path from 'path';

const imageSourceUrl = path.join(__dirname, '../../../', 'example/test-icon.png');
const imageBuffer = fs.readFileSync(imageSourceUrl);
const bigImageSourceUrl = path.join(__dirname, '../../../', '/example/test-icon-big.png');
const bigImageBuffer = fs.readFileSync(bigImageSourceUrl);
const defaultHtml = `
    <figure>
      <img src='${imageSourceUrl}'/>
    </figure>`;

describe('Image', () => {
  let instance: Image;

  beforeAll(async () => {
    const element = parse(defaultHtml).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

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
        const expectedSize = { width: 512, height: 446 };

        const roundedResult = {
          height: Math.round(instance.options.transformation.height),
          width: Math.round(instance.options.transformation.width),
        };

        expect(roundedResult).toStrictEqual(expectedSize);
      });

      test('should be less than page size', async () => {
        const html = `
          <figure class='image'>
            <img src='${bigImageSourceUrl}'/>
          </figure>;
        `;

        const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

        const exportOptions: DocxExportOptions = {
          ...defaultExportOptions,
          images: {
            [bigImageSourceUrl]: bigImageBuffer,
          },
        };

        const expectedSize = convertTwipToPixels(getPageWidth(exportOptions));

        const instance = new Image(element, exportOptions);

        expect(instance.options.transformation.width).toBe(expectedSize);
      });

      describe('should be changed for width style', () => {
        test('with percentage value', async () => {
          const html = `
          <figure class='image'>
            <img style="width: 10%" src='${imageSourceUrl}'/>
          </figure>;
        `;

          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };

          const expectedWidth = '60';
          const expectedHeight = '53';

          const instance = new Image(element, exportOptions);

          expect(instance.options.transformation.width.toFixed()).toBe(expectedWidth);
          expect(instance.options.transformation.height.toFixed()).toBe(expectedHeight);
        });
        test('with vw value', async () => {
          const html = `
          <figure class='image'>
            <img style="width: 10vw" src='${imageSourceUrl}'/>
          </figure>;
        `;

          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };

          const expectedWidth = '60';
          const expectedHeight = '53';

          const instance = new Image(element, exportOptions);

          expect(instance.options.transformation.width.toFixed()).toBe(expectedWidth);
          expect(instance.options.transformation.height.toFixed()).toBe(expectedHeight);
        });

        test('with pixels value', async () => {
          const html = `
          <figure class='image'>
            <img style="width: 100px" src='${imageSourceUrl}'/>
          </figure>;
        `;

          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };

          const expectedWidth = '100';
          const expectedHeight = '87';

          const instance = new Image(element, exportOptions);

          expect(instance.options.transformation.width.toFixed()).toBe(expectedWidth);
          expect(instance.options.transformation.height.toFixed()).toBe(expectedHeight);
        });

        test('width > pageWidth', async () => {
          const html = `
          <figure class='image'>
            <img style="width: 10000px" src='${imageSourceUrl}'/>
          </figure>;
        `;

          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

          const exportOptions: DocxExportOptions = {
            ...defaultExportOptions,
            images: {
              [imageSourceUrl]: imageBuffer,
            },
          };

          const expectedWidth = '9072';

          const instance = new Image(element, exportOptions);

          expect(instance.options.transformation.width.toFixed()).toBe(expectedWidth);
        });
      });
    });

    describe('horizontal align', () => {
      test('horizontal align should be "center" be default', () => {
        const expectedAlign = HorizontalPositionAlign.CENTER;

        if (instance.options.floating) {
          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.horizontalPosition.align).toBe(expectedAlign);
        }
      });

      describe('depend on styles', () => {
        test('should be left aligned', async () => {
          const html = `
            <figure>
              <img style="float: left" src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

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
            <figure>
              <img style="float: right" src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

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

        if (instance.options.floating) {
          expect(instance.options.floating).toBeDefined();
          expect(instance.options.floating?.wrap).toStrictEqual(expectedWrapping);
        }
      });

      describe('depend on styles', () => {
        test('should be right-side wrapped', async () => {
          const html = `
            <figure>
              <img style="float: left" src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

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
            <figure>
              <img style="float: right" src='${imageSourceUrl}'/>
            </figure>`;
          const element = parse(html).find(i => i.type === 'element' && i.tagName === 'figure') as Element;

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
