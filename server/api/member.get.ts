import { useSupabase } from '~~/composables/supabase';
import { definitions } from '~~/typings/database';

const {
  supabase,
  key: {
    table: { database },
  },
} = useSupabase();

const getAvatarUrl = (id: string) => {
  return supabase.storage.from('avatar').getPublicUrl(id).publicURL;
};

export default defineEventHandler(async () => {
  const { data } = await supabase
    .from<definitions[typeof database]>(database)
    .select('name,avatar,instagram,quote');

  const result =
    data?.map(({ avatar, ...rest }) => ({
      // Replace avatar id with its public url
      avatar: getAvatarUrl(avatar),
      ...rest,
    })) ?? [];

  return [...result].sort((a, b) => a.name.localeCompare(b.name));
});
