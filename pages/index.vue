<script setup lang="ts">
import { isClient } from '@vueuse/shared';
import Photoswipe from 'photoswipe';

definePageMeta({
  name: 'home',
  title: 'Home',
  weight: -1,
});

const bannerContainer = ref<HTMLDivElement>();
const mouse = reactive(useMouse());
const parallax = reactive(useParallax(bannerContainer));
const { isInside: pointerIsInsideBanner } = usePointer({
  target: bannerContainer,
});

const titleStyle = computed(() => {
  if (mouse.sourceType === 'mouse' && pointerIsInsideBanner.value) {
    return {
      transform: `rotateX(${parallax.roll * 20}deg) rotateY(${
        parallax.tilt * 20
      }deg)`,
    };
  }
});

const { data: banners } = await useFetch('/api/gallery', {
  key: 'index-banners',
  transform: (data) => {
    return shuffle(
      data // only use landscape images
        .filter(({ height, width }) => width > height)
    );
  },
});

const current = ref(banners.value[0]);
const currentIndex = computed(() =>
  banners.value.findIndex(({ path }) => path === current.value.path)
);

const { width: windowWidth } = useWindowSize({ initialWidth: 0 });
const thumbnails = computedWithControl(banners, () =>
  banners.value.map((data) => getThumbnail(data, windowWidth.value))
);
const currentThumbnail = computed(() => thumbnails.value[currentIndex.value]);

const loaded = ref<string[]>([currentThumbnail.value.path]);
const loading = ref<string[]>([]);
watch(currentIndex, async (value) => {
  if (isClient) {
    const indexes = [0, 1, -1, 2].map((v) =>
      wrapNumber(value + v, banners.value.length)
    );

    const preload = indexes
      .map((v) => thumbnails.value[v].path)
      .filter(
        (path) => !(loaded.value.includes(path) || loading.value.includes(path))
      );

    for (const [index, path] of preload.entries()) {
      loading.value.push(path);
      if (index !== 0) {
        await until(() =>
          loaded.value.includes(preload[index - 1])
        ).toBeTruthy();
      }

      const image = new Image();
      image.addEventListener('load', () => {
        loading.value.splice(loading.value.indexOf(path), 1);
        loaded.value.push(path);
      });
      image.src = path;
    }
  }
});

const cycleBanner = (reverse?: boolean) => {
  current.value =
    banners.value[
      wrapNumber(
        currentIndex.value + (reverse === true ? -1 : 1),
        banners.value.length
      )
    ];
};

const interval = computed(() => (loaded.value.length === 1 ? 45_000 : 10_000));
const { pause: pauseAutomaticBannerCycle, resume: resumeAutomaticBannerCycle } =
  useIntervalFn(cycleBanner, interval);

const bannerLeft = ref('0');
const bannerTransform = computed(() => `translateX(${bannerLeft.value})`);
const { distanceX, isSwiping, posEnd, posStart } = usePointerSwipe(
  bannerContainer,
  {
    onSwipe: () => {
      bannerLeft.value = `${-distanceX.value}px`;
    },
    onSwipeEnd: () => {
      resumeAutomaticBannerCycle();
      if (bannerContainer.value !== undefined) {
        const percentage = distanceX.value / bannerContainer.value.clientWidth;
        // only change the banner when swipped more than 1/3 element width
        if (percentage <= -0.34) {
          cycleBanner(true);
        } else if (percentage >= 0.34) {
          cycleBanner();
        }
      }
      bannerLeft.value = '0';
    },
    onSwipeStart: () => {
      pauseAutomaticBannerCycle();
    },
    pointerTypes: ['mouse', 'pen'],
  }
);

const cycleIsReversed = ref(false);
watch(currentIndex, (value, oldValue) => {
  // this is when the index is wrapped, (e.g 60 > 0, 0 > 60)
  if (oldValue === banners.value.length - 1 && value === 0) {
    cycleIsReversed.value = false;
  } else if (oldValue === 0 && value === banners.value.length - 1) {
    cycleIsReversed.value = true;
  } else {
    cycleIsReversed.value = value < oldValue;
  }
});

const bannerOnEnter = (element: HTMLElement) => {
  element.classList.add('banner-transition');
  if (cycleIsReversed.value) {
    element.classList.add('reversed');
  } else {
    element.classList.remove('reversed');
  }
};
const bannerOnAfterEnter = (element: HTMLElement) => {
  element.classList.remove('reversed', 'banner-transition');
};
const bannerOnLeave = bannerOnEnter;

const photoswipeIsOpen = ref(false);
const openPhotoswipe = (index: number) => {
  // only open when the cursor is moved less than 10px
  if (Math.abs(posEnd.x - posStart.x) > 10) return;

  const pswp = new Photoswipe({
    dataSource: banners.value.map(({ path, ...rest }, index) => ({
      msrc: thumbnails.value[index].path,
      src: path,
      ...rest,
    })),
    index,
  });

  pswp.on('change', () => {
    // also change the current banner
    // when Photoswipe slide is changed
    current.value = banners.value[pswp.currIndex];
  });
  pswp.on('firstUpdate', () => {
    photoswipeIsOpen.value = true;
    pauseAutomaticBannerCycle();
  });
  pswp.on('close', () => {
    photoswipeIsOpen.value = false;
    resumeAutomaticBannerCycle();
  });

  pswp.init();
};

const pageIsLeft = usePageLeave();
watch([pageIsLeft, photoswipeIsOpen], (value) => {
  value.some(Boolean)
    ? pauseAutomaticBannerCycle()
    : resumeAutomaticBannerCycle();
});

