import { parse, Node, Attribute, Element } from 'himalaya';
import {
  AlignmentType,
  BorderStyle,
  convertMillimetersToTwip,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  IParagraphOptions,
  IRunOptions,
  Paragraph,
  ParagraphChild,
  Table,
  TextRun,
  UnderlineType,
} from 'docx';
import { DEFAULT_NUMBERING_REF } from '../docxStylesHelper';
import { DocxExportOptions } from '../docxExportOptions';
import { parseTable } from './tableParser';
import { getAttributeMap, ParseResult, parseStyles } from './common';
import { downloadImages, parseImage } from './imageParser';

const FIRST_LINE_INDENT_MILLIMETERS = 6;
const BLOCKQUOTE_SIZE = 25;
const BLOCKQUOTE_COLOR = '#cccccc';
const BLOCKQUOTE_SPACE = 12;

const parseTextAlignment = (attribs: Attribute[]): AlignmentType => {
  const cellAttributes = getAttributeMap(attribs);
  const style = parseStyles(cellAttributes['style']);

  switch (style['text-align']) {
    case 'justify':
      return AlignmentType.JUSTIFIED;
    case 'left':
      return AlignmentType.LEFT;
    case 'right':
      return AlignmentType.RIGHT;
    case 'center':
      return AlignmentType.CENTER;
    default:
      return AlignmentType.LEFT;
  }
};

const cleanTextContent = (content: string) => {
  // replace &nbsp; characters
  return content.replace(/&nbsp;/g, ' ').trim();
};

export const parseParagraphChild = (element: Node, textOptions: IRunOptions = {}): ParagraphChild[] => {
  if (element.type === 'text') {
    return [new TextRun({ text: cleanTextContent(element.content), ...textOptions })];
  }

  if (element.type === 'element') {
    switch (element.tagName) {
      case 'br':
        return [new TextRun({ break: 1 })];
      case 'strong':
        return element.children.flatMap(child => parseParagraphChild(child, { ...textOptions, bold: true }));
      case 'i':
        return element.children.flatMap(child => parseParagraphChild(child, { ...textOptions, italics: true }));
      case 'u':
        return element.children.flatMap(child =>
          parseParagraphChild(child, {
            ...textOptions,
            underline: { type: UnderlineType.SINGLE },
          })
        );
      case 's':
        return element.children.flatMap(child =>
          parseParagraphChild(child, {
            ...textOptions,
            strike: true,
          })
        );
      case 'a':
        return [
          new ExternalHyperlink({
            link: element.attributes.find(item => item.key === 'href')?.value || '',
            children: element.children.flatMap(child =>
              parseParagraphChild(child, {
                ...textOptions,
              })
            ),
          }),
        ];
      default:
        throw new Error(`Unsupported ${element.tagName} tag`);
    }
  }

  return [];
};

const isListTag = (tagName: string): boolean => {
  return tagName === 'ul' || tagName === 'ol';
};

const parseListItem = (element: Node, options: IParagraphOptions, level: number): Paragraph[] => {
  if (element.type === 'element' && element.tagName === 'li') {
    const nestedLists: Paragraph[] = [];
    const liOptions: IParagraphOptions = {
      ...options,
      alignment: parseTextAlignment(element.attributes),
      children: [],
    };

    element.children.forEach(child => {
      if (child.type === 'element' && isListTag(child.tagName)) {
        nestedLists.push(...parseList(child, level + 1));
      } else {
        liOptions.children?.push(...parseParagraphChild(child));
      }
    });

    return [new Paragraph(liOptions), ...nestedLists];
  }

  throw new Error('The child of list should be list item');
};

const parseList = (element: Element, level: number): Paragraph[] => {
  const ulParagraphOption: IParagraphOptions = { bullet: { level } };
  const olParagraphOption: IParagraphOptions = { numbering: { reference: DEFAULT_NUMBERING_REF, level } };

  switch (element.tagName) {
    case 'ul':
      return element.children.flatMap(child => parseListItem(child, ulParagraphOption, level));
    case 'ol':
      return element.children.flatMap(child => parseListItem(child, olParagraphOption, level));
    default:
      throw new Error(`Unsupported list type ${element.tagName}`);
  }
};

const parseHeader = (element: Element, level: HeadingLevel): Paragraph[] => {
  const h1options: IParagraphOptions = {
    heading: level,
    alignment: parseTextAlignment(element.attributes),
    children: element.children.flatMap(child => parseParagraphChild(child)),
  };

  return [new Paragraph(h1options)];
};

const getIndent = (paragraphIndex: number, docxExportOptions: DocxExportOptions) => {
  if (paragraphIndex === 0 || docxExportOptions.ignoreIndentation) {
    return undefined;
  }

  return { firstLine: convertMillimetersToTwip(FIRST_LINE_INDENT_MILLIMETERS) };
};

