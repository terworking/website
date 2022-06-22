<script setup lang="ts">
import { Toc } from '@nuxt/content/dist/runtime/types';

const properties = defineProps<{ value: Toc }>();

const expanded = ref(false);
</script>

<template>
  <div
    :aria-expanded="expanded"
    card
    overflow="x-auto y-scroll"
    w="full md:1/2"
  >
    <button
      :aria-expanded="expanded"
      sticky
      top-0
      bg-inherit
      flex
      justify-between
      items-center
      p="x-4 y-2"
      :class="{ 'py-4': expanded }"
      transition-padding-500
      w-full
      @click="expanded = !expanded"
    >
      <span select-none text-xl font-semibold>Table of Contents</span>
      <span class="chevron-icon" :class="{ expanded }" />
    </button>
    <Transition name="toc">
      <nav v-if="expanded" max-h-64>
        <ArticleTocItem :value="value.links" />
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.chevron-icon {
  --at-apply: i-ci-chevron-down m-0 p-4;
  transition-property: transform;
  transition-timing-function: cubic-bezier(1, 0, 0, 1);
  transition-duration: 0.5s;
}

.chevron-icon.expanded {
  transform: rotate(180deg);
}

.toc-enter-active,
.toc-leave-active {
  transition-property: max-height, padding;
  transition-timing-function: cubic-bezier(1, 0, 0, 1);
  transition-duration: 0.5s, 0.25s;
}

.toc-enter-from,
.toc-leave-to {
  max-height: 0;
  padding: 0;
}
</style>
