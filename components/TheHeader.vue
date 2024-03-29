<script lang="ts" setup>
import { defaultWindow } from '@vueuse/core'

const navigation = useNavigation()
const calculateNavigationUnderlinePosition = (n: number) => {
  const value = (100 / (navigation.length + 1)) * (n + 1)
  return `${value}%`
}

const showHeader = ref(false)
const { y: scrollY } = useScroll(defaultWindow)
watch(
  scrollY,
  (value, oldValue) => (showHeader.value = value < oldValue || value <= 64)
)

onMounted(() => (showHeader.value = true))
</script>

<template>
  <div class="relative h-64px overflow-hidden">
    <Transition name="header" :duration="500">
      <header v-show="showHeader" class="header">
        <div class="header-mask fixed top-0 h-64px w-full" />
        <div
          class="fixed top-0 h-64px w-full z-999 px-6 md:px-8 lg:px-12 flex items-center justify-center lg:justify-between text-cyan-1 overflow-visible"
        >
          <div class="flex z-999 h-full items-center">
            <NuxtLink
              title="Index Page"
              to="/"
              class="index-link inline-flex h-full items-center space-x-1"
            >
              <Icon class="i-local-terworking" :darken-on-hover="false" />
              <span class="text-xl md:text-2xl font-semibold">Terworking</span>
            </NuxtLink>
            <ColorModeToggler class="ml-2" />
          </div>
          <nav class="hidden lg:block absolute inset-x-0">
            <ul class="flex justify-center space-x-8 text-lg font-semibold">
              <li v-for="({ path, title }, index) of navigation">
                <NuxtLink
                  exact-active-class="active"
                  :title="title"
                  :to="path"
                  :style="{
                    '--underline-position-x':
                      calculateNavigationUnderlinePosition(index),
                    '--underline-position-y': '100%',
                  }"
                  class="navigation-link block"
                >
                  <span class="inline">
                    {{ title }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </Transition>
  </div>
</template>

<style scoped>
.header > * {
  transition: transform 500ms cubic-bezier(0.08, 0.82, 0.17, 1),
    opacity 500ms cubic-bezier(0.19, 1, 0.22, 1),
    backdrop-filter 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.header-enter-from > * {
  opacity: 0;
  transform: translateY(-125%);
}

.header-leave-to > * {
  opacity: 0;
  transform: translateY(-65%);
}

.header-mask {
  --mask-brightness: 0.4;
  backdrop-filter: brightness(var(--mask-brightness)) blur(4px);
}

.dark .header-mask {
  --mask-brightness: 0.6;
}

@media (min-width: 1024px) {
  .index-link {
    --underline-position-x: 50%;
    --underline-position-y: 90%;
  }

  .index-link,
  .navigation-link {
    transition: transform 200ms ease-in-out, color 200ms ease-in-out,
      text-shadow 200ms ease-in-out,
      background-size 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
    text-decoration: none;
    background-image: linear-gradient(currentColor, currentColor);
    background-position: var(--underline-position-x) var(--underline-position-y);
    background-size: 0% 1px;
    background-repeat: no-repeat;
    margin: 5px 0;
  }

  .index-link:hover {
    background-size: 100% 3px;
  }

  .navigation-link:hover,
  .navigation-link.active {
    color: theme('colors.cyan.200');
    transform: scale(1.1) translateY(-5%);
    background-size: 100% 3px;
  }

  .navigation-link.active:hover {
    color: unset;
    cursor: not-allowed;
    text-shadow: 0 0 5px theme('colors.cyan.200');
  }
}
</style>
