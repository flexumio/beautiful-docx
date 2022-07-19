import { imageSize } from 'image-size';
import {
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  IMediaTransformation,
  ITextWrapping,
  TextWrappingSide,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from 'docx';
import { Element } from 'himalaya';
import { DocxExportOptions } from '../options';
import { convertTwipToPixels, getAttributeMap, getPageWidth, parseStyles } from './utils';

const getHorizontalPositionAlign = (classes: string[]): HorizontalPositionAlign => {
  if (classes.includes('image-style-block-align-left') || classes.includes('image-style-align-left')) {
    return HorizontalPositionAlign.LEFT;
  } else if (classes.includes('image-style-block-align-right') || classes.includes('image-style-align-right')) {
    return HorizontalPositionAlign.RIGHT;
  }

  return HorizontalPositionAlign.CENTER;
};

const getWrapping = (classes: string[]): ITextWrapping => {
  if (classes.includes('image-style-align-left')) {
    return {
      type: TextWrappingType.SQUARE,
      side: TextWrappingSide.RIGHT,
    };
  } else if (classes.includes('image-style-align-right')) {
    return {
      type: TextWrappingType.SQUARE,
      side: TextWrappingSide.LEFT,
    };
  }

  return {
    type: TextWrappingType.TOP_AND_BOTTOM,
    side: TextWrappingSide.BOTH_SIDES,
  };
};

enum ImageOrientation {
  Horizontal = 1,
  MirrorHorizontal = 2,
  Rotate180 = 3,
  MirrorVertical = 4,
  MirrorHorizontalAndRotate270 = 5,
  Rotate90 = 6,
  MirrorHorizontalAndRotate90 = 7,
  Rotate270 = 6,
}

const getImageRotation = (orientation?: number): Partial<IMediaTransformation> => {
  // types of image orientations can be found here
  // https://exiftool.org/TagNames/EXIF.html#:~:text=0x0112,8%20=%20Rotate%20270%20CW

  switch (orientation) {
    case ImageOrientation.Horizontal:
      return {};
    case ImageOrientation.MirrorHorizontal:
      return { flip: { horizontal: true } };
    case ImageOrientation.Rotate180:
      return { rotation: 180 };
    case ImageOrientation.MirrorVertical:
      return { flip: { vertical: true } };
    case ImageOrientation.MirrorHorizontalAndRotate270:
      return { flip: { horizontal: true }, rotation: 270 };
    case ImageOrientation.Rotate90:
      return { rotation: 90 };
    case ImageOrientation.MirrorHorizontalAndRotate90:
      return { flip: { horizontal: true }, rotation: 90 };
    case ImageOrientation.Rotate270:
      return { rotation: 270 };
    default:
      return {};
  }
};

const getImageSize = (
  imageFigure: Element,
  image: Buffer,
  docxExportOptions: DocxExportOptions
): IMediaTransformation => {
  const pageWidth = getPageWidth(docxExportOptions);
  const pageWidthPixels = convertTwipToPixels(pageWidth);
  const imageDimensions = imageSize(image);

  const originWidth = imageDimensions.width || 0;
  const originHeight = imageDimensions.height || 0;

  const imageAttr = getAttributeMap(imageFigure.attributes);
  const imageStyles = parseStyles(imageAttr['style']);
  const imageWidthPercent = imageStyles['width'];

  const imageRotation = getImageRotation(imageDimensions.orientation);

  if (imageWidthPercent) {
    const widthPercent = parseFloat(imageWidthPercent.slice(0, -1));
    const widthPixels = (pageWidthPixels * widthPercent) / 100;
    const resizeRatio = widthPixels / originWidth;

    return {
      width: widthPixels,
      height: originHeight * resizeRatio,
      ...imageRotation,
    };
  }

  const maxImageWidth = pageWidthPixels;

  if (originWidth > maxImageWidth) {
    const resizeRatio = maxImageWidth / originWidth;

    return {
      width: maxImageWidth,
      height: originHeight * resizeRatio,
      ...imageRotation,
    };
  }

  return {
    width: originWidth,
    height: originHeight,
    ...imageRotation,
  };
};

export const parseImage = (imageFigure: Element, docxExportOptions: DocxExportOptions): ImageRun[] => {
  const figureAttr = getAttributeMap(imageFigure.attributes);
  const classString = figureAttr['class'] || '';
  const classes = classString.split(' ');

  const image = imageFigure.children.find(item => item.type === 'element' && item.tagName === 'img') as Element;
  const imageAttr = getAttributeMap(image.attributes);
  const imageSourceUrl = imageAttr['src'];

  if (!docxExportOptions.images) {
    throw new Error('Cannot handle image insertion');
  }

  const imageBuffer = docxExportOptions.images[imageSourceUrl];

  return [
    new ImageRun({
      data: imageBuffer,
      transformation: getImageSize(imageFigure, imageBuffer, docxExportOptions),
      floating: {
        horizontalPosition: {
          relative: HorizontalPositionRelativeFrom.COLUMN,
          align: getHorizontalPositionAlign(classes),
        },
        verticalPosition: {
          relative: VerticalPositionRelativeFrom.PARAGRAPH,
          align: VerticalPositionAlign.BOTTOM,
        },
        wrap: getWrapping(classes),
        margins: {
          top: 200,
          bottom: 200,
          left: 200,
          right: 200,
        },
      },
    }),
  ];
};
