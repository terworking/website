<script lang="ts" setup>
import { defaultWindow } from '@vueuse/core'

const show = ref(false)

const navigationBar = ref<HTMLElement>()
const navigationBarTranslateY = ref(0)
const { lengthY: swipeLengthY } = useSwipe(defaultWindow)
watch(swipeLengthY, (value, oldValue) => {
  if (navigationBar.value !== undefined) {
    const max = navigationBar.value.clientHeight

    const difference = oldValue - value
    navigationBarTranslateY.value = Math.min(
      Math.max(navigationBarTranslateY.value - difference, 0),
      max !== 0 ? max : navigationBarTranslateY.value
    )

    show.value =
      max !== 0
        ? navigationBarTranslateY.value < max ||
          navigationBarTranslateY.value === 0
        : value < oldValue
  }
})

useEventListener('wheel', (e) => {
  show.value = e.deltaY < 0
  if (show.value) navigationBarTranslateY.value = 0
})
useEventListener('touchend', () => {
  if (show.value) navigationBarTranslateY.value = 0
})

onMounted(() => (show.value = true))
</script>

<template>
  <Transition name="navigation-bar">
    <nav
      v-show="show"
      ref="navigationBar"
      :style="{
        transform:
          navigationBarTranslateY !== 0
            ? `translateY(${navigationBarTranslateY}px)`
            : undefined,
      }"
      class="navigation-bar fixed lg:hidden z-999 bottom-0 h-64px sm:h-80px dark:border-t-2 dark:border-cyan-2 w-full bg-body"
    >
      <ul
        class="flex items-center justify-evenly sm:divide-x divide-current h-full px-1/24 md:px-1/4 text-center text-sm font-semibold"
      >
        <li v-for="{ path, title, icon } of useNavigation()" class="w-full">
          <NuxtLink
            exact-active-class="active"
            :title="title"
            :to="path"
            class="block navigation-link"
          >
            <div :class="icon" class="navigation-link-icon mx-auto w-8 h-8" />
            <span class="navigation-link-title hidden sm:block">{{
              title
            }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </Transition>
</template>

<style scoped>
.navigation-bar {
  --navigation-bar-glow: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 24px 0 var(--navigation-bar-glow);
  transition: transform 750ms cubic-bezier(0.19, 1, 0.22, 1),
    opacity 500ms ease-in-out;
}

.dark .navigation-bar {
  --navigation-bar-glow: theme('colors.cyan.200');
}

.navigation-bar-enter-from,
.navigation-bar-leave-to {
  opacity: 0;
  transform: translateY(100%) !important;
}

.navigation-link,
.navigation-link > * {
  transition: transform 200ms ease-in-out, color 200ms ease-in-out,
    text-shadow 200ms ease-in-out;
}

.navigation-link.active {
  color: theme('colors.cyan.500');
}

.dark .navigation-link.active {
  color: theme('colors.cyan.200');
}

@media (min-width: 640px) {
  .navigation-link:hover {
    color: theme('colors.cyan.500');
  }

  .dark .navigation-link:hover {
    color: theme('colors.cyan.200');
  }

  .navigation-link.active:hover {
    color: unset;
    cursor: not-allowed;
  }

  .dark .navigation-link.active:hover > .navigation-link-title {
    text-shadow: 0 0 5px theme('colors.cyan.200');
  }

  :is(.navigation-link:hover, .navigation-link.active) {
    transform: translateY(10%);
  }

  :is(.navigation-link:hover, .navigation-link.active) > .navigation-link-icon {
    transform: scale(1.4) translateY(-5%);
  }
}
</style>
