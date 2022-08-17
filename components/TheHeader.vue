<script lang="ts" setup>
const { showHeaderMenu } = useGlobalState()
const {
  public: { headerHeading, headerParagraph },
} = useRuntimeConfig()
</script>

<template>
  <header class="relative h-[calc(100vh-4rem)]">
    <TheHeaderBanner class="z-1" />
    <div
      class="absolute w-full px-1/16 md:px-1/12 top-4/5 text-center md:(text-start text-cyan-2) pointer-events-none"
    >
      <h1 class="text-3xl md:text-4xl header-text">{{ headerHeading }}</h1>
      <p class="text-sm md:text-base header-text">{{ headerParagraph }}</p>
    </div>
    <TheHeaderMenu :show="showHeaderMenu" />
    <TheHeaderTop />
  </header>
</template>

<style scoped>
.header-text {
  --at-apply: font-semibold;
}

@media (min-width: 768px) {
  .header-text {
    text-shadow: 1px -1px 10px theme('colors.zinc.900'),
      -1px 1px 10px theme('colors.zinc.900');
  }
}
</style>
