import { Paragraph } from 'docx';
import { EmptyLine } from './EmptyLine';
describe('EmptyLine', () => {
  it('should return the expected type', () => {
    const expectedResult = 'empty-line';

    const emptyLine = new EmptyLine();
    const result = emptyLine.type;

    expect(result).toEqual(expectedResult);
  });

  it('should return itself as the content', () => {
    const emptyLine = new EmptyLine();
    const expectedResult = [emptyLine];

    const result = emptyLine.getContent();

    expect(result).toEqual(expectedResult);
  });

  it('should transform to a single Paragraph', () => {
    const emptyLine = new EmptyLine();
    const expectedResult = [new Paragraph({})];

    const result = emptyLine.transformToDocx();

    expect(result).toEqual(expectedResult);
  });
});
