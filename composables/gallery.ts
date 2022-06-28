import type { GalleryData } from '~~/types/gallery';

export const getThumbnail = (
  data: GalleryData,
  size = useRuntimeConfig().public.galleryThumbnailSize
) => {
  const { height, width, path } = data;

  const thumbnailSize = Math.min(Math.max(height, width), size);
  const [thumbnailHeight, thumbnailWidth] =
    height > width
      ? [thumbnailSize, width / (height / thumbnailSize)]
      : [height / (width / thumbnailSize), thumbnailSize];

  const searchParameters = new URLSearchParams();
  searchParameters.append('thumbnail', thumbnailSize.toString());

  return {
    path: `${path}?${searchParameters.toString()}`,
    height: thumbnailHeight,
    width: thumbnailWidth,
  };
};
