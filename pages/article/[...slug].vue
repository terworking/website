<script setup lang="ts">
import type { Article, FlatNavigation, Navigation } from '~~/types/content';

definePageMeta({ name: 'Article' });

const { data: navigation, pending: navigationPending } = await useLazyAsyncData(
  'article-navigation',
  () => fetchContentNavigation() as Promise<Navigation[]>,
  {
    transform: (data): FlatNavigation[] => {
      // https://stackoverflow.com/a/54245371
      const transform1 = ({ children = [], ...rest }: Navigation) => [
        { ...rest },
        ...transformAll(children),
      ];

      // https://stackoverflow.com/a/54245371
      const transformAll = (children: Navigation[] = []): FlatNavigation[] =>
        children.flatMap((c) => transform1(c));

      return transformAll(data).map(({ _path, ...rest }) => ({
        // prefix the path with /article
        _path: `/article${_path}`,
        ...rest,
      }));
    },
  }
);

const { path } = useRoute();
const articlePending = ref(true);
const article = computedAsync(
  async () => {
    if (navigationPending.value) return;

    const articles = useState(
      `article-content`,
      () => ({} as Record<string, Article>)
    );
    if (path in articles.value) return articles.value[path];

    const candidate = navigation.value.find(
      ({ _path }, _, array) =>
        _path === path &&
        !array.some(
          ({ _path, description }) =>
            _path === path && description === undefined
        )
    );

    if (candidate !== undefined) {
      const { _path, ...rest } = await queryContent<Article>(
        // remove the `/article` prefix because we're re-fetching
        candidate._path.replace('/article', '')
      ).findOne(); // add `/article` prefix back
      articles.value[path] = { _path: `/article${_path ?? ''}`, ...rest };

      return articles.value[path];
    }
  },
  undefined,
  articlePending
);
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <Article v-if="article" :value="article" :navigation="navigation" />
    <PlaceholderArticle v-else-if="articlePending" />
    <PlaceholderArticleListings v-else-if="navigationPending" />
    <ArticleListings v-else :value="navigation" />
  </div>
</template>
