import { shuffle } from 'lodash-es';

import { useGDrive } from '~~/composables/gdrive';
import { GalleryData, GalleryFolderName } from '~~/typings/gallery';

const gdrive = useGDrive();

export default defineEventHandler(() => {
  const galleryFolders: GalleryFolderName[] = ['landscape', 'portrait'];

  return Promise.all(
    galleryFolders.map(async (folderName) => {
      const data = await gdrive.list(folderName);

      const galleryData = data
        .filter(({ imageMediaMetadata }) => imageMediaMetadata !== undefined)
        .map(({ path, imageMediaMetadata }) => {
          const serverPath = `/gallery/${path}`;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { height, width } = imageMediaMetadata!;

          return {
            path: serverPath,
            height,
            width,
          };
        });

      return [folderName, shuffle(galleryData)];
    })
  ).then((it) => Object.fromEntries(it)) as Promise<
    Record<GalleryFolderName, GalleryData[]>
  >;
});
