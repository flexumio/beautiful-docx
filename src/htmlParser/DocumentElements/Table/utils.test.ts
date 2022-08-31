import { BorderStyle } from 'docx';
import { parse } from 'himalaya';
import { isInlineTextElement, parseBorderOptions, parseBorderStyle } from './utils';

describe('isInlineTextElement', () => {
  test('plan text should be inline text element', () => {
    const html = 'plan text';
    const node = parse(html)[0];

    expect(isInlineTextElement(node)).toBe(true);
  });

  test('inline tags should be inline text element', () => {
    const html = '<i>italic</i>';
    const node = parse(html)[0];

    expect(isInlineTextElement(node)).toBe(true);
  });

  test('block tags should not be inline text element', () => {
    const html = '<p>Paragraph</p>';
    const node = parse(html)[0];

    expect(isInlineTextElement(node)).toBe(false);
  });
});

test('parseBorderStyle', () => {
  expect(parseBorderStyle('solid')).toBe(BorderStyle.SINGLE);
  expect(parseBorderStyle('dotted')).toBe(BorderStyle.DOTTED);
  expect(parseBorderStyle('dashed')).toBe(BorderStyle.DASHED);
  expect(parseBorderStyle('double')).toBe(BorderStyle.DOUBLE);
  expect(parseBorderStyle('inset')).toBe(BorderStyle.INSET);
  expect(parseBorderStyle('outset')).toBe(BorderStyle.OUTSET);
  expect(parseBorderStyle('default')).toBe(BorderStyle.SINGLE);
});

describe('parseBorderOptions', () => {
  test('without styles', () => {
    const expectedOptions = { style: BorderStyle.SINGLE, color: 'bfbfbf', size: 4 };

    expect(parseBorderOptions({})).toStrictEqual(expectedOptions);
  });

  test('without border style', () => {
    const styles = {
      'border-style': 'solid',
      'border-color': '#FFFFFF',
      'border-width': '1px',
    };

    const expectedOptions = {
      style: BorderStyle.SINGLE,
      color: styles['border-color'],
      size: 0.25,
    };

    expect(parseBorderOptions(styles)).toStrictEqual(expectedOptions);
  });

  test('with border style', () => {
    const styles = { border: '1px solid #fff' };
    const expectedOptions = { style: BorderStyle.SINGLE, size: 0.25, color: '#FFFFFF' };

    expect(parseBorderOptions(styles)).toStrictEqual(expectedOptions);
  });

  test('unsupported border style should throw an error', () => {
    const styles = { border: '1px solid' };

    expect(() => parseBorderOptions(styles)).toThrowError();
  });
});
