import axios from 'axios';
import { parse } from 'himalaya';
import { ImagesAdapter } from './ImagesAdapter';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const imageSourceUrl = 'https://example.com/test-image.png';
const imageBuffer = fs.readFileSync(path.join(__dirname, '../../example/test-icon.png'));

describe('ImageAdapter', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: imageBuffer });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should add image to imageMap', async () => {
    const html = `<img src="${imageSourceUrl}"/>`;
    const elements = parse(html);

    const expectedMap = { [imageSourceUrl]: imageBuffer };

    const instance = new ImagesAdapter();
    const map = await instance.downloadImages(elements);

    expect(mockedAxios.get).toHaveBeenCalledWith(imageSourceUrl, { responseType: 'arraybuffer' });
    expect(map).toStrictEqual(expectedMap);
  });

  test('should not download preloaded images', async () => {
    const html = `<img src="${imageSourceUrl}"/>`;
    const elements = parse(html);

    const preloadedImages = { [imageSourceUrl]: imageBuffer };

    const instance = new ImagesAdapter(preloadedImages);
    const fn = jest.spyOn(instance, 'downloadImage');

    const map = await instance.downloadImages(elements);

    expect(fn).not.toBeCalled();
    expect(map).toStrictEqual(preloadedImages);
  });
});
