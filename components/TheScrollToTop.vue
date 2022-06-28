<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

const headerSize = useHeaderSize();

const scrollToTop = () =>
  defaultWindow?.scrollTo({ behavior: 'smooth', top: 0 });
</script>

<template>
  <div
    :style="{
      height: `${headerSize.height.rem}rem`,
    }"
    flex
    items-center
    justify-center
    w-full
  >
    <div
      inline-flex
      space-x-2
      p="y-2 x-4"
      items-center
      bg-body
      border="~ card dashed"
      cursor-pointer
      select-none
      @click="scrollToTop"
    >
      <span i-ci-circle-chevron-up m-0></span>
      <span font-semibold>Scroll to top</span>
    </div>
  </div>
</template>
