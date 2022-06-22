<script setup lang="ts">
import type { FlatNavigation } from '~~/types/content';

const properties = defineProps<{
  previous?: FlatNavigation;
  next?: FlatNavigation;
}>();
</script>

<template>
  <div
    my-4
    flex="~ col md:row"
    justify-between
    md:space-x-2
    font-medium
    select-none
  >
    <div v-if="previous" flex justify-start mr-auto w="full md:1/2">
      <NuxtLink
        :to="previous._path"
        inline-flex
        items-center
        justify-end
        min-w="1/2"
        w="full md:auto"
        border="~ rounded-sm card opacity-60 dark:opacity-60 hover:opacity-100"
        p-4
        mb="2 md:0"
        truncate
      >
        <span flex relative items-center justify-start truncate>
          <div i-ci-short-left flex-shrink-0 m-0 w-6 h-6></div>
          <span truncate ml-2>{{ previous?.title }}</span>
        </span>
      </NuxtLink>
    </div>
    <div
      v-if="next"
      flex
      justify-end
      ml-auto
      order="first md:last"
      w="full md:1/2"
    >
      <NuxtLink
        :to="next._path"
        inline-flex
        items-center
        justify-start
        min-w="1/2"
        w="full md:auto"
        border="~ rounded-sm card opacity-60 dark:opacity-60 hover:opacity-100"
        p-4
        mb="2 md:0"
        truncate
      >
        <span flex relative items-center justify-start truncate>
          <span truncate mr-2>{{ next?.title }}</span>
          <div i-ci-short-right flex-shrink-0 m-0 w-6 h-6></div>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
