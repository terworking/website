<script lang="ts" setup>
const { showHeaderMenu } = useGlobalState()
</script>

<template>
  <ClientOnly>
    <Transition appear name="header-top">
      <div id="header-top">
        <div
          class="backdrop-brightness-60 dark:backdrop-brightness-80 backdrop-blur-sm"
        />
        <div
          class="z-999 px-6 md:px-8 lg:px-12 flex items-center text-cyan-1 overflow-hidden"
        >
          <NuxtLink title="Homepage" class="flex-1" to="/">
            <Icon class="i-local-terworking" />
          </NuxtLink>
          <div
            id="header-top-button"
            class="flex items-center justify-end w-full h-full"
          >
            <Transition name="header-top-button">
              <div v-if="showHeaderMenu" class="absolute flex space-x-4">
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
                class="absolute"
                @click="showHeaderMenu = true"
              >
                <Icon class="i-material-symbols-menu-rounded" />
              </button>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
#header-top > * {
  --at-apply: fixed top-0 h-64px w-full;
}

:is(#header-top, #header-top-button) > * {
  transition: transform 500ms cubic-bezier(0.08, 0.82, 0.17, 1),
    opacity 500ms cubic-bezier(0.19, 1, 0.22, 1);
}

.header-top-enter-from > *,
.header-top-button-enter-from {
  opacity: 0;
  transform: translateY(-125%);
}

.header-top-button-leave-to {
  opacity: 0;
  transform: translateX(150%);
}
</style>
