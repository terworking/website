import { sortBy } from 'lodash-es';

import { useSupabase } from '~~/composables/supabase';
import { definitions } from '~~/typings/database';

const {
  supabase,
  key: {
    table: { database },
  },
} = useSupabase();

const getAvatarUrl = (id?: string) => {
  if (id !== undefined)
    return supabase.storage.from('avatar').getPublicUrl(id).publicURL;
};

const getInstagramUrl = (username?: string) => {
  if (username ?? '') return `https://instagram.com/${username}`;
};

export default defineEventHandler(async ({ event }) => {
  const { name, pick } = useQuery(event);

  let supabaseQuery = supabase
    .from<definitions[typeof database]>(database)
    .select('name,avatar,instagram,quote');

  if (typeof pick === 'string')
    supabaseQuery = supabaseQuery.select(`name,${pick}`);
  if (typeof name === 'string') supabaseQuery = supabaseQuery.eq('name', name);

  try {
    const { data } = await supabaseQuery;

    const result = data?.map(({ avatar, instagram, ...rest }) => ({
      // Replace avatar id with its public url
      avatar: getAvatarUrl(avatar),
      // Do the same to instagram
      instagram: getInstagramUrl(instagram),
      ...rest,
    }));

    return sortBy(result, ({ name }) => name);
  } catch (error) {
    return JSON.stringify(error);
  }
});
