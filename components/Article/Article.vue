<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Article, Navigation } from '~~/types/content';

const properties = defineProps<{ value: Article; navigation: Navigation[] }>();
const { value, navigation: navigationRaw } = toRefs(properties);

const date = computed(() => {
  const time = new Date(value.value.created ?? '');
  if (time.toString() === 'Invalid Date') return;

  const format = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: '2-digit',
    weekday: 'long',
    year: 'numeric',
  }).format;

  return format(time);
});

const currentDirectory = computed(
  () => value.value._path?.split('/').slice(0, -1).join('/') ?? '/article'
);

const navigation = computed(() =>
  flattenContentNavigation(navigationRaw.value).filter(
    ({ _path, description }) =>
      description !== undefined &&
      _path.startsWith(currentDirectory.value) &&
      _path.split('/').length === value.value._path?.split('/').length
  )
);

const currentIndex = computed(() =>
  navigation.value.findIndex(({ _path }) => _path === value.value._path)
);

const previous = computed(() => {
  if (currentIndex.value !== 0) return navigation.value[currentIndex.value - 1];
});

const next = computed(() => {
  if (currentIndex.value !== navigation.value.length - 1)
    return navigation.value[currentIndex.value + 1];
});

const title = computed(() => useTitleTemplate(value.value.title));
const description = computed(() => value.value.description);
const image = computed(() => value.value.image);
useHead(useSeoHead({ description, image, title }));
useHead(useSeoArticleHead(value));

// @ts-expect-error nuxt type error
useHead({ meta: [{ content: 'article', property: 'og:type' }], title });
</script>

<template>
  <div>
    <AppBreadcrumbs p="x-4 y-2" />
    <div card p="x-6 b-6">
      <img
        v-if="value.image"
        :src="value.image"
        :alt="value.title"
        object-cover
        h-64
        w-full
        shadow-lg
        border="b t light-900 dark:dark-100"
        rounded-t-lg
      />
      <div
        v-if="date || value.author"
        flex
        justify-end
        items-center
        space-x-4
        py-4
        opacity-50
      >
        <div v-if="value.author" inline-flex text-lg>
          <span>~{{ value.author }}</span>
        </div>
        <div inline-flex items-center space-x-2>
          <div i-ci-calendar-event m-0 />
          <time>{{ date }}</time>
        </div>
      </div>
      <ArticleToc :value="value.body.toc" :class="{ 'mt-4': !date }" />
      <ContentRenderer :value="value" prose="~ gray dark:invert" />
    </div>
    <ArticleNavigation :previous="previous" :next="next" />
    <AppGraphcomment :disabled="value.comment === false" my-4 />
  </div>
</template>
