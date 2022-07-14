import { mergeWithDefaultOptions, defaultExportOptions, DocxExportOptions, PageFormat, PageOrientation } from '.';

test('mergeWithDefaultOptions should return default options if called without arguments', () => {
  const options = mergeWithDefaultOptions();

  expect(options).toMatchObject<DocxExportOptions>(defaultExportOptions);
});

describe('mergeWithDefaultOptions should return right object if called with arguments', () => {
  test('should merge page options', () => {
    const testOptions = {
      page: {
        orientation: PageOrientation.Landscape,
        size: PageFormat.A5,
        margins: { top: 10, right: 10 },
      },
    };

    const options = mergeWithDefaultOptions(testOptions);

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

    const options = mergeWithDefaultOptions(testOptions);

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

test('mergeWithDefaultOptions should throw error when called with wrong arguments', () => {
  const testOptions = {
    foo: { bar: 'baz' },
  };

  expect(() => mergeWithDefaultOptions(testOptions as unknown as DocxExportOptions)).toThrowError();
});
