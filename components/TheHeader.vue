<script setup lang="ts">
const aside = useAside();
const routes = useRoutes();
const socials = useTerworkingSocial();

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
    class="sticky top-0 z-50 h-$header-h backdrop-blur-md border-b border-primary"
  >
    <div class="flex items-center h-full max-w-7xl mx-auto sm:px-3 lg:px-6">
      <button
        aria-label="mobileMenu"
        @click="aside.visible = true"
        class="i-tabler-align-justified text-accent h-8 w-8 lg:hidden"
      ></button>
      <div class="flex flex-1 items-center justify-center lg:justify-start">
        <NuxtLink to="/">
          <div class="flex items-center h-8 space-x-2">
            <TerworkingLogo class="h-8" />
            <span class="font-bold text-2xl">Terworking</span>
          </div>
        </NuxtLink>
      </div>
      <nav class="hidden lg:flex items-center h-full space-x-4">
        <template v-for="{ name, path } of routes" :key="path">
          <NuxtLink
            class="capitalize font-bold"
            active-class="text-accent underline underline-dotted"
            :to="path"
          >
            {{ name }}
          </NuxtLink>
        </template>
      </nav>
      <div class="flex lg:flex-1 items-center justify-end gap-1">
        <template v-for="{ icon, kind, url } of socials">
          <NuxtLink
            class="text-accent"
            :aria-label="`${kind.toLowerCase()}Link`"
            :class="`i-${icon}` + (kind !== 'GitHub' ? ' hidden lg:block' : '')"
            :to="url"
            target="_blank"
          />
        </template>
        <button
          aria-label="toggleColorMode"
          @click="toggleColorMode"
          class="i-tabler-sun dark:i-tabler-moon text-accent"
        ></button>
      </div>
    </div>
  </header>
</template>
