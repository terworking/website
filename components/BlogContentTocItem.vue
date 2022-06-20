<script setup lang="ts">
import { TocLink } from '@nuxt/content/dist/runtime/types';

const properties = defineProps<{ value: TocLink[] }>();
</script>

<template>
  <ol>
    <li v-for="link of value" :key="link.id" ml-4 py-1>
      <NuxtLink hover:underline :to="`#${link.id}`">
        {{ link.text }}
      </NuxtLink>
      <BlogContentTocItem :value="link.children ?? []" />
    </li>
  </ol>
</template>

<style>
ol {
  counter-reset: item;
}

ol li a::before {
  --at-apply: font-semibold decoration-none;
  counter-increment: item;
  content: counters(item, '.') '.  ';
}
</style>
