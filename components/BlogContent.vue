<script setup lang="ts">
import type { Article } from '~~/typings/content';

const properties = defineProps<{ value: Article }>();
</script>

<template>
  <div card>
    <img
      v-if="value.image"
      :src="value.image"
      :alt="value.title"
      object-cover
      h-16rem
      w-full
      shadow-lg
      rounded-t-lg
    />
    <ContentRenderer :value="value" p="x-6 b-6" prose="~ gray dark:invert" />
  </div>
</template>
