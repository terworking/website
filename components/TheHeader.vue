<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const terworkingSocial = useTerworkingSocial();

const colorMode = useColorMode();

const toggleColorMode = () => {
  if (colorMode.value === 'dark') {
    colorMode.preference = 'light';
  } else {
    colorMode.preference = 'dark';
  }
};
</script>

<template>
  <header
    class="h-18 sticky top-0 z-50 backdrop-blur-md border-b border-dashed border-slate-800/20 dark:border-white/20"
  >
    <div
      class="flex items-center h-full px-1 mx-auto max-w-7xl sm:px-3 lg:px-6"
    >
      <button
        aria-label="mobileMenu"
        @click="aside.isOpen = true"
        class="i-tabler-align-justified icon-btn h-8 w-8 m-3 lg:hidden"
      ></button>
      <div class="flex flex-1 items-center justify-center lg:justify-start">
        <NuxtLink to="/">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav class="items-center h-full gap-4 hidden lg:flex">
        <template v-for="{ name, path } of routes">
          <NuxtLink class="capitalize" :to="path">
            {{ name }}
          </NuxtLink>
        </template>
      </nav>
      <div class="flex items-center justify-end gap-1 lg:flex-1">
        <a
          aria-label="githubLink"
          :href="terworkingSocial.github"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="i-tabler-brand-github icon-btn m-3"
        >
        </a>
        <a
          aria-label="instagramLink"
          :href="terworkingSocial.instagram"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="hidden lg:block i-tabler-brand-instagram icon-btn m-3"
        >
        </a>
        <a
          aria-label="youtubeLink"
          :href="terworkingSocial.youtube"
          rel="external nofollow noopener noreferrer"
          target="_blank"
          class="hidden lg:block i-tabler-brand-youtube icon-btn m-3"
        >
        </a>
        <button
          aria-label="toggleColorMode"
          @click="toggleColorMode"
          class="i-tabler-sun dark:i-tabler-moon icon-btn m-3"
        ></button>
      </div>
    </div>
  </header>
</template>
