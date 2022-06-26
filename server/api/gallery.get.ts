import { getClientIp } from '../utils';
import { useGDrive } from '~~/composables/gdrive';
import { shuffle } from '~~/composables/random';
import { GalleryData } from '~~/types/gallery';

const gdrive = useGDrive();

export default defineEventHandler(async ({ event }) => {
  const data = await gdrive.list('/');

  const galleryData: GalleryData[] = data
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

  const query = useQuery(event);
  const count = Number.parseInt(query.count?.toString() ?? '');
  const from_ = Number.parseInt(query.from?.toString() ?? '0');
  const from = from_ < 0 || Number.isNaN(from_) ? 0 : from_;
  const until = count < 1 || Number.isNaN(count) ? undefined : count;

  const seed = getClientIp(event);
  const shuffled = shuffle(galleryData, seed);

  return shuffled.slice(from, until);
});
