<script lang="ts" setup>
const showHeaderMenu = ref(false)
const {
  public: { headerHeading, headerParagraph },
} = useRuntimeConfig()
</script>

<template>
  <header class="relative h-[calc(100vh-4rem)]">
    <TheHeaderBanner />
    <TheHeaderMenu :show="showHeaderMenu" />
    <div
      class="absolute w-full px-1/16 md:px-1/12 top-4/5 text-center md:(text-start text-cyan-2)"
    >
      <h1 class="text-3xl md:text-4xl header-text">{{ headerHeading }}</h1>
      <p class="text-sm md:text-base header-text">{{ headerParagraph }}</p>
    </div>
    <div
      class="fixed -z-1 top-0 h-64px w-full backdrop-brightness-60 dark:backdrop-brightness-80 backdrop-blur-sm"
    />
    <div class="fixed z-999 top-0 h-64px w-full text-cyan-1 overflow-hidden">
      <div class="h-full px-6 md:px-8 lg:px-12 flex items-center">
        <NuxtLink title="Homepage" class="flex-1" to="/">
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
.header-text {
  --at-apply: font-semibold;
}

@media (min-width: 768px) {
  .header-text {
    text-shadow: 1px -1px 10px theme('colors.zinc.900'),
      -1px 1px 10px theme('colors.zinc.900');
  }
}

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
