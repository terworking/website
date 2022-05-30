<script setup lang="ts">
const route = useRoute();

const title = computed(() =>
  route.meta.title === undefined
    ? 'Terworking'
    : `${route.meta.title} - Terworking`
);

useHead({
  link: [{ href: '/favicon.ico', rel: 'ico' }],
  meta: [
    { content: 'Website Terworking', name: 'description' },
    {
      content: 'rgb(245, 158, 11)',
      name: 'theme-color',
    },
  ],
  title,
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
</style>
