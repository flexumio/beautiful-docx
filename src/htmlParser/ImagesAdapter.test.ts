import axios from 'axios';
import { parse } from 'himalaya';
import { ImagesAdapter } from './ImagesAdapter';

const imageSourceUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png';

describe('ImageAdapter', () => {
  test('should add image to imageMap', async () => {
    const html = `<img src="${imageSourceUrl}"/>`;
    const elements = parse(html);
    const buffer = await axios
      .get(imageSourceUrl, { responseType: 'arraybuffer' })
      .then(response => Buffer.from(response.data, 'binary'));

    const expectedMap = { [imageSourceUrl]: buffer };

    const instance = new ImagesAdapter();
    const map = await instance.downloadImages(elements);

    expect(map).toStrictEqual(expectedMap);
  });

  test('should not download preloaded images', async () => {
    const html = `<img src="${imageSourceUrl}"/>`;
    const elements = parse(html);
    const buffer = await axios
      .get(imageSourceUrl, { responseType: 'arraybuffer' })
      .then(response => Buffer.from(response.data, 'binary'));

    const preloadedImages = { [imageSourceUrl]: buffer };

    const instance = new ImagesAdapter(preloadedImages);
    const fn = jest.spyOn(instance, 'downloadImage');

    const map = await instance.downloadImages(elements);

    expect(fn).not.toBeCalled();
    expect(map).toStrictEqual(preloadedImages);
  });
});
