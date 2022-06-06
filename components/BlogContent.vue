<script setup lang="ts">
import type { Article } from '~~/typings/content';

const properties = defineProps<{ value: Article }>();
</script>

<template>
  <div card>
    <AppBreadcrumbs
      bg-body
      w-full
      p="x-4 y-2"
      rounded-t-lg
      border="b light-900 dark:dark-100"
    />
    <img
      v-if="value.image"
      :src="value.image"
      :alt="value.title"
      object-cover
      h-16rem
      w-full
      shadow-lg
      border="b light-900 dark:dark-100"
    />
    <ContentRenderer :value="value" p="x-6 b-6" prose="~ gray dark:invert" />
  </div>
</template>
