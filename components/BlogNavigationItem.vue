<script setup lang="ts">
import { FlatNavigation } from '~~/typings/content';

const properties = defineProps<{ value: FlatNavigation }>();
</script>

<template>
  <div card m-4>
    <NuxtLink v-if="value.image" :to="value._path">
      <img
        :src="value.image"
        :alt="value.title"
        object-cover
        h-12rem
        w-full
        rounded-t-lg
      />
    </NuxtLink>
    <div p-6>
      <NuxtLink :to="value._path" text-2xl font-semibold>
        {{ value.title }}
      </NuxtLink>
      <p class="line-clamp">
        {{ value.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp {
  --at-apply: overflow-hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
