<script setup lang="ts">
const headerSize = useHeaderSize();

const route = useRoute();
const { data: host } = await useAsyncData('host', async () => {
  return `https://${
    useRequestEvent().req.headers.host ?? 'terworking.vercel.app'
  }`;
});

const { data: image } = await useAsyncData('opengraph-image', async () => {
  if (route.meta.image !== undefined) return route.meta.image;

  const data = await $fetch('/api/gallery');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = data.filter(({ height, width }) => width > height).pop()!;

  return `${host.value}${image.path}?thumbnail=1`;
});

const url = computed(() => `${host.value}${route.path}`);
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
  --at-apply: antialiased bg-body_b text-body;
}

* {
  --at-apply: scrollbar scrollbar-rounded scrollbar-track-color-light-500 scrollbar-thumb-color-light-900 dark:scrollbar-track-color-dark-50 dark:scrollbar-thumb-color-dark-200;
  overflow: unset;
}
</style>
