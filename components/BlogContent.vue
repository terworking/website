<script setup lang="ts">
import type { Article } from '~~/typings/content';

const properties = defineProps<{ value: Article }>();
const { value } = toRefs(properties);

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
    <AppGraphcomment my-4 />
  </div>
</template>
