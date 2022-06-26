import { createError } from 'h3';
import { filetypemime } from 'magic-bytes.js';

import { useSupabase } from '~~/composables/supabase';
import { useTerworking } from '~~/composables/terworking';
import type { definitions } from '~~/types/database';

interface InputBody {
  name: string;
  avatar: string;
  instagram: string;
  quote: string;
}

const {
  supabase,
  key: {
    bucket,
    table: { database, databaseSlowMode: slowMode },
  },
} = useSupabase();

export default defineEventHandler(async ({ event }) => {
  const clientIp = event.context.shared.clientIp;

  await supabase // delete all 'expired' records
    .from<definitions[typeof slowMode]>(slowMode)
    .delete({ returning: 'minimal' })
    .lte('until', new Date().toISOString());

  const { data: slowmodeData } = await supabase
    .from<definitions[typeof slowMode]>(slowMode)
    .select()
    .eq('ipAddress', clientIp);

  if (slowmodeData?.length !== undefined && slowmodeData.length > 0) {
    const data = slowmodeData[0];

    const now = new Date();
    const until = new Date(data.until);
    if (now < until) {
      const secondsDifference = Math.floor(
        (until.valueOf() - now.valueOf()) / 1000
      );

      throw createError({
        statusCode: 429,
        message: `please wait "${secondsDifference} seconds" before submitting again.`,
      });
    }
  }

  const {
    avatar: avatarBase64,
    name,
    instagram: instagram_,
    quote,
  } = await useBody<InputBody>(event);

  const { member } = useTerworking();
  if (!member.map(({ name }) => name).includes(name)) {
    throw createError({
      statusCode: 400,
      message: `failed to submit data, name "${name}" is invalid.`,
    });
  }

  const { data: existingDataWithSameName } = await supabase
    .from<definitions[typeof database]>(database)
    .select('name')
    .eq('name', name);

  if (existingDataWithSameName?.length !== 0) {
    throw createError({
      statusCode: 400,
      message: `failed to submit data, data with name "${name}" already exist.`,
    });
  }

  const instagram =
    (instagram_ as string | undefined) !== undefined
      ? `https://instagram/${instagram_}`
      : undefined;
  const { data } = await supabase
    .from<definitions[typeof database]>(database)
    .insert({ instagram, name, quote });

  // avatar names are automatically generated using Supabase `uuid_generate_v4()`
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const avatar = data!.pop()!.avatar;
  const avatarBuffer = Buffer.from(avatarBase64, 'base64');
  const mimetypes = filetypemime([...avatarBuffer]);

  await supabase.storage
    .from(bucket.avatar)
    .upload(avatar, avatarBuffer, { contentType: mimetypes.shift() });

  // stop them from submitting for an hour
  const until = new Date(Date.now() + 1000 * 60 * 60);
  await supabase.from<definitions[typeof slowMode]>(slowMode).insert(
    {
      ipAddress: clientIp,
      until: until.toISOString(),
    },
    { returning: 'minimal' }
  );

  return 'OK';
});
