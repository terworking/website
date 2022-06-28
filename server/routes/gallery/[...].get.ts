import { useGDrive } from '~~/composables/gdrive';
import { useImageProxy } from '~~/composables/utils';

const gdrive = useGDrive();

export default defineEventHandler(async ({ event }) => {
  const { _: path } = event.context.params as Record<string, string>;
  const query = useQuery(event);

  const data = await gdrive.list(path);
  const item = data
    .filter(({ imageMediaMetadata }) => imageMediaMetadata !== undefined)
    .find(({ path: path_ }) => path_ === path);

  if (item === undefined) return;

  const { url, imageMediaMetadata } = item;

  const filename = (new URL(url).pathname.split('/').pop() ?? '')
    .replace(/[^\w.]/g, '') // remove all non-alphanumeric characters
    .replace(/\..*/, ''); // remove file extension

  const { download, thumbnail } = query;
  const downloadUrl = useImageProxy({
    filename,
    url,
  });

  if (download === '1') {
    const response = await fetch(downloadUrl);
    for (const [key, value] of response.headers.entries()) {
      appendHeader(event, key, value);
    }

    return response.body;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { height, width } = imageMediaMetadata!;

  if (thumbnail !== undefined) {
    const thumbnail_ = Number.parseInt(thumbnail.toString());
    const thumbnailSize = Number.isNaN(thumbnail_)
      ? useRuntimeConfig().public.galleryThumbnailSize
      : thumbnail_;

    // lower the longest one's pixel to thumbnail size
    const thumbnailParameter: Record<string, number> = {};
    if (height > width) {
      thumbnailParameter.h = thumbnailSize;
    } else {
      thumbnailParameter.w = thumbnailSize;
    }

    const thumbnailUrl = useImageProxy({
      filename,
      url,
      output: 'webp',
      q: 80,
      ...thumbnailParameter,
    });

    return sendRedirect(event, thumbnailUrl, 301);
  } else {
    return sendRedirect(event, downloadUrl, 301);
  }
});
