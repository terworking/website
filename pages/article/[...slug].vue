<script setup lang="ts">
import type { Article, Navigation } from '~~/typings/content';

definePageMeta({ name: 'Article' });

const { data: navigation, pending: navigationPending } = await useLazyAsyncData(
  'article-navigation',
  () => fetchContentNavigation() as Promise<Navigation[]>
);

const { path } = useRoute();
const articlePending = ref(true);
const article = computedAsync(
  async () => {
    if (navigationPending.value) return;

    const maybeArticle = useState<Article | undefined>(
      `article-content-${path}`
    );
    if (maybeArticle.value !== undefined) return maybeArticle.value;

    const candidate = flattenContentNavigation(navigation.value).find(
      ({ _path }, _, array) =>
        _path === path &&
        !array.some(
          ({ _path, description }) =>
            _path === path && description === undefined
        )
    );

    if (candidate !== undefined) {
      maybeArticle.value = await queryContent<Article>(path)
        .where({ _path: path })
        .findOne();

      return maybeArticle.value;
    }
  },
  undefined,
  articlePending
);
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <Article v-if="article" :value="article" :navigation="navigation" />
    <PlaceholderArticleListings v-else-if="navigationPending" />
    <PlaceholderArticle v-else-if="articlePending" />
    <ArticleListings v-else :value="navigation" />
  </div>
</template>
