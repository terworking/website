<script setup lang="ts">
const route = useRoute();

useHead({
  meta: [{ name: 'description', content: 'Website Terworking' }],
  title: computed(() => `Terworking - ${route.meta.title}`),
});
</script>

<template>
  <Html>
    <Head>
      <Link rel="icon" href="favicon.ico" />
    </Head>
    <Body class="antialiased bg-body text-body">
      <div class="relative w-full">
        <TheHeader />
        <TheAside />
        <main>
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
