<script setup lang="ts">
const route = useRoute();

useHead({
  title: computed(() => `Terworking - ${route.meta.title}`),
});
</script>

<template>
  <Html lang="id-ID">
    <Head>
      <Link rel="icon" href="favicon.ico" />
    </Head>
    <Body
      class="antialiased bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
    >
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
