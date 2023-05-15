/// <reference types="node" />
import { Node } from 'himalaya';
import { ImageMap } from '../options';
export declare class ImagesAdapter {
    private readonly imagesMap;
    private imagesUrls;
    constructor(currentImages?: ImageMap);
    downloadImages(root: Node[]): Promise<ImageMap>;
    private parseImagesUrls;
    private addImageToMap;
    downloadImage(url: string): Promise<Buffer>;
}
//# sourceMappingURL=ImagesAdapter.d.ts.map