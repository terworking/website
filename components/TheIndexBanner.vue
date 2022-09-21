<script lang="ts" setup>
import { isClient } from '@vueuse/shared'

const { data: count } = await useFetch('/banner/count')

const imageIndex = useLocalStorage<number>('banner-image-index', 0)
const nextBanner = () =>
  (imageIndex.value! = wrapNumber(imageIndex.value + 1, count.value!))
const prevBanner = () =>
  (imageIndex.value! = wrapNumber(imageIndex.value - 1, count.value!))

const { width } = useWindowSize()
const sources = computed(() =>
  Array.from({ length: 3 }, (_, index) => {
    const actualIndex = imageIndex.value + (index - 1)

    if (actualIndex >= 0 && actualIndex < count.value!)
      return `/banner/get/${actualIndex}?w=${Math.max(width.value, 512)}`
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

      if (oldValue !== undefined) {
        reversed.value = value < oldValue
        isWrapAround.value = Math.abs(value - oldValue) !== 1
      }

      let loaded = false
      const image = new Image()
      image.addEventListener('load', () => {
        isLoaded.value = loaded = true
        if (!isLeft.value) startTimeout()
      })
      image.src = sources.value[1]!

      // only set isLoaded to loaded after 50ms
      // to avoid almost-instant white blink
      setTimeout(() => (isLoaded.value = loaded), 50)
    },
    { immediate: true }
  )
}

// used to make the transition looks perfect.
// its not possible to use distanceX directly
// because it does not reset after swiping is end
// which makes non-swipe transition kinda sus
const additionalX = ref(0)

const bannerImage = ref<HTMLImageElement>()
const limitDistanceX = (n: number) => {
  if (bannerImage.value !== undefined) {
    const getTarget = (wrapAroundCondition: boolean, n: number) => {
      const half = n / 2
      return wrapAroundCondition ? [half, half] : [n, half / 2]
    }

    const length = bannerImage.value.clientWidth * 0.8
    const [min, minTarget] = getTarget(imageIndex.value === 0, -length),
      [max, maxTarget] = getTarget(
        imageIndex.value === count.value! - 1,
        length
      )

    const value = Math.max(Math.min(n, max), min)

    return {
      min,
      max,
      value,
      minTarget,
      maxTarget,
    }
  }
}

const { distanceX } = usePointerSwipe(bannerImage, {
  onSwipe: () => {
    if (bannerImage.value !== undefined) {
      const { value, min, max } = limitDistanceX(distanceX.value)!

      bannerImage.value.style.transform = `translateX(${-value}px)`

      // set duration to 360 whenever value reaches max or min
      // to trigger overshoot transition, duration of 0 means
      // instantaneous transition
      const transitionDuration = value === min || value === max ? 360 : 0
      bannerImage.value.style.transition = `transform ${transitionDuration}ms cubic-bezier(0, 0, 0.26, 5.4)`
    }
  },
  onSwipeStart: stopTimeout,
  onSwipeEnd: () => {
    if (bannerImage.value !== undefined) {
      bannerImage.value.style.transform = ''
      bannerImage.value.style.transition = ''

      const { value, maxTarget, minTarget } = limitDistanceX(distanceX.value)!

      additionalX.value = value
      if (value <= minTarget) prevBanner()
      else if (value >= maxTarget) nextBanner()

      // reset the additionalX after 750ms (transition duration)
      setTimeout(() => (additionalX.value = 0), 750)

      startTimeout()
    }
  },
})

const transformLengthBase = computed(() => (reversed.value ? -105 : 105))

const bannerImageEnterFromTransform = computed(() => {
  const lengthX = isWrapAround.value
    ? `calc(${-transformLengthBase.value}% + ${additionalX.value}px)`
    : `calc(${transformLengthBase.value}% - ${additionalX.value}px)`

  return `translateX(${lengthX})`
})

const bannerImageLeave = (element: HTMLElement) => {
  if (isWrapAround.value) {
    element.style.transform = `translateX(${transformLengthBase.value}%)`
  } else {
    element.style.display = 'none'
  }
}
</script>

<template>
  <div
    class="index-banner relative z-1 h-3/4 md:h-full bg-black overflow-hidden"
  >
    <div class="hidden md:block">
      <button
        aria-label="Prev Banner"
        class="prev-banner-button banner-button left-0"
        @click="prevBanner"
      >
        <span class="i-material-symbols-chevron-left" />
      </button>
      <button
        aria-label="Next Banner"
        class="next-banner-button banner-button right-0"
        @click="nextBanner"
      >
        <span class="i-material-symbols-chevron-right" />
      </button>
    </div>
    <ClientOnly>
      <Transition
        appear
        name="banner-image"
        @leave="bannerImageLeave"
        :duration="750"
      >
        <div :key="imageIndex" ref="bannerImage" class="banner-image">
          <template v-for="(path, index) of sources">
            <img
              v-if="path !== undefined"
              :src="path"
              alt="Banner Image"
              draggable="false"
              :style="{
                left: `${(index - 1) * 105}%`,
                opacity: index === 1 && !isLoaded ? '0' : '1',
              }"
            />
            <img
              v-show="index === 1 && !isLoaded"
              class="animate-pulse pointer-events-none"
              :src="placeholder"
              alt="Banner Image Placeholder"
            />
          </template>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
.banner-button {
  z-index: 999;
  color: theme('colors.cyan.200');
  border: 3px solid currentColor;
  border-radius: 100%;
  position: absolute;
  opacity: 0;
  top: 50%;
  transition: opacity 250ms, color 250ms,
    transform 300ms cubic-bezier(1, 0, 0, 1);
}

.banner-button:hover {
  color: #fff;
}

.banner-button > * {
  display: block;
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
  cursor: grab;
}

.dark .banner-image {
  filter: brightness(0.4);
}

.banner-image,
.banner-image > * {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-image-enter-from {
  transform: v-bind('bannerImageEnterFromTransform');
}
</style>
