import axios from 'axios';
import { Node } from 'himalaya';
import { ImageMap } from '../options';
import { getAttributeMap } from './utils';

export class ImagesAdapter {
  private readonly imagesMap: ImageMap = {};
  private imagesUrls: string[] = [];

  constructor(currentImages?: ImageMap) {
    if (currentImages) {
      this.imagesMap = currentImages;
    }
  }

  async downloadImages(root: Node[]) {
    this.parseImagesUrls(root);

    // TODO: configure downloading in pack with 5-10 images
    await Promise.all(this.imagesUrls.map(i => this.addImageToMap(i)));

    return this.imagesMap;
  }

  private parseImagesUrls(root: Node[]) {
    for (const child of root) {
      if (child.type !== 'element') {
        continue;
      }

      if (child.tagName === 'img') {
        const imageAttr = getAttributeMap(child.attributes);

        this.imagesUrls.push(imageAttr['src']);
      }

      if (child.children.length) {
        this.parseImagesUrls(child.children);
      }
    }
  }

  private async addImageToMap(url: string) {
    if (!this.imagesMap[url]) {
      this.imagesMap[url] = await this.downloadImage(url);
    }
  }

  async downloadImage(url: string): Promise<Buffer> {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data, 'binary');
  }
}
