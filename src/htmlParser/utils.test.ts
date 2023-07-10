import { AlignmentType } from 'docx';

import * as utils from './utils';
import { getIndent } from './utils';
const {
  convertPixelsToPoints,
  convertPixelsToTwip,
  convertPointsToTwip,
  parsePaddings,
  parsePaddingsMergedValue,
  parseTextAlignment,
  PIXELS_TO_POINT_RATIO,
  convertPointsToPixels,
  parseSizeValue,
} = utils;
import { defaultExportOptions } from '../options';

describe('convertPixelsToPoints', () => {
  test('convert string pixels', () => {
    const pixels = '10px';
    const expectedResult = 10 * PIXELS_TO_POINT_RATIO;

    expect(convertPixelsToPoints(pixels)).toBe(expectedResult);
  });

  test('convert unsupported string pixels', () => {
    const pixels = '10vw';

    try {
      convertPixelsToPoints(pixels);
      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unable to parse pixels string:');
    }
  });

  test('convert number pixels', () => {
    const pixels = 10;
    const expectedResult = pixels * PIXELS_TO_POINT_RATIO;

    expect(convertPixelsToPoints(pixels)).toBe(expectedResult);
  });
});
describe('convertPointsToPixels', () => {
  test('convert string points', () => {
    const points = '10pt';
    const expectedResult = 10 / PIXELS_TO_POINT_RATIO;

    expect(convertPointsToPixels(points)).toBe(expectedResult);
  });

  test('convert unsupported string points', () => {
    const points = '10vw';

    try {
      convertPointsToPixels(points);
      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toContain('Unable to parse points string:');
    }
  });

  test('convert number points', () => {
    const points = 10;
    const expectedResult = points / PIXELS_TO_POINT_RATIO;

    expect(convertPointsToPixels(points)).toBe(expectedResult);
  });
});

describe('parseTextAlignment', () => {
  test('default', () => {
    const attrs = [{ key: 'style', value: 'text-align:unsupported' }];
    const expectedResult = AlignmentType.LEFT;

    const result = parseTextAlignment(attrs);

    expect(result).toBe(expectedResult);
  });

  test('justify', () => {
    const attrs = [{ key: 'style', value: 'text-align:justify' }];
    const expectedResult = AlignmentType.JUSTIFIED;

    const result = parseTextAlignment(attrs);

    expect(result).toBe(expectedResult);
  });

  test('left', () => {
    const attrs = [{ key: 'style', value: 'text-align:left' }];
    const expectedResult = AlignmentType.LEFT;

    const result = parseTextAlignment(attrs);

    expect(result).toBe(expectedResult);
  });

  test('right', () => {
    const attrs = [{ key: 'style', value: 'text-align:right' }];
    const expectedResult = AlignmentType.RIGHT;

    const result = parseTextAlignment(attrs);

    expect(result).toBe(expectedResult);
  });

  test('center', () => {
    const attrs = [{ key: 'style', value: 'text-align:center' }];
    const expectedResult = AlignmentType.CENTER;

    const result = parseTextAlignment(attrs);

    expect(result).toBe(expectedResult);
  });
});

describe('convertPixelsToTwip', () => {
  const expectedResult = 15;

  expect(convertPixelsToTwip(1)).toBe(expectedResult);
});

describe('convertMillimetersToTwip', () => {
  const expectedResult = 20;

  expect(convertPointsToTwip(1)).toBe(expectedResult);
});

