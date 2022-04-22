<script setup lang="ts">
const target = ref(null);
const parallax = reactive(useParallax(target));
const breakpoints = useBreakpoints({ md: 768 });
const tablet = breakpoints.greater('md');

const titleStyle = computed(() => {
  // Only enable title parallax on tablet or higher breakpoints
  if (tablet.value) {
    return {
      transition: '.3s ease-out all',
      transform: `rotateX(${parallax.roll * 20}deg) rotateY(${
        parallax.tilt * 20
      }deg)`,
    };
  }
});

const bannerImages = [
  'https://drive.google.com/uc?id=1uC_1KjklqP68xP6C0AmMHvhKVmMFckYS&export=view',
  'https://drive.google.com/uc?id=1uDgC5xbj_MyQa5lYyY97icUEJ7sBSBRL&export=view',
];

const bannerImage = useState(
  'banner-image',
  () => bannerImages[Math.floor(Math.random() * bannerImages.length)]
);

let intervalHandler;
onMounted(() => {
  const cycleBannerImage = () => {
    bannerImage.value =
      bannerImages[
        (bannerImages.indexOf(bannerImage.value) + 1) % bannerImages.length
      ];
  };

  // Automatically cycle banner image every 15 seconds
  intervalHandler = setInterval(cycleBannerImage, 15000);
});

onUnmounted(() => {
  clearInterval(intervalHandler);
});

definePageMeta({
  name: 'home',
  weight: -1,
  title: 'Home',
});
</script>

<template>
  <div class="parallax">
    <section class="parallax__group">
      <div class="parallax__layer parallax__layer--back">
        <div
          ref="target"
          class="flex overflow-hidden relative m-2 md:m-0 bg-white dark:bg-black rounded-lg select-none h-full"
        >
          <Transition name="fade" mode="out-in">
            <img
              class="object-cover w-full h-full"
              :src="bannerImage"
              :key="bannerImage"
              alt="Banner"
            />
          </Transition>
          <div
            class="flex items-center justify-center dark:bg-slate-900/25 md:perspect-524px absolute top-0 left-0 h-full w-full"
          >
            <span
              :style="titleStyle"
              class="py-2 px-4 md:py-4 text-xl md:text-4xl text-white text-amber-200 border border-amber-100 font-extrabold bg-black/25 backdrop-filter backdrop-brightness-50 backdrop-blur-sm"
            >
              WELCOME TO OUR WEBSITE
            </span>
          </div>
        </div>
      </div>
    </section>
    <section class="parallax__group">
      <div class="parallax__layer parallax__layer--base">
        <div
          class="flex items-center justify-center w-full h-full bg-white dark:bg-black"
        >
          <span>THIS SECTION IS INTENTIONALLY LEFT BLANK</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.parallax {
  @apply perspect-1px overflow-x-hidden overflow-y-auto;
  height: calc(100vh - 4.5rem);
}

.parallax__group {
  @apply relative preserve-3d transition-transform duration-500;
  height: 100vh;
}

.parallax__layer {
  @apply absolute top-0 right-0 bottom-0 left-0;
}

.parallax__layer--base {
  transform: translateZ(0);
}

.parallax__layer--back {
  transform: translateZ(-1px) scale(2);
}

.fade-enter-active {
  transition: opacity 2s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
