<script setup lang="ts">
import type { Article } from '~~/typings/content';

definePageMeta({ hidden: true });

const { path } = useRoute();
const { data: content } = await useAsyncData(`content-${path}`, async () => {
  let query = queryContent<Article>(path);
  if (path !== '/blog') query = query.where({ _path: path });

  return query.find();
});
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <BlogNavigation v-if="content.length > 1" v-slot="articles: Article[]" card>
      <div
        v-for="{ _path, image, title, description } of articles"
        :key="_path"
        card
        m-4
      >
        <NuxtLink v-if="image" :to="_path">
          <img
            :src="image"
            :alt="title"
            object-cover
            h-12rem
            w-full
            rounded-t-lg
          />
        </NuxtLink>
        <div p-6>
          <NuxtLink :to="_path" text-2xl font-semibold>{{ title }}</NuxtLink>
          <p class="line-clamp">
            {{ description }}
          </p>
        </div>
      </div>
    </BlogNavigation>
    <div v-else card>
      <img
        v-if="content[0].image"
        :src="content[0].image"
        :alt="content[0].title"
        object-cover
        h-16rem
        w-full
        shadow-lg
        rounded-t-lg
      />
      <ContentRenderer
        :value="content[0]"
        p="x-6 b-6"
        prose="~ gray dark:invert"
      />
    </div>
  </div>
</template>

<style scoped>
.line-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
