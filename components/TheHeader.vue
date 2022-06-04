<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

const aside = useAside();
const header = useHeader();
const routes = useRoutes();
const { social } = useTerworking();

const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const { directions, y: scrollY } = useScroll(defaultWindow);
const debouncedScrollY = refDebounced(scrollY, 100, { maxWait: 500 });

watch(debouncedScrollY, () => {
  const headerHeight = useRemToPx(4.5);
  if (directions.top || scrollY.value < headerHeight) {
    header.value.visible = true;
  } else if (directions.bottom) {
    header.value.visible = false;
  }
});
</script>

<template>
  <header
    class="h-$header-h"
    :class="{ '-translate-y-4.5rem': !header.visible }"
    sticky
    top-0
    z-100
    bg="body opacity-50"
    transition-transform="300 md:500"
    ease
    backdrop-blur-md
    border="b primary"
  >
    <div flex items-center h-full max-w-7xl mx-auto px="3 lg:6">
      <button
        aria-label="openAside"
        lg:hidden
        i-tabler-align-justified
        text-accent
        h-8
        w-8
        @click="aside.visible = true"
      ></button>
      <div flex="~ 1" items-center justify="center lg:start">
        <NuxtLink to="/">
          <div flex items-center h-8 space-x-2>
            <TerworkingLogo h-8 />
            <span font-bold text-2xl>Terworking</span>
          </div>
        </NuxtLink>
      </div>
      <nav hidden lg:flex items-center h-full space-x-4>
        <template v-for="{ name, path } of routes" :key="path">
          <NuxtLink
            capitalize
            font-bold
            active-class="text-accent underline underline-dotted"
            :to="path"
          >
            {{ name }}
          </NuxtLink>
        </template>
      </nav>
      <div flex="~ lg:1" items-center justify-end gap-1>
        <template v-for="{ icon, kind, url } of social" :key="url">
          <NuxtLink
            text-accent
            :aria-label="`${kind.toLowerCase()}Link`"
            :class="icon + (kind !== 'GitHub' ? ' hidden lg:block' : '')"
            :to="url"
            target="_blank"
          />
        </template>
        <button
          aria-label="toggleColorMode"
          i-tabler-sun
          dark:i-tabler-moon
          text-accent
          @click="toggleColorMode"
        ></button>
      </div>
    </div>
  </header>
</template>
