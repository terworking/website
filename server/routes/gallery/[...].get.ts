import { useGDrive } from '~~/composables/gdrive';
import { useImageProxy } from '~~/composables/utils';

const gdrive = useGDrive();

export default defineEventHandler(async ({ event }) => {
  const { _: path } = event.context.params as Record<string, string>;

  const data = await gdrive.list(path);
  const item = data
    .filter(({ imageMediaMetadata }) => imageMediaMetadata !== undefined)
    .find(({ path: path_ }) => path_ === path);

  if (item === undefined) return;

  const { url, imageMediaMetadata } = item;

  const filename = (new URL(url).pathname.split('/').pop() ?? '')
    .replace(/[^\w.]/g, '') // remove all non-alphanumeric characters
    .replace(/\..*/, ''); // remove file extension

  const proxyImage = async (url: string) => {
    const response = await fetch(url);
    for (const [key, value] of response.headers.entries()) {
      appendHeader(event, key, value);
    }

    return response.body;
  };

  const { thumbnail } = useQuery(event);
  if (thumbnail !== undefined) {
    const thumbnail_ = Number.parseInt(thumbnail.toString());
    const thumbnailSize = Number.isNaN(thumbnail_)
      ? useRuntimeConfig().public.galleryThumbnailSize
      : thumbnail_;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { height, width } = imageMediaMetadata!;

    const thumbnailParameter: Record<string, number> = {};
    if (thumbnailSize > 0) {
      // lower the longest one's pixel to thumbnail size
      thumbnailParameter[height > width ? 'h' : 'w'] = thumbnailSize;
    }

    const thumbnailUrl = useImageProxy({
      filename,
      url,
      output: 'webp',
      q: 80,
      ...thumbnailParameter,
    });

    return proxyImage(thumbnailUrl);
  } else {
    const downloadUrl = useImageProxy({
      filename,
      url,
    });

    return proxyImage(downloadUrl);
  }
});
