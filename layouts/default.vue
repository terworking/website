<script setup lang="ts">
const route = useRoute();

useHead({
  link: [{ href: '/favicon.ico', rel: 'ico' }],
  meta: [
    { content: 'Website Terworking', name: 'description' },
    {
      content: 'rgb(245, 158, 11)',
      name: 'theme-color',
    },
  ],
  title: computed(() => useTitleTemplate(route.meta.title)),
});
</script>

<template>
  <div>
    <TheHeader />
    <TheAside />
    <main>
      <slot />
    </main>
  </div>
</template>

<style>
body {
  --at-apply: antialiased bg-body text-body;
}

* {
  --at-apply: scrollbar scrollbar-rounded scrollbar-track-color-light-500 scrollbar-thumb-color-light-900 dark:scrollbar-track-color-dark-50 dark:scrollbar-thumb-color-dark-200;
  overflow: unset;
}
</style>
