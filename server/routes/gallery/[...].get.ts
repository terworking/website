import { useSupabase } from '~~/composables/supabase';

const {
  supabase,
  key: { bucket },
} = useSupabase();

export default defineEventHandler(({ event }) => {
  const { _: path } = event.context.params as Record<string, string>;

  const { publicURL } = supabase.storage
    .from(bucket.gallery)
    .getPublicUrl(path);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return sendRedirect(event, publicURL!);
});