const { data: content } = await useAsyncData('index-content', () =>
  queryContent('_pages', 'home')
    .where({ _partial: true })
    .only(['body', '_shrink', '_type'])
    .find()
);

const shrinkContent = ref(content.value.map((v) => v._shrink === true));

const { data: youtubeVideos } = await useAsyncData(
  'index-youtube-videos',
  async () => {
    const data = await $fetch<{
      videos: Record<'title' | 'videoId', string>[];
    }>('https://y.com.sb/api/v1/playlists/PLm2GaWqOUKvkmQ24tBx1No8u8u3DVeiCf', {
      params: { fields: 'videos(videoId,title)' },
    });

    return shuffle(
      data.videos.map(({ title, videoId: id }) => ({
        id,
        title,
        url: `https://youtu.be/${id}`,
      }))
    );
  }
);
</script>

<template>
  <div class="parallax">
    <div class="parallax__group">
      <div h="64 md:auto" class="parallax__layer parallax__layer--back">
        <div
          ref="bannerContainer"
          relative
          w-full
          h-full
          flex
          overflow-hidden
          select-none
          :style="{ cursor: isSwiping ? 'grabbing' : 'grab' }"
          @click="openPhotoswipe(currentIndex)"
        >
          <ClientOnly>
            <Transition
              name="banner"
              mode="out-in"
              @after-enter="bannerOnAfterEnter"
              @enter="bannerOnEnter"
              @leave="bannerOnLeave"
            >
              <div
                :key="current.path"
                absolute
                inset-0
                w-full
                h-full
                :class="{ 'banner-transition': !isSwiping }"
                :style="{ transform: bannerTransform }"
              >
                <img
                  v-if="loaded.includes(currentThumbnail.path)"
                  :height="currentThumbnail.height"
                  :src="currentThumbnail.path"
                  :width="currentThumbnail.width"
                  object-cover
                  w-full
                  h-full
                  alt="Banner"
                />
                <PlaceholderImage v-else h-full animate-pulse />
              </div>
            </Transition>
          </ClientOnly>
          <div
            flex
            items-center
            justify-center
            md:perspect-500px
            absolute
            inset-0
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
              cursor-default
              @click="(e) => e.stopPropagation()"
            >
              WELCOME TO OUR WEBSITE
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="parallax__group">
      <div class="parallax__layer parallax__layer--base">
        <div w-full h-full divide="y-2 current dashed" bg-body_b>
          <div
            v-for="(value, index) of content"
            :key="index"
            relative
            class="shrinkable"
            overflow-hidden
            max-h="333px md:530px"
            :style="{
              'max-height': shrinkContent[index] ? undefined : '999rem',
            }"
          >
            <Transition appear name="shrinkable">
              <div
                v-if="shrinkContent[index]"
                z-5
                absolute
                inset-x-0
                bottom-0
                p="t-24 md:t-36 b-8"
                bg-gradient="to-t from-body_b"
                text-center
                pointer-events-none
                class="shrinkable-container"
              >
                <button
                  bg-body_b
                  p="x-4 y-2"
                  text="lg md:xl"
                  border="~ hover:accent"
                  font-semibold
                  pointer-events-auto
                  @click="shrinkContent[index] = false"
                >
                  SHOW MORE...
                </button>
              </div>
            </Transition>
            <ContentRenderer class="content" tag="section" :value="value" />
          </div>
          <section class="content">
            <h2>YOUTUBE</h2>
            <p>Silahkan nikmati konten-konten Youtube <i>random</i> kami.</p>
            <div v-for="{ id, title, url } of youtubeVideos" :key="id">
              <EmbedYoutube :id="id" h="64 md:96" w-full />
              <p>
                <b
                  ><NuxtLink target="_blank" :to="url">{{ title }}</NuxtLink></b
                >
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shrinkable {
  transition-property: max-height;
  transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  transition-duration: 2000ms;
}

.shrinkable-container {
  transition-property: opacity, transform;
  transition-timing-function: ease-in-out, cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-duration: 500ms, 750ms;
}

.shrinkable-enter-from,
.shrinkable-leave-to {
  opacity: 0;
  transform: translateY(50%);
}

:deep(.content) {
  --at-apply: max-w-2xl mx-auto space-y-8 px-2 py-6 text-center
}

:deep(.content) :where(h1, h2) {
  --at-apply: text-4xl md:text-6xl my-2 font-semibold;
}

:deep(.content) p {
  --at-apply: md:text-lg;
}

:deep(.content) li > ul {
  --at-apply: ml-4 mt-2 list-disc;
}

:deep(.content) ul {
  --at-apply: text-start space-y-4;
}

:deep(.content) ul > li > h3 {
  --at-apply: text-2xl md:text-3xl mb-1 underline;
}

:deep(.content) :not(h1, h2, h3, a) > a {
  --at-apply: underline underline-2 underline-dotted;
}

.banner-transition {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
  transition-duration: 0.5s;
}

.banner-enter-active {
  transition-duration: 0.34s;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}

.banner-enter-from,
.banner-leave-to.reversed {
  transform: translateX(100%) !important;
}

.banner-leave-to,
.banner-enter-from.reversed {
  transform: translateX(-100%) !important;
}

@media (min-width: 768px) {
  .parallax {
    --at-apply: perspect-1px overflow-x-hidden overflow-y-auto;
    height: calc(100vh - 9rem);
  }

  .parallax__group {
    --at-apply: relative preserve-3d transition-transform-500;
    height: calc(100vh - 9rem);
  }

  .parallax__layer {
    --at-apply: absolute inset-0;
  }

  .parallax__layer--base {
    transform: translateZ(0);
  }

  .parallax__layer--back {
    transform: translateZ(-1px) scale(2);
  }
}
</style>
