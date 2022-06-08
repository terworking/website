<script setup lang="ts">
import type { Article } from '~~/typings/content';

definePageMeta({ name: 'Blog' });

const { path } = useRoute();
const { data, pending } = await useLazyAsyncData(`blog-${path}`, () =>
  queryContent<Article>(path).find()
);

const content = computed(() => {
  const candidate = data.value.find(({ _path }) => _path === path);
  if (candidate !== undefined) return candidate;
});
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <PlaceholderBlogContent v-if="pending" />
    <BlogContent v-else-if="content" :value="content" />
    <BlogNavigation v-else />
  </div>
</template>
