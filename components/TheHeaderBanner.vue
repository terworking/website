<script lang="ts" setup>
import { isClient } from '@vueuse/shared'

const imageIndex = ref(0)
const { width } = useWindowSize()
const src = computed(() => `/banner/${imageIndex.value}?w=${width.value}`)

const isLoaded = ref(false)
const timeout = ref<NodeJS.Timeout>()
const placeholder = '/banner-placeholder.png'
watch(
  imageIndex,
  () => {
    if (isClient) {
      isLoaded.value = false
      if (timeout.value !== undefined) clearTimeout(timeout.value)

      const image = new Image()
      image.addEventListener('load', () => {
        isLoaded.value = true
        timeout.value = setTimeout(() => (imageIndex.value += 1), 6667)
      })
      image.src = src.value
    }
  },
  { immediate: true }
)

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

const randomTransforms = computedWithControl(imageIndex, () => {
  const r = Math.random
  const rs = (i: number) => r() * (i * 2) - i
  const items = [
    `translate(${rs(100)}%, ${rs(100)}%)`,
    `skew(${rs(72)}deg, ${rs(72)}deg)`,
    `scale3d(${rs(3)}, ${rs(3)}, ${rs(3)})`,
    `rotate3d(${r()}, ${r()}, ${r()}, ${rs(360)}deg)`,
  ]

  useShuffle(items)
  return items.join(' ')
})
</script>

<template>
  <div id="header-banner" class="relative bg-black overflow-hidden">
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
      <Transition name="banner-image" mode="out-in">
        <img
          :key="src"
          ref="bannerImage"
          class="banner-image w-full h-84 md:h-128 object-cover filter-brightness-50 dark:filter-brightness-40"
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
  transition: opacity 450ms, transform 500ms cubic-bezier(0.645, 0.045, 0.355, 1);
}

.banner-image-enter-from,
.banner-image-leave-to {
  opacity: 0;
  transform: v-bind('randomTransforms');
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
