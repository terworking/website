<script setup lang="ts">
import type { Article, Navigation } from '~~/typings/content';

const properties = defineProps<{ value: Article; navigation: Navigation[] }>();
const { value, navigation: navigationRaw } = toRefs(properties);

const currentDirectory = computed(
  () => value.value._path?.split('/').slice(0, -1).join('/') ?? '/blog'
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

useHead({ title });
</script>

<template>
  <div>
    <AppBreadcrumbs p="x-4 y-2" />
    <div card>
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
      <ContentRenderer :value="value" p="x-6 b-6" prose="~ gray dark:invert" />
    </div>
    <BlogContentNavigation :previous="previous" :next="next" />
    <AppGraphcomment :disabled="value.comment === false" my-4 />
  </div>
</template>
