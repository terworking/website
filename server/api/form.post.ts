import { filetypemime } from 'magic-bytes.js';
import { v4 as uuidv4 } from 'uuid';

import { useFormStatus } from '~~/composables/form';
import { useSupabase } from '~~/composables/supabase';
import { useTerworking } from '~~/composables/terworking';
import { definitions } from '~~/typings/database';
import { Form } from '~~/typings/form';

const {
  supabase,
  key: {
    bucket,
    table: { database, databaseSlowMode: slowMode },
  },
} = useSupabase();
const form = useFormStatus();

export default defineEventHandler(async ({ event }) => {
  if (!form.isOpen) {
    return 'form is closed';
  }

  const clientIp =
    process.env.NODE_ENV === 'development'
      ? '127.0.0.1'
      : (event.req.headers['x-nf-client-connection-ip'] as string);

  if (form.isOnSlowMode) {
    await supabase // delete all 'expired' records
      .from<definitions[typeof slowMode]>(slowMode)
      .delete({ returning: 'minimal' })
      .lte('until', new Date().toISOString());

    const { data: slowmodeData } = await supabase
      .from<definitions[typeof slowMode]>(slowMode)
      .select()
      .eq('ipAddress', clientIp);

    if (slowmodeData?.length !== 0 && slowmodeData?.length !== undefined) {
      const data = slowmodeData[0];

      const now = new Date();
      const until = new Date(data.until);
      if (now.valueOf() < until.valueOf()) {
        const secondsDifference = Math.floor(
          (until.valueOf() - now.valueOf()) / 1000
        );

        return `please wait "${secondsDifference} seconds" before submitting again.`;
      }
    }
  }

  const {
    avatar: avatarBase64,
    name,
    instagram,
    quote,
  } = await useBody<Form>(event);

  const { member } = useTerworking();

  const validNames = member.map(({ name }) => name);

  if (!validNames.includes(name)) {
    return `failed to submit data, name "${name}" is invalid.`;
  }

  const { data: existingDataWithSameName } = await supabase
    .from<definitions[typeof database]>(database)
    .select('name')
    .eq('name', name);

  if (existingDataWithSameName?.length !== 0) {
    return `failed to submit data, data with name "${name}" already exist.`;
  }

  const avatar = uuidv4();
  const avatarBuffer = Buffer.from(avatarBase64, 'base64');
  const mimetypes = filetypemime([...avatarBuffer]);

  try {
    await supabase
      .from<definitions[typeof database]>(database)
      .insert({ avatar, instagram, name, quote }, { returning: 'minimal' });
    await supabase.storage
      .from(bucket.avatar)
      .upload(avatar, avatarBuffer, { contentType: mimetypes[0] });
  } catch (error) {
    return JSON.stringify(error);
  }

  if (form.isOnSlowMode) {
    // stop them from submitting for an hour
    const until = new Date(Date.now() + 1000 * 60 * 60);
    await supabase.from<definitions[typeof slowMode]>(slowMode).insert(
      {
        ipAddress: clientIp,
        until: until.toISOString(),
      },
      { returning: 'minimal' }
    );
  }

  return 'OK';
});
