<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

definePageMeta({
  name: 'home',
  title: 'Home',
  weight: -1,
});

const bannerContainer = ref<HTMLDivElement>();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');
const parallax = reactive(useParallax(bannerContainer));
const { isInside: pointerIsInsideBanner } = usePointer({
  target: bannerContainer,
});

const titleStyle = computed(() => {
  if (!isMobile.value && pointerIsInsideBanner.value) {
    return {
      transform: `rotateX(${parallax.roll * 20}deg) rotateY(${
        parallax.tilt * 20
      }deg)`,
    };
  }
});

const { data: _banners } = await useFetch('/api/gallery');

const banners = computed(() => {
  const { landscape, portrait } = _banners.value;

  return isMobile.value ? portrait : landscape;
});

const banner = ref(banners.value[0]);
const nextBanner = computed(
  () =>
    banners.value[
      wrapNumber(banners.value.indexOf(banner.value) + 1, banners.value.length)
    ]
);
const previousBanner = computed(
  () =>
    banners.value[
      wrapNumber(banners.value.indexOf(banner.value) - 1, banners.value.length)
    ]
);

onMounted(() => {
  const preloadedImages: Record<string, HTMLImageElement> = {};
  watch(
    banner,
    () =>
      Promise.all(
        [nextBanner.value, previousBanner.value]
          .filter((it) => !(it in Object.keys(preloadedImages)))
          .map((it) => {
            const img = new Image();
            img.addEventListener('load', () => (preloadedImages[it] = img));
            img.src = it;
          })
      ),
    { immediate: true }
  );
});

const cycleBanner = (reverse?: boolean) => {
  banner.value = (reverse === true ? previousBanner : nextBanner).value;
};

const { pause: pauseAutomaticBannerCycle, resume: resumeAutomaticBannerCycle } =
  useIntervalFn(cycleBanner, 20_000);

const isLeft = usePageLeave();
watch(isLeft, (left) =>
  left ? pauseAutomaticBannerCycle() : resumeAutomaticBannerCycle()
);

const disableManualBannerCycle = refAutoReset(false, 3000);
const manualBannerCycle = (reverse: boolean) => {
  if (disableManualBannerCycle.value) return;

  pauseAutomaticBannerCycle();

  cycleBanner(reverse);

  disableManualBannerCycle.value = true;

  resumeAutomaticBannerCycle();
};

const { direction: swipeDirection, isSwiping } = useSwipe(bannerContainer);
whenever(isSwiping, () => {
  switch (swipeDirection.value) {
    case 'RIGHT':
      manualBannerCycle(true);
      break;

    case 'LEFT':
      manualBannerCycle(false);
      break;
  }
});

const onClickBannerCycle = (reverse: boolean) => {
  if (!isSwiping.value) manualBannerCycle(reverse);
};
</script>

<template>
  <div class="parallax bg-body">
    <section class="parallax__group">
      <div class="parallax__layer parallax__layer--back">
        <div
          ref="bannerContainer"
          flex
          overflow-hidden
          relative
          select-none
          h-full
        >
          <Transition name="banner" mode="out-in">
            <img
              id="banner"
              :key="banner"
              :src="banner"
              object-cover
              w-full
              h-full
              alt="Banner"
            />
          </Transition>
          <div
            flex
            items-center
            justify-center
            md:perspect-500px
            absolute
            top-0
            left-0
            h-full
            w-full
            backdrop="filter brightness-80 dark:brightness-40"
          >
            <span
              :style="titleStyle"
              px-4
              py="2 md:4"
              text="xl md:4xl amber-300 dark:amber-200"
              border="~ amber-100"
              font-extrabold
              bg="black opacity-60 hover:opacity-25"
              backdrop="blur-sm hover:blur-0"
              transition-all-500
              ease-out
              @click="(e) => e.stopPropagation()"
            >
              WELCOME TO OUR WEBSITE
            </span>
          </div>
          <div
            absolute
            left-0
            h-full
            class="w-1/4"
            @click="onClickBannerCycle(true)"
          ></div>
          <div
            absolute
            right-0
            h-full
            class="w-3/4"
            @click="onClickBannerCycle(false)"
          ></div>
        </div>
      </div>
    </section>
    <section class="parallax__group">
      <div class="parallax__layer parallax__layer--base">
        <div flex items-center justify-center w-full h-full bg-body>
          <span>THIS SECTION IS INTENTIONALLY LEFT BLANK</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.parallax {
  --at-apply: perspect-1px overflow-x-hidden overflow-y-auto;
  height: calc(100vh - var(--header-h));
}

.parallax__group {
  --at-apply: h-screen relative preserve-3d transition-transform-500;
}

.parallax__layer {
  --at-apply: absolute top-0 right-0 bottom-0 left-0;
}

.parallax__layer--base {
  transform: translateZ(0);
}

.parallax__layer--back {
  transform: translateZ(-1px) scale(2);
}

#banner {
  transition-property: opacity;
  transition-timing-function: ease;
  transition-duration: 0.5s;
}

.banner-enter-active {
  transition-duration: 2s;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}
</style>
