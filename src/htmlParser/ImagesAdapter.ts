import axios from 'axios';
import { Node } from 'himalaya';
import { ImageMap } from '../options';
import { getAttributeMap } from './utils';

export class ImagesAdapter {
  private imagesMap: ImageMap = {};

  async downloadImages(root: Node[]) {
    for (const child of root) {
      if (child.type !== 'element') {
        continue;
      }

      if (child.tagName === 'img') {
        const imageAttr = getAttributeMap(child.attributes);

        await this.addImageToMap(imageAttr['src']);
      }

      if (child.children.length) {
        await this.downloadImages(child.children);
      }
    }
    return this.imagesMap;
  }

  private async addImageToMap(url: string) {
    if (!this.imagesMap[url]) {
      this.imagesMap[url] = await this.downloadImage(url);
    }
  }

  private async downloadImage(url: string): Promise<Buffer> {
    return axios.get(url, { responseType: 'arraybuffer' }).then(response => Buffer.from(response.data, 'binary'));
  }
}
