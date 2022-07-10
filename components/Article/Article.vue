<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Article, FlatNavigation } from '~~/types/content';

const properties = defineProps<{
  value: Article;
  navigation: FlatNavigation[];
}>();

const date = computed(() => {
  const time = new Date(properties.value.created ?? '');
  if (time.toString() === 'Invalid Date') return;

  const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: '2-digit',
    weekday: 'long',
    year: 'numeric',
  });

  return dateTimeFormat.format(time);
});

const currentDirectory = computed(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  () => properties.value._path!.split('/').slice(0, -1).join('/')
);

const navigation = computed(() =>
  properties.navigation.filter(
    ({ _path, description }) =>
      description !== undefined &&
      _path.startsWith(currentDirectory.value) &&
      _path.split('/').length === properties.value._path?.split('/').length
  )
);

const index = computed(() =>
  navigation.value.findIndex(({ _path }) => _path === properties.value._path)
);

const title = computed(() => useTitleTemplate(properties.value.title));
const description = computed(() => properties.value.description);
const image = computed(() => properties.value.image);
useHead(useSeoHead({ description, image, title }));
useHead(useSeoArticleHead(properties.value));

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
    <ArticleNavigation
      v-if="navigation.length > 1"
      :index="index"
      :navigation="navigation"
    />
    <AppGraphcomment :disabled="value.comment === false" my-4 />
  </div>
</template>