const parseParagraph = (element: Element, index: number, docxExportOptions: DocxExportOptions): Paragraph[] => {
  const pOptions: IParagraphOptions = {
    alignment: parseTextAlignment(element.attributes),
    children: element.children.flatMap(child => parseParagraphChild(child)),
    indent: getIndent(index, docxExportOptions),
    spacing: { after: convertMillimetersToTwip(docxExportOptions.verticalSpaces) },
  };
  return [new Paragraph(pOptions)];
};

const parseBlockquote = (element: Element): Paragraph[] => {
  return element.children.map(child => {
    const options: IParagraphOptions = {
      alignment: parseTextAlignment(element.attributes),
      children:
        child.type === 'element'
          ? child.children.flatMap(child =>
              parseParagraphChild(child, {
                italics: true,
              })
            )
          : parseParagraphChild(child),
      border: {
        left: { style: BorderStyle.SINGLE, size: BLOCKQUOTE_SIZE, color: BLOCKQUOTE_COLOR, space: BLOCKQUOTE_SPACE },
      },
      indent: { left: convertMillimetersToTwip(6) },
    };

    return new Paragraph(options);
  });
};

const parseFigure = (element: Element, docxExportOptions: DocxExportOptions): ParseResult[] => {
  const attributesMap = getAttributeMap(element.attributes);
  const classString = attributesMap['class'] || '';
  const classes = classString.split(' ');

  if (classes.includes('table')) {
    return parseTable(element, docxExportOptions);
  } else if (classes.includes('image')) {
    return parseImage(element, docxExportOptions);
  }

  throw new Error(`Unsupported figure with class ${attributesMap['class']}`);
};

export const parseTopLevelElement = (
  element: Element,
  pIndex: number,
  docxExportOptions: DocxExportOptions
): ParseResult[] => {
  switch (element.tagName) {
    case 'p':
      return parseParagraph(element, pIndex, docxExportOptions);
    case 'strong':
    case 'i':
    case 'u':
    case 's':
      return [new Paragraph({ children: parseParagraphChild(element) })];
    case 'h1':
      return parseHeader(element, HeadingLevel.HEADING_1);
    case 'h2':
      return parseHeader(element, HeadingLevel.HEADING_2);
    case 'h3':
      return parseHeader(element, HeadingLevel.HEADING_3);
    case 'h4':
      return parseHeader(element, HeadingLevel.HEADING_4);
    case 'ul':
    case 'ol':
      return parseList(element, 0);
    case 'figure':
      return parseFigure(element, docxExportOptions);
    case 'blockquote':
      return parseBlockquote(element);
    default:
      throw new Error(`Unsupported top tag ${element.tagName}`);
  }
};

const parseHtmlTree = (root: Node[], docxExportOptions: DocxExportOptions): ParseResult[] => {
  const paragraphs: ParseResult[] = [];
  let pCounts = 0;

  for (const child of root) {
    if (child.type === 'element') {
      const attributesMap = getAttributeMap(child.attributes);
      if (child.tagName === 'div' && attributesMap['class'] === 'scene') {
        paragraphs.push(
          ...[
            ...parseHtmlTree(child.children, docxExportOptions),
            new Paragraph({ children: [new TextRun({ break: 1 })] }),
          ]
        );
      } else {
        const topLevelElement = parseTopLevelElement(child, pCounts, docxExportOptions);
        paragraphs.push(...topLevelElement);

        if (child.tagName === 'p') pCounts++;
      }
    }
  }

  return paragraphs;
};

const postProcess = (docxTree: ParseResult[]): (Paragraph | Table)[] => {
  const results: (Paragraph | Table)[] = [];

  let iterator = 0;

  while (iterator < docxTree.length) {
    const currentItem = docxTree[iterator];
    const nextItem = docxTree[iterator + 1];

    const isCurrentItemImage = currentItem instanceof ImageRun;
    const isNextItemParagraph = nextItem instanceof Paragraph;

    if (isCurrentItemImage && isNextItemParagraph) {
      nextItem.addChildElement(currentItem);
      results.push(nextItem);
      iterator += 2;
      continue;
    }

    if (isCurrentItemImage && !isNextItemParagraph) {
      results.push(new Paragraph({ children: [currentItem] }));
      iterator += 1;
      continue;
    }

    results.push(currentItem);
    iterator += 1;
  }

  return results;
};

export const parseHtmlContent = async (
  content: string,
  docxExportOptions: DocxExportOptions
): Promise<(Paragraph | Table)[]> => {
  const parsedContent = parse(content);
  const images = await downloadImages(parsedContent, {});

  const docxTree = parseHtmlTree(parsedContent, { ...docxExportOptions, images });

  return postProcess(docxTree);
};
