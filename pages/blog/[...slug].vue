<script setup lang="ts">
import type { Article, Navigation } from '~~/typings/content';

definePageMeta({ name: 'Blog' });

const { data, pending: navigationPending } = await useLazyAsyncData<
  Navigation[]
>('blog-navigation', () => fetchContentNavigation());

const contentPending = ref(true);

const { path } = useRoute();
const content = computedAsync(
  async () => {
    if (navigationPending.value) return;

    const flatNavigation = flattenContentNavigation(data.value);
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
      return queryContent<Article>(path).findOne();
    }
  },
  undefined,
  contentPending
);

const pending = computed(() => navigationPending.value || contentPending.value);
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <PlaceholderBlogContent v-if="pending" />
    <BlogContent v-else-if="content" :value="content" />
    <BlogNavigation v-else />
  </div>
</template>
