<script lang="ts" setup>
import { isClient } from '@vueuse/shared'

const imageIndex = ref(0)
const { width } = useWindowSize()
const src = computed(
  () => `/banner/${imageIndex.value}?w=${Math.max(width.value, 512)}`
)

const isLoaded = ref(false)
const reversed = ref(false)
const placeholder = '/banner-placeholder.png'
if (isClient) {
  const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(
    () => (imageIndex.value += 1),
    6667
  )

  watch(
    imageIndex,
    (value, oldValue) => {
      stopTimeout()
      isLoaded.value = false
      reversed.value = value < (oldValue ?? 0)

      const image = new Image()
      image.addEventListener('load', () => {
        isLoaded.value = true
        startTimeout()
      })
      image.src = src.value
    },
    { immediate: true }
  )

  const isLeft = usePageLeave()
  watch(isLeft, (v) => (v ? stopTimeout() : startTimeout()))
}

const bannerImage = ref<HTMLImageElement>()
const { lengthX } = useSwipe(bannerImage, {
  onSwipeEnd: () => {
    if (bannerImage.value !== undefined) {
      const percentage = lengthX.value / bannerImage.value.clientWidth
      if (percentage <= -0.2) {
        imageIndex.value -= 1
      } else if (percentage >= 0.2) {
        imageIndex.value += 1
      }
    }
  },
})

const bannerImageTranslateX = computed(() => ({
  enter: reversed.value ? '-105%' : '105%',
  leave: reversed.value ? '105%' : '-105%',
}))
</script>

<template>
  <div
    id="header-banner"
    class="relative h-84 md:h-128 bg-black overflow-hidden"
  >
    <div class="hidden md:block">
      <button
        aria-label="Prev Banner"
        class="prev-banner-button banner-button"
        @click="imageIndex -= 1"
      >
        <div class="i-material-symbols-chevron-left" />
      </button>
      <button
        aria-label="Next Banner"
        class="next-banner-button banner-button"
        @click="imageIndex += 1"
      >
        <div class="i-material-symbols-chevron-right" />
      </button>
    </div>
    <ClientOnly>
      <Transition appear name="banner-image">
        <img
          :key="src"
          ref="bannerImage"
          class="banner-image absolute w-full h-inherit object-cover filter-brightness-50 dark:filter-brightness-40"
          :class="{ 'animate-pulse': !isLoaded }"
          :src="isLoaded ? src : placeholder"
          alt="BANNER IMAGE"
        />
      </Transition>
    </ClientOnly>
    <div
      class="flex flex-col absolute inset-0 text-cyan-2 py-48 md:py-52 px-6 md:px-24 lg:px-36 pointer-events-none"
    >
      <h1 class="text-lg md:text-2xl lg:text-4xl font-semibold">
        Website TEROWROROKING
      </h1>
      <p>website terowrororkwing websitew tewrorrkisng website terwwprlomg</p>
    </div>
  </div>
</template>

<style scoped>
.banner-image {
  transition: transform 750ms cubic-bezier(0.19, 1, 0.22, 1);
}

.banner-image-enter-from {
  transform: translateX(v-bind('bannerImageTranslateX.enter'));
}

.banner-image-leave-to {
  transform: translateX(v-bind('bannerImageTranslateX.leave'));
}

.banner-button {
  --at-apply: absolute z-999 top-1/2 text-cyan-2 hover:text-cyan-1 border-3 border-current
    rounded-full opacity-0;
  transition: opacity 250ms linear, transform 300ms cubic-bezier(1, 0, 0, 1);
}

.banner-button > * {
  --at-apply: w-12 h-12;
}

.prev-banner-button {
  --at-apply: left-0;
  transform: scale(0.1);
}

.next-banner-button {
  --at-apply: right-0;
  transform: scale(0.1);
}

#header-banner:hover .banner-button {
  --at-apply: opacity-100;
}

#header-banner:hover .next-banner-button {
  transform: translateX(-25%);
}

#header-banner:hover .prev-banner-button {
  transform: translateX(25%);
}
</style>
