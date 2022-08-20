<script lang="ts" setup>
import { isClient } from '@vueuse/shared'

const imageIndex = useLocalStorage<number>('banner-image-index', 0)
const nextBanner = () => (imageIndex.value! += 1)
const prevBanner = () => (imageIndex.value! -= 1)

const { width } = useWindowSize()
const source = computed(
  () => `/banner/${imageIndex.value}?w=${Math.max(width.value, 512)}`
)

const isLoaded = ref(false)
const reversed = ref(false)
const placeholder = '/banner-placeholder.png'

const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(
  nextBanner,
  6667
)

if (isClient) {
  const isLeft = usePageLeave()
  watch(isLeft, (v) => (v ? stopTimeout() : startTimeout()))
  watch(
    imageIndex,
    (value, oldValue) => {
      stopTimeout()
      isLoaded.value = false
      reversed.value = value < (oldValue ?? 0)

      const image = new Image()
      image.addEventListener('load', () => {
        isLoaded.value = true
        if (!isLeft.value) startTimeout()
      })
      image.src = source.value
    },
    { immediate: true }
  )
}

const swiping = ref(false)
const bannerImage = ref<HTMLImageElement>()
const { lengthX, lengthY } = useSwipe(bannerImage, {
  threshold: 0,
  onSwipe: () => {
    if (bannerImage.value !== undefined) {
      const condition = (swiping.value =
        Math.abs(lengthX.value) > 50 && Math.abs(lengthY.value) < 100)

      bannerImage.value.style.transform = condition
        ? `translateX(${-lengthX.value}px)`
        : ''
    }
  },
  onSwipeStart: stopTimeout,
  onSwipeEnd: () => {
    if (bannerImage.value !== undefined) {
      if (bannerImage.value.style.transform !== '') {
        bannerImage.value.style.transform = ''
        const percentage = lengthX.value / bannerImage.value.clientWidth
        if (percentage <= -0.2) {
          prevBanner()
        } else if (percentage >= 0.2) {
          nextBanner()
        }
      }

      swiping.value = false
      startTimeout()
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
    class="header-banner relative z-1 h-3/4 md:h-full bg-black overflow-hidden"
  >
    <div class="hidden md:block">
      <button
        aria-label="Prev Banner"
        class="prev-banner-button banner-button absolute left-0 z-999 top-1/2 text-cyan-2 hover:text-cyan-1 border-3 border-current rounded-full opacity-0"
        @click="prevBanner"
      >
        <div class="i-material-symbols-chevron-left" />
      </button>
      <button
        aria-label="Next Banner"
        class="next-banner-button banner-button absolute right-0 z-999 top-1/2 text-cyan-2 hover:text-cyan-1 border-3 border-current rounded-full opacity-0"
        @click="nextBanner"
      >
        <div class="i-material-symbols-chevron-right" />
      </button>
    </div>
    <ClientOnly>
      <Transition appear name="banner-image">
        <div :key="imageIndex" ref="bannerImage" class="banner-image">
          <img :src="source" alt="Banner Image" />
          <img
            v-if="!isLoaded"
            class="animate-pulse pointer-events-none"
            :src="placeholder"
            alt="Banner Image Placeholder"
          />
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
.banner-button {
  transition: opacity 250ms linear, transform 300ms cubic-bezier(1, 0, 0, 1);
}

.banner-button > * {
  height: 3rem;
  width: 3rem;
}

.prev-banner-button,
.next-banner-button {
  transform: scale(0.1);
}

.header-banner:hover .banner-button {
  opacity: 1;
}

.header-banner:hover .next-banner-button {
  transform: translateX(-25%);
}

.header-banner:hover .prev-banner-button {
  transform: translateX(25%);
}

.banner-image {
  transition: transform 750ms cubic-bezier(0.19, 1, 0.22, 1),
    filter 250ms cubic-bezier(0.6, -0.28, 0.735, 0.045);
  filter: brightness(0.5);
}

.dark .banner-image {
  filter: brightness(0.4);
}

.banner-image,
.banner-image * {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-image-enter-from {
  transform: translateX(v-bind('bannerImageTranslateX.enter'));
}

.banner-image-leave-to {
  transform: translateX(v-bind('bannerImageTranslateX.leave'));
}
</style>
