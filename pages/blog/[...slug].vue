<script setup lang="ts">
import type { Article, Navigation } from '~~/typings/content';

definePageMeta({ name: 'Blog' });

const { data: navigation, pending: navigationPending } = await useLazyAsyncData(
  'blog-navigation',
  () => fetchContentNavigation() as Promise<Navigation[]>
);

const contentPending = ref(true);

const { path } = useRoute();
const content = computedAsync(
  async () => {
    if (navigationPending.value) return;

    const flatNavigation = flattenContentNavigation(navigation.value);
    const candidate = flatNavigation.find(
      ({ _path }, _, array) =>
        _path === path &&
        !array.some(
          ({ _path, description }) =>
            _path === path && description === undefined
        )
    );
    if (candidate !== undefined) {
      contentPending.value = true;
      return queryContent<Article>(path).where({ _path: path }).findOne();
    }
  },
  undefined,
  contentPending
);
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <PlaceholderBlogNavigation v-if="navigationPending" />
    <PlaceholderBlogContent v-else-if="contentPending" />
    <BlogContent v-else-if="content" :value="content" />
    <BlogNavigation v-else :value="navigation" />
  </div>
</template>
