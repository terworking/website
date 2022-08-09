<script lang="ts" setup>
const imageIndex = ref(0)
const { width } = useWindowSize()
const bannerSrc = computed(() => `/banner/${imageIndex.value}?w=${width.value}`)
</script>

<template>
  <ClientOnly>
    <div id="header-banner" class="relative overflow-hidden">
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
      <img
        class="w-full h-84 md:h-128 object-cover filter-brightness-50 dark:filter-brightness-40"
        :src="bannerSrc"
        alt="BANNER IMAGE"
      />
      <div
        class="flex flex-col absolute inset-0 text-cyan-2 py-48 md:py-52 px-6 md:px-24 lg:px-36 pointer-events-none"
      >
        <h1 class="text-lg md:text-2xl lg:text-4xl font-semibold">
          Website TEROWROROKING
        </h1>
        <p>website terowrororkwing websitew tewrorrkisng website terwwprlomg</p>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
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
