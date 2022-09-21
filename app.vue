<script lang="ts" setup>
const route = useRoute()
const { data: host } = await useAsyncData(async () => useRequestHeaders().host)

const config = useRuntimeConfig().public

const baseURL = computed(() => `//${host.value ?? config.websiteHostFallback}`)
const image = computed(() => `${baseURL.value}/banner/get/0?w=500`)
const url = computed(() => `${baseURL.value}${route.path}`)
const description = computed(
  () => route.meta.description ?? config.websiteDescription
)
const title = computed(() =>
  route.meta.title
    ? `${config.websiteTitle} - ${route.meta.title}`
    : config.websiteHeading
)

useHead({
  bodyAttrs: {
    class: 'antialiased text-body bg-body',
  },
  title,
  link: [{ rel: 'canonical', href: url }],
  meta: [
    { property: 'og:url', content: url },
    { name: 'twitter:url', content: url },
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    { property: 'twitter:domain', content: host },
    { name: 'description', content: description },
    { property: 'og:description', content: description },
    { name: 'twitter:description', content: description },
    { property: 'og:image', content: image },
    { name: 'twitter:image', content: image },
    { name: 'twitter:card', value: 'summary_large_image' },
  ],
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <TheHeader />
    <TheNavigationBar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
