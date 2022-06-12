<script setup lang="ts">
import type { Article, Navigation } from '~~/typings/content';

definePageMeta({ name: 'Blog' });

const { data: navigation, pending: navigationPending } = await useLazyAsyncData(
  'blog-navigation',
  () => fetchContentNavigation() as Promise<Navigation[]>
);

const { path } = useRoute();
const contentPending = ref(true);
const content = computedAsync(
  async () => {
    if (navigationPending.value) return;

    const maybeContent = useState<Article | undefined>(`blog-content-${path}`);
    if (maybeContent.value !== undefined) return maybeContent.value;

    const candidate = flattenContentNavigation(navigation.value).find(
      ({ _path }, _, array) =>
        _path === path &&
        !array.some(
          ({ _path, description }) =>
            _path === path && description === undefined
        )
    );

    if (candidate !== undefined) {
      maybeContent.value = await queryContent<Article>(path)
        .where({ _path: path })
        .findOne();

      return maybeContent.value;
    }
  },
  undefined,
  contentPending
);
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <BlogContent v-if="content" :value="content" :navigation="navigation" />
    <PlaceholderBlogNavigation v-else-if="navigationPending" />
    <PlaceholderBlogContent v-else-if="contentPending" />
    <BlogNavigation v-else :value="navigation" />
  </div>
</template>
