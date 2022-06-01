/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from '@supabase/supabase-js';

const useSupabaseClient = () => {
  const url = process.env.SUPABASE_URL!;
  return process.client
    ? createClient(url, process.env.SUPABASE_KEY!)
    : createClient(url, process.env.SUPABASE_SUPER_KEY!, {
        shouldThrowOnError: true,
      });
};

export const useSupabase = () => ({
  key: {
    bucket: { avatar: 'avatar' as const, gallery: 'gallery' as const },
    table: {
      database: 'database' as const,
      databaseSlowMode: 'database-slowmode' as const,
    },
  },
  supabase: useSupabaseClient(),
});
