<script lang="ts" setup>
const route = useRoute()
const { data: host } = await useAsyncData(
  async () => useRequestHeaders().host ?? 'terworking.netlify.app'
)

const baseURL = computed(() => `https://${host.value}`)
const url = computed(() => `${baseURL.value}${route.path}`)
const description = computed(
  () => route.meta.description ?? 'Website Terworking.'
)
const title = computed(() =>
  route.meta.title ? `Terworking - ${route.meta.title}` : 'Terworking'
)
useHead({
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
  ],
})
</script>

<template>
  <div>
    <TheHeader />
    <TheNavigationBar />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
