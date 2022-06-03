<script setup lang="ts">
import type { Article } from '~~/typings/content';

definePageMeta({ hidden: true });
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <BlogNavigation
      v-if="$route.path === '/blog'"
      v-slot="articles: Article[]"
      space-y-8
    >
      <div
        v-for="{ _path, image, title, description } of articles"
        :key="_path"
        rounded-lg
        bg="white dark:dark-500"
        border="~ light-500 dark:transparent"
        shadow-lg
      >
        <NuxtLink v-if="image" :to="_path">
          <img
            :src="image"
            :alt="title"
            object-cover
            h-12rem
            w-full
            rounded-t-lg
          />
        </NuxtLink>
        <div p-6>
          <NuxtLink :to="_path" text-2xl font-semibold>{{ title }}</NuxtLink>
          <p class="line-clamp">
            {{ description }}
          </p>
        </div>
      </div>
    </BlogNavigation>
    <ContentDoc v-else prose="~ gray dark:invert">
      <template #empty>
        <h1>DOCUMENT NOT READY</h1>
      </template>
      <template #not-found>
        <h1>DOCUMENT NOT FOUND</h1>
      </template>
    </ContentDoc>
  </div>
</template>

<style scoped>
.line-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
