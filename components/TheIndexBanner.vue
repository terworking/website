<script lang="ts" setup>
import { isClient } from '@vueuse/shared'

const { data: count } = await useAsyncData(() => $fetch('/banner/count'))

const imageIndex = useLocalStorage<number>('banner-image-index', 0)
const nextBanner = () =>
  (imageIndex.value! = wrapNumber(imageIndex.value + 1, count.value))
const prevBanner = () =>
  (imageIndex.value! = wrapNumber(imageIndex.value - 1, count.value))

const { width } = useWindowSize()
const sources = computed(() =>
  Array.from({ length: 3 }, (_, i) => {
    const index = imageIndex.value + (i - 1)

    if (index >= 0 && index < count.value)
      return `/banner/get/${index}?w=${Math.max(width.value, 512)}`
  })
)

const isLoaded = ref(false)
const reversed = ref(false)
const placeholder = '/banner-placeholder.png'
const isWrapAround = ref(false)

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

      if (oldValue !== undefined) {
        reversed.value = value < oldValue
        isWrapAround.value = Math.abs(value - oldValue) !== 1
      }

      const image = new Image()
      image.addEventListener('load', () => {
        isLoaded.value = true
        if (!isLeft.value) startTimeout()
      })
      image.src = sources.value[1]!
    },
    { immediate: true }
  )
}

// used to make the transition looks perfect
// its not possible to use distanceX directly
// because it does not reset after swiping is end
// which makes non-swipe transition looks weird
const additionalX = ref(0)

const bannerImage = ref<HTMLImageElement>()
const limitDistanceX = (n: number) => {
  if (bannerImage.value !== undefined) {
    const length = (bannerImage.value.clientWidth * 4) / 5
    const distributeRequired = (condition: boolean, n: number) => {
      const half = n / 2
      return condition ? [half, half] : [n, half / 2]
    }

    const [min, requiredMin] = distributeRequired(
      imageIndex.value === 0,
      -length
    )
    const [max, requiredMax] = distributeRequired(
      imageIndex.value === count.value - 1,
      length
    )

    const value = Math.max(Math.min(n, max), min)

    return {
      min,
      max,
      value,
      requiredMin,
      requiredMax,
    }
  }
}

const { distanceX } = usePointerSwipe(bannerImage, {
  onSwipe: () => {
    const length = limitDistanceX(distanceX.value)
    if (bannerImage.value !== undefined && length !== undefined) {
      const { value, min, max } = length

      bannerImage.value.style.transform = `translateX(${-value}px)`
      bannerImage.value.style.transition = `transform ${
        value <= min || value >= max ? 300 : 0
      }ms cubic-bezier(0,1.43,.2,1.62)`
    }
  },
  onSwipeStart: stopTimeout,
  onSwipeEnd: async () => {
    const length = limitDistanceX(distanceX.value)
    if (bannerImage.value !== undefined && length !== undefined) {
      bannerImage.value.style.transform = ''
      bannerImage.value.style.transition = ''

      const { value, requiredMax, requiredMin } = length

      additionalX.value = value
      if (value <= requiredMin) prevBanner()
      else if (value >= requiredMax) nextBanner()

      // reset the additionalX after 750ms (transition duration)
      setTimeout(() => (additionalX.value = 0), 750)

      startTimeout()
    }
  },
})

const leaveOpacity = computed(() => (isWrapAround.value ? '1' : 0))
const bannerImageTranslateX = computed(() => {
  const calc = (n: number) =>
    isWrapAround.value
      ? `calc(${-n}% + ${additionalX.value}px)`
      : `calc(${n}% - ${additionalX.value}px)`

  const value = reversed.value ? -105 : 105
  return { enter: calc(value), leave: `${value}%` }
})
</script>

<template>
  <div
    class="index-banner relative z-1 h-3/4 md:h-full bg-black overflow-hidden"
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
        <div
          :key="imageIndex"
          ref="bannerImage"
          class="banner-image cursor-grab"
        >
          <template v-for="(source, index) of sources">
            <img
              v-if="source !== undefined"
              :src="source"
              alt="Banner Image"
              draggable="false"
              :loading="index === 1 ? 'eager' : 'lazy'"
              :style="{ transform: `translateX(${(index - 1) * 105}%)` }"
            />
          </template>
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

.index-banner:hover .banner-button {
  opacity: 1;
}

.index-banner:hover .next-banner-button {
  transform: translateX(-25%);
}

.index-banner:hover .prev-banner-button {
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
  opacity: v-bind('leaveOpacity');
}
</style>
