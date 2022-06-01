import { useGDrive } from '~~/composables/gdrive';
import { useImageProxy } from '~~/composables/utils';

const gdrive = useGDrive();

export default defineEventHandler(async ({ event }) => {
  const { _: path } = event.context.params as Record<string, string>;
  const { download, thumbnail } = useQuery(event);

  const data = await gdrive.list(path);
  const item = data
    .filter(({ imageMediaMetadata }) => imageMediaMetadata !== undefined)
    .find(({ path: path_ }) => path_ === path);

  if (item === undefined) return;

  const { url, imageMediaMetadata } = item;

  const filename = (new URL(url).pathname.split('/').pop() ?? '')
    .replace(/[^\w.]/g, '') // remove all non-alphanumeric characters
    .replace(/\..*/, ''); // remove file extension

  const downloadUrl = useImageProxy({
    filename,
    url,
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { height, width } = imageMediaMetadata!;

  // lower the longest one's pixel to 500px
  const thumbnailParameter: Record<string, string> = {};
  if (height > width) {
    thumbnailParameter.h = '500';
  } else {
    thumbnailParameter.w = '500';
  }

  const thumbnailUrl = useImageProxy({
    filename,
    url,
    output: 'webp',
    q: '75',
    ...thumbnailParameter,
  });

  if (download === '1') {
    const response = await fetch(downloadUrl);
    for (const [key, value] of response.headers.entries()) {
      appendHeader(event, key, value);
    }

    return response.body;
  } else {
    return sendRedirect(
      event,
      thumbnail === '1' ? thumbnailUrl : downloadUrl,
      301
    );
  }
});
