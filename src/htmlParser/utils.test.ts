import { AlignmentType } from 'docx';
import { convertPixelsToPoints, convertPixelsToTwip, parseTextAlignment, PIXELS_TO_POINT_RATIO } from './utils';

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
