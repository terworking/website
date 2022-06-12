<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

const header = useHeader();
const headerSize = useHeaderSize();

const { y: scrollY } = useScroll(defaultWindow);
const { height: windowHeight } = useWindowSize();
const show = computed(
  () => header.value.visible && scrollY.value > windowHeight.value * 2
);

const scrollToTop = () => window.scrollTo({ behavior: 'smooth', top: 0 });
</script>

<template>
  <Transition name="scroll-to-top">
    <div
      v-if="show"
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
  </Transition>
</template>

<style scoped>
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s, 0.5s;
}

.scroll-to-top-enter-from,
.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
