import { shuffle } from 'lodash-es';

import { useSupabase } from '~~/composables/supabase';

const {
  supabase,
  key: { bucket },
} = useSupabase();

type GalleryFolderName = 'landscape' | 'portrait';

export default defineEventHandler(() => {
  const galleryFolders: GalleryFolderName[] = ['landscape', 'portrait'];

  return Promise.all(
    galleryFolders.map(async (folderName) => {
      const { data } = await supabase.storage
        .from(bucket.gallery)
        .list(folderName);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const imagePaths = data!.map(
        ({ name }) => `/gallery/${folderName}/${name}`
      );

      return [folderName, shuffle(imagePaths)];
    })
  ).then((it) => Object.fromEntries(it)) as Promise<
    Record<GalleryFolderName, string[]>
  >;
});
