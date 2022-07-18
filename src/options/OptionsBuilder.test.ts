import { defaultExportOptions, DocxExportOptions, OptionsBuilder, PageFormat, PageOrientation } from '.';
describe('OptionsBuilder', () => {
  describe('mergeOptions', () => {
    describe('called without argument', () => {
      test('should return default options if no option provided', () => {
        const expectedResult = defaultExportOptions;
        const builder = new OptionsBuilder();

        const options = builder.mergeOptions();

        expect(options).toMatchObject<DocxExportOptions>(expectedResult);
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
        const builder = new OptionsBuilder();

        const options = builder.mergeOptions(testOptions);

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
        const builder = new OptionsBuilder();

        const options = builder.mergeOptions(testOptions);

        expect(options).toMatchObject<DocxExportOptions>(expectedOptions);
      });
    });

    describe('called with invalid arguments', () => {
      test('should throw exception', () => {
        const testOptions = {
          foo: { bar: 'baz' },
        };
        const builder = new OptionsBuilder();

        const fn = () => builder.mergeOptions(testOptions as unknown as DocxExportOptions);

        expect(fn).toThrowError();
      });
    });
  });
});
