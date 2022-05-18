<script setup lang="ts">
const route = useRoute()

useHead({
  meta: [{ name: 'description', content: 'Website Terworking' }],
  link: [{ rel: 'ico', href: '/favicon.ico' }],
  title: computed(() => `Terworking - ${route.meta.title}`),
})
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
