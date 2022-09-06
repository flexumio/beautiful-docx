import { AlignmentType } from 'docx';

import * as utils from './utils';
const {
  convertPixelsToPoints,
  convertPixelsToTwip,
  parsePaddings,
  parsePaddingsMergedValue,
  parseTextAlignment,
  PIXELS_TO_POINT_RATIO,
} = utils;

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
