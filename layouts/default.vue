<script setup lang="ts">
const route = useRoute();

useHead({
  link: [{ href: '/favicon.ico', rel: 'ico' }],
  meta: [{ content: 'Website Terworking', name: 'description' }],
  title: computed(
    () =>
      'Terworking' +
      (route.meta.title !== undefined ? ` - ${route.meta.title}` : '')
  ),
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
