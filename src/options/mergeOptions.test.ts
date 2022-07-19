import { mergeWithDefaultOptions, defaultExportOptions, DocxExportOptions, PageFormat, PageOrientation } from '.';

describe('mergeWithDefaultOptions', () => {
  describe('called without argument', () => {
    test('should return default options if no option provided', () => {
      const expectedResult = defaultExportOptions;

      const result = mergeWithDefaultOptions();

      expect(result).toMatchObject<DocxExportOptions>(expectedResult);
    });
  });

  describe('called with user input argument', () => {
    test('should merge page options', () => {
      const testOptions = {
        page: {
          orientation: PageOrientation.Landscape,
          size: PageFormat.A5,
          margins: { top: 10, right: 10 },
        },
      };
      const expectedOptions = {
        ...defaultExportOptions,
        page: {
          ...defaultExportOptions.page,
          ...testOptions.page,
          margins: { ...defaultExportOptions.page.margins, ...testOptions.page.margins },
        },
      };

      const options = mergeWithDefaultOptions(testOptions);

      expect(options).toMatchObject<DocxExportOptions>(expectedOptions);
    });

    test('should merge font options', () => {
      const testOptions = {
        font: {
          baseSize: 40,
          baseFontFamily: 'Times New Roman',
          headersSizes: {
            h1: 45,
            h2: 43,
          },
        },
      };
      const expectedOptions = {
        ...defaultExportOptions,
        font: {
          ...defaultExportOptions.font,
          ...testOptions.font,
          headersSizes: { ...defaultExportOptions.font.headersSizes, ...testOptions.font.headersSizes },
        },
      };

      const options = mergeWithDefaultOptions(testOptions);

      expect(options).toMatchObject<DocxExportOptions>(expectedOptions);
    });
  });

  describe('called with invalid arguments', () => {
    test('should throw exception', () => {
      const testOptions = {
        foo: { bar: 'baz' },
      };

      const fn = () => mergeWithDefaultOptions(testOptions as unknown as DocxExportOptions);

      expect(fn).toThrowError();
    });
  });
});