describe('parsePaddingsMergedValue', () => {
  describe('with 1 property', () => {
    test('should return object with same values', () => {
      const string = '1px';
      const expectedResult = {
        top: 15,
        left: 15,
        right: 15,
        bottom: 15,
      };

      const result = parsePaddingsMergedValue(string);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('with 2 properties', () => {
    test('should return object with same vertical and horizontal values', () => {
      const string = '1px 2px';
      const expectedResult = {
        top: 15,
        left: 30,
        right: 30,
        bottom: 15,
      };

      const result = parsePaddingsMergedValue(string);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('with 3 property', () => {
    test('should return object with top value, bottom value and same horizontal values', () => {
      const string = '1px 2px 3px';
      const expectedResult = {
        top: 15,
        left: 30,
        right: 30,
        bottom: 45,
      };

      const result = parsePaddingsMergedValue(string);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('with 4 property', () => {
    test('should return object with all values', () => {
      const string = '1px 2px 3px 4px';
      const expectedResult = {
        top: 15,
        left: 60,
        right: 30,
        bottom: 45,
      };

      const result = parsePaddingsMergedValue(string);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('with unexpected properties', () => {
    test('should throw error', () => {
      const string = '1px 2px 3px 4px 5px';

      try {
        parsePaddingsMergedValue(string);

        expect(true).toBe(false);
      } catch (e) {
        expect((e as Error).message).toContain('Unsupported padding value:');
      }
    });
  });
});

describe('parsePaddings', () => {
  describe('padding-top', () => {
    test('should return object with top value', () => {
      const expectedResult = {
        top: 15,
      };

      expect(parsePaddings({ 'padding-top': '1px' })).toEqual(expectedResult);
    });
  });

  describe('padding-left', () => {
    test('should return object with left value', () => {
      const expectedResult = {
        left: 15,
      };

      expect(parsePaddings({ 'padding-left': '1px' })).toEqual(expectedResult);
    });
  });
  describe('padding-right', () => {
    test('should return object with right value', () => {
      const expectedResult = {
        right: 15,
      };

      expect(parsePaddings({ 'padding-right': '1px' })).toEqual(expectedResult);
    });
  });
  describe('padding-bottom', () => {
    test('should return object with bottom value', () => {
      const expectedResult = {
        bottom: 15,
      };

      expect(parsePaddings({ 'padding-bottom': '1px' })).toEqual(expectedResult);
    });
  });

  describe('padding', () => {
    test('should call parsePaddingsMergedValue', () => {
      const fn = jest.spyOn(utils, 'parsePaddingsMergedValue');

      parsePaddings({ padding: '1px' });

      expect(fn).toBeCalled();
    });
  });
});

describe('parseSizeValue', () => {
  test('should return pixels result if param is number', () => {
    const number = 42;
    const expectedResult = [number, 'px'];

    const result = parseSizeValue(number);

    expect(result).toEqual(expectedResult);
  });

  test('should return appropriate result by different string parameters', () => {
    const units = ['px', 'pt', 'em', 'rem', 'vh', 'vw', '%'];
    const size = 42;

    units.forEach(unit => {
      const expectedResult = [size, unit];
      const inputString = `${size}${unit}`;

      const result = parseSizeValue(inputString);

      expect(result).toEqual(expectedResult);
    });
  });

  test('should return appropriate result by "auto" parameter', () => {
    const inputString = 'auto';

    const result = parseSizeValue(inputString);

    expect(result).toEqual([0, 'auto']);
  });

  test('should throw error when units is invalid', () => {
    const inputString = '42error';

    try {
      parseSizeValue(inputString);

      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toBe('Invalid units');
    }
  });
});

describe('getIndent', () => {
  const optionsWithIndent = defaultExportOptions;
  const optionsWithoutIndent = {
    ...defaultExportOptions,
    ignoreIndentation: false,
  };
  const paragraphIndex = 1;

  test('should return undefined when paragraph index is 0', () => {
    const result = getIndent(0, optionsWithoutIndent);

    expect(result).toBeUndefined();
  });

  test('should return undefined when ignoreIndentation is true', () => {
    const result = getIndent(paragraphIndex, optionsWithIndent);

    expect(result).toBeUndefined();
  });

  test('should call convertMillimetersToTwip and return the expected result', () => {
    const expectedResult = 340;
    const result = getIndent(paragraphIndex, optionsWithoutIndent);

    expect(result).toEqual({ firstLine: expectedResult });
  });
});
