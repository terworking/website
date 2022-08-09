<script lang="ts" setup>
import { defaultWindow } from '@vueuse/core'

const showHeaderMenu = ref(false)

const headerBanner = ref<HTMLElement>()
const { height: headerBannerHeight } = useElementSize(headerBanner)
const { y: scrollY } = useScroll(defaultWindow)
const headerShadeStyle = computed(() => {
  const target = headerBannerHeight.value - 64
  if (scrollY.value > target) {
    const actualTarget = Math.max(0, headerBannerHeight.value - scrollY.value)
    return { transform: `translateY(${actualTarget}px)` }
  } else {
    return { transform: `translateY(-100%)` }
  }
})
</script>

<template>
  <header class="relative h-84 md:h-128">
    <TheHeaderBanner ref="headerBanner" />
    <TheHeaderMenu :show="showHeaderMenu" />
    <div class="fixed z-999 top-0 h-64px w-full text-cyan-1 overflow-hidden">
      <div
        :style="headerShadeStyle"
        class="absolute inset-0 backdrop-brightness-60 dark:backdrop-brightness-80"
      />
      <div class="h-full px-6 md:px-8 lg:px-12 flex items-center">
        <NuxtLink class="flex-1" to="/">
          <Icon class="i-local-terworking" />
        </NuxtLink>
        <div
          id="header-button"
          class="flex items-center justify-end w-full h-full"
        >
          <Transition name="header-button">
            <div v-if="showHeaderMenu" class="flex space-x-4">
              <ColorModeToggler />
              <button
                aria-label="Close Header Menu"
                @click="showHeaderMenu = false"
              >
                <Icon class="i-material-symbols-close-rounded" />
              </button>
            </div>
            <button
              v-else
              aria-label="Show Header Menu"
              @click="showHeaderMenu = true"
            >
              <Icon class="i-material-symbols-menu-rounded" />
            </button>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
#header-button > * {
  position: absolute;
  transition: transform 500ms cubic-bezier(0.08, 0.82, 0.17, 1),
    opacity 500ms cubic-bezier(0.19, 1, 0.22, 1);
}

.header-button-enter-from {
  opacity: 0;
  transform: translateY(-125%);
}

.header-button-leave-to {
  opacity: 0;
  transform: translateX(150%);
}
</style>
