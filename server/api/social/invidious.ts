interface InvidiousInstance {
  0: string;
  1: { cors?: boolean; type: string; uri: string };
}

interface InvidiousVideo {
  videoId: string;
}

export default async () => {
  const httpsInvidiousInstances = (
    await $fetch<InvidiousInstance[]>(
      'https://api.invidious.io/instances.json?sort_by=type,users'
    )
  )
    .filter((item) => item[1].type === 'https' && item[1].cors)
    .map((item) => item[0]);

  const instance =
    httpsInvidiousInstances[
      Math.floor(Math.random() * httpsInvidiousInstances.length)
    ];

  const data = (
    await $fetch<InvidiousVideo[]>(
      `https://${instance}/api/v1/channels/UCdEROl_OTXNyZkYx5rn3AGQ/videos?fields=videoId`
    )
  ).slice(0, 8);

  return { instance, data };
};
