<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

const aside = useAside();
const header = useHeader();
const headerSize = useHeaderSize();
const routes = useRoutes();
const { social } = useTerworking();

const { y: scrollY } = useScroll(defaultWindow);
const { height: windowHeight } = useWindowSize();

watch(scrollY, (value, oldValue) => {
  if (Math.abs(value - oldValue) === headerSize.height.px) {
    return;
  }

  if (value < oldValue || value < windowHeight.value) {
    header.value.visible = true;
  } else if (value > oldValue) {
    header.value.visible = false;
  }
});
</script>

<template>
  <div
    class="header"
    :style="{
      height: `${headerSize.height.rem}rem`,
      transform: `translateY(${header.visible ? 0 : -100}%)`,
    }"
    sticky
    top-0
    z-100
    pointer-events="none children:auto"
  >
    <header bg="body_b opacity-50" h-full backdrop-blur-md border="b primary">
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
              :class="{
                'text-accent underline underline-dotted':
                  $route.path === path ||
                  ($route.path.startsWith(path) && path !== '/'),
              }"
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
          <TheColorModeToggler />
        </div>
      </div>
    </header>
    <Transition name="scroll-to-top">
      <TheScrollToTop
        v-if="header.visible && scrollY > windowHeight * 2"
        class="scroll-to-top"
      />
    </Transition>
  </div>
</template>

<style scoped>
.header {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-duration: 0.45s;
}

.scroll-to-top {
  transition-property: opacity, transform;
  transition-timing-function: ease-in-out,
    cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-duration: 0.2s, 0.5s;
}

.scroll-to-top-enter-from,
.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
