import { imageSize } from 'image-size';
import {
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  IImageOptions,
  ImageRun,
  IMediaTransformation,
  TextWrappingSide,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
  ITextWrapping,
  AlignmentType,
} from 'docx';
import { Element, Styles } from 'himalaya';
import { DocxExportOptions } from '../../options';
import { convertTwipToPixels, getAttributeMap, getPageWidth, parseStyles } from '../utils';
import { DocumentElement, DocumentElementType } from './DocumentElement';
import { TextBlock } from './TextBlock';

enum ImageOrientation {
  Horizontal = 1,
  MirrorHorizontal = 2,
  Rotate180 = 3,
  MirrorVertical = 4,
  MirrorHorizontalAndRotate270 = 5,
  Rotate90 = 6,
  MirrorHorizontalAndRotate90 = 7,
  Rotate270 = 8,
}

export class Image implements DocumentElement {
  type: DocumentElementType = 'image';
  public options: IImageOptions;
  public isFloating: boolean;

  private readonly style: Styles;

  constructor(private imageFigure: Element, private exportOptions: DocxExportOptions) {
    const image = imageFigure.children.find(item => item.type === 'element' && item.tagName === 'img') as Element;
    const imageAttr = getAttributeMap(image.attributes);
    const imageSourceUrl = imageAttr['src'];

    this.style = parseStyles(imageAttr['style']);

    this.isFloating = this.style['float'] === 'left' || this.style['float'] === 'right';

    if (!exportOptions.images) {
      throw new Error('Cannot handle image insertion');
    }

    const imageBuffer = exportOptions.images[imageSourceUrl];
    this.options = this.createOptions(imageBuffer);
  }

  private createOptions(imageBuffer: Buffer) {
    return {
      data: imageBuffer,
      transformation: this.getImageSize(imageBuffer),
      floating: this.floating,
    };
  }

  private get floating() {
    if (this.isFloating) {
      return {
        horizontalPosition: {
          relative: HorizontalPositionRelativeFrom.COLUMN,
          align: this.getHorizontalPositionAlign(),
        },
        verticalPosition: {
          relative: VerticalPositionRelativeFrom.PARAGRAPH,
          align: VerticalPositionAlign.BOTTOM,
        },
        wrap: this.getWrapping(),
        margins: this.margins,
      };
    }

    return undefined;
  }

  private getHorizontalPositionAlign(): HorizontalPositionAlign {
    if (this.style['float'] === 'left') {
      return HorizontalPositionAlign.LEFT;
    }

    if (this.style['float'] === 'right') {
      return HorizontalPositionAlign.RIGHT;
    }

    return HorizontalPositionAlign.CENTER;
  }

  private getImageSize(image: Buffer): IMediaTransformation {
    const pageWidth = getPageWidth(this.exportOptions);
    const pageWidthPixels = convertTwipToPixels(pageWidth);
    const imageDimensions = imageSize(image);

    const originWidth = imageDimensions.width || 0;
    const originHeight = imageDimensions.height || 0;
    const imageRotation = this.getImageRotation(imageDimensions.orientation);

    const imageWidth = this.style['width']?.trim();
    if (imageWidth) {
      const isPercentWidth = imageWidth.endsWith('%');
      const isPixelsWidth = imageWidth.endsWith('px');
      const isVwWidth = imageWidth.endsWith('vw');

      if (isPercentWidth || isVwWidth) {
        const widthPercent = parseFloat(imageWidth.slice(0, -1));
        const widthPixels = (pageWidthPixels * widthPercent) / 100;
        const resizeRatio = widthPixels / originWidth;

        return {
          width: widthPixels,
          height: originHeight * resizeRatio,
          ...imageRotation,
        };
      }

      if (isPixelsWidth) {
        const widthNumber = parseFloat(imageWidth.slice(0, -1));
        const widthPixels = widthNumber >= pageWidth ? pageWidth : widthNumber;
        const resizeRatio = widthPixels / originWidth;

        return {
          width: widthPixels,
          height: originHeight * resizeRatio,
          ...imageRotation,
        };
      }
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
  }

  public getImageRotation(orientation?: ImageOrientation): Partial<IMediaTransformation> {
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
  }

  private get margins() {
    const MARGIN_VALUE = 181142; // ~0.5sm. Calculated by trial and error.
    if (this.style.float === 'left') {
      return {
        top: 0,
        bottom: MARGIN_VALUE,
        left: 0,
        right: MARGIN_VALUE,
      };
    }
    if (this.style.float === 'right') {
      return {
        top: 0,
        bottom: MARGIN_VALUE,
        left: MARGIN_VALUE,
        right: 0,
      };
    }
  }

  private getWrapping(): ITextWrapping {
    if (this.style.float === 'left') {
      return {
        type: TextWrappingType.SQUARE,
        side: TextWrappingSide.RIGHT,
      };
    }

    if (this.style.float === 'right') {
      return {
        type: TextWrappingType.SQUARE,
        side: TextWrappingSide.LEFT,
      };
    }

    throw new Error('Image does not have a float style property');
  }

  getContent() {
    return [this];
  }

  transformToDocx() {
    return [new ImageRun(this.options)];
  }

  static getStaticImageElement(image: Image) {
    return new TextBlock({ alignment: AlignmentType.CENTER, spacing: { before: 280, after: 280 } }, [image]);
  }
}
