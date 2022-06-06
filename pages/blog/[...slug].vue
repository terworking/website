<script setup lang="ts">
import type { Article } from '~~/typings/content';

definePageMeta({ hidden: true });

const route = useRoute();
const { data } = await useAsyncData(`content-${route.path}`, () =>
  queryContent<Article>(route.path).find()
);

const content = computed(() => {
  if (data.value.length === 1 && data.value[0]._path === route.path)
    return data.value[0];
});
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <BlogContent v-if="content" :value="content" />
    <BlogNavigation v-else />
  </div>
</template>
