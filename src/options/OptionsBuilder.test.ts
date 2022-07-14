import { defaultExportOptions, DocxExportOptions, OptionsBuilder, PageFormat, PageOrientation } from '.';

test('mergeOptions should return default options if called without arguments', () => {
  const builder = new OptionsBuilder();
  const options = builder.mergeOptions();

  expect(options).toMatchObject<DocxExportOptions>(defaultExportOptions);
});

describe('mergeOptions should return right object if called with arguments', () => {
  test('should merge page options', () => {
    const testOptions = {
      page: {
        orientation: PageOrientation.Landscape,
        size: PageFormat.A5,
        margins: { top: 10, right: 10 },
      },
    };

    const builder = new OptionsBuilder();
    const options = builder.mergeOptions(testOptions);

    const expectedOptions = {
      ...defaultExportOptions,
      page: {
        ...defaultExportOptions.page,
        ...testOptions.page,
        margins: { ...defaultExportOptions.page.margins, ...testOptions.page.margins },
      },
    };

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

    const builder = new OptionsBuilder();
    const options = builder.mergeOptions(testOptions);

    const expectedOptions = {
      ...defaultExportOptions,
      font: {
        ...defaultExportOptions.font,
        ...testOptions.font,
        headersSizes: { ...defaultExportOptions.font.headersSizes, ...testOptions.font.headersSizes },
      },
    };

    expect(options).toMatchObject<DocxExportOptions>(expectedOptions);
  });
});

test('mergeOptions should throw error when called with wrong arguments', () => {
  const testOptions = {
    foo: { bar: 'baz' },
  };
  const builder = new OptionsBuilder();

  expect(() => builder.mergeOptions(testOptions as unknown as DocxExportOptions)).toThrowError();
});
