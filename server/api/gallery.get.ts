import { shuffle } from 'lodash-es';

import { useGDrive } from '~~/composables/gdrive';
import { GalleryData } from '~~/typings/gallery';

const gdrive = useGDrive();

export default defineEventHandler(async () => {
  const data = await gdrive.list('/');

  const galleryData = data
    .filter(({ imageMediaMetadata }) => imageMediaMetadata !== undefined)
    .map(({ path: path_, imageMediaMetadata }) => {
      const path = `/gallery/${path_}`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { height, width } = imageMediaMetadata!;

      const thumbnailSize = 500;
      const [thumbnailHeight, thumbnailWidth] =
        height > width
          ? [thumbnailSize, width / (height / thumbnailSize)]
          : [height / (width / thumbnailSize), thumbnailSize];

      return {
        height,
        path,
        thumbnail: {
          height: thumbnailHeight,
          path: `${path}?thumbnail=1`,
          width: thumbnailWidth,
        },
        width,
      };
    });

  return shuffle(galleryData) as GalleryData[];
});
