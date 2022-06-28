<script setup lang="ts">
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

const loaded = [] as string[];
const { pause: pauseBannerPreload, resume: resumeBannerPreload } =
  watchPausable(currentIndex, (value) => {
    const preload = [-1, 1, 2]
      .map((v) => banners.value[wrapNumber(value + v, banners.value.length)])
      .filter(({ path }) => !loaded.includes(path));

    return Promise.all(
      preload.map(async (v) => {
        const image = new Image();
        image.addEventListener('load', () => loaded.push(v.path));
        image.src = v.path;
      })
    );
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
const { pause: pauseAutomaticBannerCycle, resume: resumeAutomaticBannerCycle } =
  useIntervalFn(cycleBanner, 10_000);

const bannerLeft = ref('0');
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
        } else {
          bannerLeft.value = '0';
        }
      }
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
  element.style.left = '0';
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
    dataSource: banners.value.map(({ path, ...rest }) => ({
      msrc: `${path}?thumbnail=1`,
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

    // Photoswipe will preload them
    pauseBannerPreload();
  });
  pswp.on('close', () => {
    photoswipeIsOpen.value = false;
    resumeAutomaticBannerCycle();
    resumeBannerPreload();
  });

  pswp.init();
};

const pageIsLeft = usePageLeave();
watch([pageIsLeft, photoswipeIsOpen], (value) => {
  value.some(Boolean)
    ? pauseAutomaticBannerCycle()
    : resumeAutomaticBannerCycle();
});

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
              :style="{ left: bannerLeft }"
            >
              <img
                :src="current.path"
                object-cover
                w-full
                h-full
                z-1
                alt="Banner"
              />
            </div>
          </Transition>
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
        <div w-full h-full divide="y-2 current dashed" bg-body>
          <section class="content">
            <h1 text-6xl mb-4 font-semibold>INDEX</h1>
            <p>
              Website ini dibuat untuk <b>mengenang masa sekolah</b> kita di
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >. Tidak terasa <b>3 tahun sudah berlalu</b> dan sekarang kita
              sudah harus berpisah agar bisa untuk melanjutkan hidup ke tahap
              berikutnya. Ada yang melanjutkan kuliah, ada yang langsung
              bekerja, bahkan ada juga yang langsung menikah. Bagaimanapun cara
              melanjutkannya, yang terpenting adalah
              <b>selalu mensyukurinya</b> dan jangan pernah berpikir untuk
              mengakhiri hidup yang telah diberi kepada kita ini, tidaklah ada
              masalah yang tidak memiliki jalan keluar.
            </p>
            <p>
              Semoga dengan perpisahan ini bisa dijadikan pelajaran untuk jangan
              terlalu banyak berpikir atau terlalu berpikir kedepan, kalau ada
              yang ingin disampaikan alangkah baiknya jika
              <b>segera disampaikan</b>
              kalau-kalau nanti tidak bisa bertemu secara langsung lagi. Kalau
              <b>menyampaikan secara online</b> pasti akan selalu terasa ada
              yang kurang
              <i>(kurang rasa, kurang dekat, kurang feeling, 愛は足りない？)</i
              >.
            </p>
            <p>
              Jangan lupa untuk selalu mengingat teman-teman
              <i
                >(teman satu kelompok, teman bersebelahan, teman dekat, sahabat,
                teman-teman-an, bestie, TTM, 恋人, BFFL, FOAF, FWB, OWF,
                ...lanjutkan)</i
              >, bagaimanapun juga mereka sudah mau menjadi teman kalian. Lalu
              jangan lupakan juga guru-guru yang sudah mengajar
              <i>(baca memberi nilai)</i>
              kepada kita, sebab tanpa mereka kita tidak akan bisa lulus dari
              sekolah
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >
              yang tercinta ini.
            </p>
            <p>
              Meskipun biaya yang sudah saya keluarkan di sekolah
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >
              yang tercinta ini tidak bisa dibilang sedikit
              <i>(karena masuk TKJ + bayar komite)</i>, saya
              <b>tetap cinta</b> pada sekolah
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >
              <i> (no homo, no endorse)</i>. Salah satu alasannya tentu saja
              karena berkat
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >
              lah saya bisa melanjutkan ke halaman
              <i>(baca jenjang)</i> berikutnya, lalu
              <NuxtLink
                class="smkn2kdglink"
                target="_blank"
                to="https://smkn2kandangan.sch.id/"
                >SMKN 2 KANDANGAN</NuxtLink
              >
              ini juga secara tidak langsung telah membuat saya sadar bahwa
              <b>tidak ada yang permanen dalam hidup ini</b>, semua hal memiliki
              waktu kadaluarsanya masing-masing, intinya usahakan untuk tidak
              terlalu banyak <b>membuang-buang waktu</b> saat melakukan sesuatu.
            </p>
            <p text-xl>
              <b>
                <i>TLDR (TooLong;DidntRead):</i> Tidak penting, hanya curhat.</b
              >
            </p>
          </section>
          <section class="content">
            <h2 text-6xl my-2 font-semibold>FEATURES</h2>
            <p>Website ini memiliki fitur-fitur berikut.</p>
            <ul>
              <li>
                <h3>
                  <NuxtLink to="/article">Article</NuxtLink>
                </h3>
                <p>
                  Halaman ini berisi artikel-artikel yang kami buat. Kedepannya
                  kami <i>mungkin</i> akan mengisinya dengan konten-konten yang
                  berhubungan dengan jurusan teknik komputer dan jaringan
                  <i>(Mikrotik, Debian, Linux, ...dst)</i>.
                </p>
              </li>
              <li>
                <h3>
                  <NuxtLink to="/birthday">Birthday (countdown)</NuxtLink>
                </h3>
                <p>
                  Seperti namanya, halaman ini berisi <i>countdown</i> atau
                  hitung mundur ulang tahun dari anggota-anggota
                  <i>(baca siswa-siswi)</i> kelas 12 TKJ angkatan 2021/2022.
                </p>
              </li>
              <li>
                <h3>
                  <NuxtLink to="/gallery">Gallery</NuxtLink>
                </h3>
                <p>
                  Halaman ini berisi foto-foto semasa sekolah di
                  <NuxtLink
                    class="smkn2kdglink"
                    target="_blank"
                    to="https://smkn2kandangan.sch.id/"
                    >SMKN 2 KANDANGAN</NuxtLink
                  >, kalau ingin foto yang bersangkutan dihapus silahkan hubungi
                  <NuxtLink underline to="https://wa.me/62887435034436"
                    >Yasser</NuxtLink
                  >
                  dengan <i>screenshot</i> foto yang ingin dihapus.
                </p>
              </li>
            </ul>
          </section>
          <section class="content">
            <h2 text-6xl my-2 font-semibold>YOUTUBE</h2>
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
.content {
  --at-apply: max-w-2xl mx-auto space-y-8 px-2 py-6 text-center text-lg;
}

ul {
  --at-apply: text-start;
}

ul > li {
  --at-apply: mb-6;
}

ul > li > h3 {
  --at-apply: text-5xl mb-2 underline;
}

.smkn2kdglink {
  --at-apply: underline underline-2 underline-dotted;
}

.banner-transition {
  transition-property: opacity, left;
  transition-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
  transition-duration: 0.5s;
}

.banner-enter-active {
  transition-duration: 0.2s;
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}

.banner-enter-from {
  left: 100% !important;
}

.banner-enter-from.reversed {
  left: -100% !important;
}

.banner-leave-to {
  left: -100% !important;
}

.banner-leave-to.reversed {
  left: 100% !important;
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
