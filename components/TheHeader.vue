<script lang="ts" setup>
const { showHeaderMenu } = useGlobalState()
</script>

<template>
  <header class="relative h-[calc(100vh-4rem)] overflow-hidden">
    <TheHeaderBanner />
    <TheHeaderHeading />
    <TheHeaderMenu :show="showHeaderMenu" />
    <TheHeaderTop />
  </header>
</template>
