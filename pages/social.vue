<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import IconGithub from '@iconify-icons/tabler/brand-github';
import IconInstagram from '@iconify-icons/tabler/brand-instagram';
import IconYoutube from '@iconify-icons/tabler/brand-youtube';

definePageMeta({
  title: 'Social Media',
});

const { data: invidious, pending: invidiousPending } = useLazyFetch(
  '/api/social/invidious'
);

// const { data: instagramData } = useFetch<any>(
//   'https://www.instagram.com/graphql/query/?query_hash=e7e2f4da4b02303f74f0841279e52d76&id=30336218608&first=5'
// );

const navigation = useNavigation();
</script>

<template>
  <div class="my-5 p-5 gap-6 grid md:max-w-xl md:mx-auto md:px-10">
    <h1 class="text-4xl md:text-5xl text-center mb-4 mx-auto">Social Media</h1>
    <div
      class="grid divide-y divide-opacity-10 divide-slate-800/15 dark:divide-white/15 border-1 rounded-lg border-opacity-10 border-slate-800/15 dark:border-white/15"
    >
      <!-- <div class="flex flex-col p-3">
        <NuxtLink to="/social/instagram">
          <div class="flex items-center justify-center font-bold">
            <Icon :icon="IconInstagram" class="text-3xl" />
            <span class="ml-1 text-lg">Instagram</span>
          </div>
        </NuxtLink>
        <div
          class="flex overflow-x-auto space-x-4 border border-black py-3 px-2 mt-3"
        >
          <template
            v-for="instagramPost of instagramData.data.user
              .edge_owner_to_timeline_media.edges"
          >
            <div
              class="flex-shrink-0 w-1/2 bg-fuchsia-50 rounded-lg p-2 border-1 border-black"
            >
              <img :src="instagramPost.node.display_url" alt="ig" srcset="" />
            </div>
          </template>
        </div>
      </div> -->
      <div class="flex flex-col p-3">
        <NuxtLink to="/social/youtube">
          <div class="flex items-center justify-center font-bold">
            <Icon :icon="IconYoutube" class="text-3xl" />
            <span class="ml-1 text-lg">Youtube</span>
          </div>
        </NuxtLink>
        <div class="flex overflow-x-auto w-80 space-x-4 mt-3 mx-auto">
          <template v-if="!invidiousPending">
            <template v-for="{ videoId } of invidious.data">
              <div
                class="flex-shrink-0 rounded-lg p-2 border-1 border-slate-800/15 dark:border-white/15"
              >
                <InvidiousEmbed
                  :instance="invidious.instance"
                  :videoId="videoId"
                />
              </div>
            </template>
          </template>
          <template v-else> <div>LOADING</div> </template>
          <!-- <template v-for="{ videoId } of youtubeData">
            <div
              class="flex-shrink-0 bg-fuchsia-50 rounded-lg p-2 border-1 border-black"
            >
              <InvidiousEmbed :video-id="videoId" />
            </div>
          </template> -->
        </div>
      </div>
      <template v-for="nav of navigation">
        <NuxtLink :to="nav.path">
          <div class="p-3 font-bold text-lg">
            {{ nav.name }}
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
