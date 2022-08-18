<script lang="ts" setup>
const navigation = useNavigation()
const calculateInitialPosition = (n: number) =>
  (100 / (navigation.length + 1)) * (n + 1)

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
          <NuxtLink title="Homepage" class="flex-1 lg:flex-none" to="/">
            <Icon class="i-local-terworking" />
          </NuxtLink>
          <nav class="hidden lg:block flex-1 w-full">
            <ul
              class="flex justify-center space-x-8 text-white text-lg font-semibold"
            >
              <li v-for="({ path, title }, index) of navigation">
                <NuxtLink
                  exact-active-class="active"
                  :title="title"
                  :to="path"
                  :style="{
                    '--initial-border': `${calculateInitialPosition(index)}%`,
                  }"
                  :class="{ 'in-index': $route.path === '/' }"
                  class="block navigation-link"
                >
                  <span class="inline">
                    {{ title }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <div
            id="header-top-button"
            class="flex items-center justify-end w-8 md:w-10 h-full"
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

.navigation-link {
  transition: transform 200ms ease-in-out, color 200ms ease-in-out,
    text-shadow 200ms ease-in-out,
    background-size 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
  text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-position: var(--initial-border) 100%;
  background-size: 0% 1px;
  background-repeat: no-repeat;
  margin: 5px 0;
}

:is(.navigation-link:hover, .navigation-link.active) {
  transform: scale(1.1) translateY(-5%);
  background-size: 100% 3px;
}

.dark .navigation-link.active,
.navigation-link.in-index {
  color: theme('colors.cyan.200');
}

.navigation-link.active:hover {
  color: unset;
  text-shadow: 0 0 5px theme('colors.cyan.200');
}

.header-top-button-leave-to {
  opacity: 0;
  transform: translateX(150%);
}
</style>
