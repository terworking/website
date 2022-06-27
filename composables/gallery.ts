import type { GalleryData } from '~~/types/gallery';

export const calculateThumbnailSize = (
  data: Pick<GalleryData, 'height' | 'width'>
) => {
  const { height, width } = data;
  const thumbnailSize = useRuntimeConfig().public.galleryThumbnailSize;
  const [thumbnailHeight, thumbnailWidth] =
    height > width
      ? [thumbnailSize, width / (height / thumbnailSize)]
      : [height / (width / thumbnailSize), thumbnailSize];

  return { height: thumbnailHeight, width: thumbnailWidth };
};
