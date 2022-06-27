<script setup lang="ts">
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
    return data // only use landscape images
      .filter(({ height, width }) => width > height)
      .map(({ path }) => path);
  },
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

const onClickBannerCycle = (event: MouseEvent) => {
  if (!isSwiping.value) {
    manualBannerCycle(
      // reverse if clicked on 20% of window width from left
      (event.view?.innerWidth ?? 0) * 0.2 > event.x
    );
  }
};

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
          flex
          overflow-hidden
          relative
          select-none
          h-full
          @click="onClickBannerCycle"
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
            backdrop="brightness-80 dark:brightness-60"
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
            <p>Silahkan nikmati konten-konten Youtube <i>random</i> berikut.</p>
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
