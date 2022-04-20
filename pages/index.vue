<script setup lang="ts">
const target = ref(null);
const parallax = reactive(useParallax(target));
const breakpoints = useBreakpoints({ md: 768 });
const tablet = breakpoints.greater('md');

const titleStyle = computed(() => {
  // Only enable parallax on tablet or higher
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

const _cycleBannerImage = (reverse: boolean) => {
  const _bannerImages = [...bannerImages];
  if (reverse) {
    _bannerImages.reverse();
  }

  bannerImage.value =
    _bannerImages[
      (_bannerImages.indexOf(bannerImage.value) + 1) % _bannerImages.length
    ];
};

let intervalHandler;
onMounted(() => {
  // Automatically cycle banner image every 15 seconds
  intervalHandler = setInterval(_cycleBannerImage, 15000);
});

const cycleBannerImage = (reverse: boolean) => {
  // Disable automatic banner images cycle
  // if user clicks the next or prev button
  clearInterval(intervalHandler);

  _cycleBannerImage(reverse);
};

definePageMeta({
  name: 'home',
  weight: -1,
  title: 'Home',
});
</script>

<template>
  <div>
    <div
      ref="target"
      class="flex overflow-hidden relative m-2 md:m-4 bg-black rounded-lg select-none md:h-[calc(100vh-8rem)]"
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
        class="flex items-center dark:bg-slate-900/25 md:perspect-524px absolute top-0 left-0 h-full w-full"
      >
        <span
          :style="titleStyle"
          class="banner-text border py-2 px-4 md:py-4 mx-auto text-center text-xl md:text-4xl"
        >
          WELCOME TO OUR WEBSITE
        </span>
      </div>
      <div
        class="flex justify-between items-end absolute top-0 left-0 h-full w-full children:(text-sm md:text-md px-3 py-2 border-t)"
      >
        <button
          @click="cycleBannerImage(true)"
          class="banner-text border-r rounded-tr-lg"
        >
          Prev
        </button>
        <button
          @click="cycleBannerImage(false)"
          class="banner-text border-l rounded-tl-lg"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-text {
  @apply text-amber-200  border-amber-100 font-extrabold text-white bg-black/25 backdrop-filter backdrop-brightness-50 backdrop-blur-sm;
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
