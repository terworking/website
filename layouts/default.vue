<script setup lang="ts">
const headerSize = useHeaderSize();

const route = useRoute();
const { data: host } = await useAsyncData(
  'host',
  async () => useRequestHeaders().host,
  { default: () => 'terworking.vercel.app' }
);
const url = computed(() => `https://${host.value}${route.path}`);
const image = computed(() => route.meta.image);
const title = computed(() => useTitleTemplate(route.meta.title));
const description = computed(() => route.meta.description ?? title.value);
useHead(useSeoHead({ description, image, title, url }));

useHead({
  link: [{ href: '/favicon.ico', rel: 'ico' }],
  meta: [
    { content: 'rgb(245, 158, 11)', name: 'theme-color' },
    { content: 'Terworking', property: 'og:site_name' },
    { content: 'website', property: 'og:type' },
  ],
  // @ts-expect-error nuxt type error
  title,
});
</script>

<template>
  <div>
    <TheHeader />
    <TheAside />
    <main
      :style="{
        'min-height': `calc(100vh - calc(${headerSize.height.rem}rem * 2))`,
      }"
    >
      <slot />
    </main>
    <TheFooter />
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
