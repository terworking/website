<script setup lang="ts">
import { defaultDocument } from '@vueuse/core';
import { Member } from '~~/types/terworking';

const properties = defineProps<{
  value: Member;
  reverse: boolean;
}>();

const avatarSmall = computed(() =>
  useImageProxy({
    filename: properties.value.name,
    h: 120,
    output: 'webp',
    url: properties.value.avatar,
  })
);
const quote = computed(
  () => properties.value.quote?.replace(/(\.)|(?!\.)$/, '.') // add dot at the end of quote
);

const downloadLock = ref(false);
const downloadAvatar = async () => {
  if (downloadLock.value) return;
  else downloadLock.value = true;

  const a = defaultDocument?.createElement('a');
  if (a) {
    const avatar = await fetch(properties.value.avatar);
    const blob = await avatar.blob();
    const url = URL.createObjectURL(blob);
    a.download = properties.value.name;
    a.href = url;
    a.click();
  }

  downloadLock.value = false;
};
</script>

<template>
  <figure
    card
    md:mx-12
    :class="{ reverse }"
    w="full sm:3/4 md:1/2"
    flex
    justify-center
    space-x-6
    p-4
  >
    <img
      title="click to download"
      h="16 md:20"
      w="16 md:20"
      rounded-full
      border="~ card"
      cursor-pointer
      loading="lazy"
      :src="avatarSmall"
      :alt="value.name"
      @click="downloadAvatar"
    />
    <div flex="~ col" justify-center space-y-2 sm:w-full>
      <figcaption>
        <NuxtLink font-semibold hover:underline :to="value.instagram">
          {{ value.name }}
        </NuxtLink>
      </figcaption>
      <blockquote v-if="quote">
        <p text-xs sm:text-sm>
          "
          <span>{{ quote }}</span>
          "
        </p>
      </blockquote>
    </div>
  </figure>
</template>

<style scoped>
figure.reverse {
  --at-apply: self-end flex-row-reverse space-x-reverse;
}

:is(figcaption, blockquote) {
  --at-apply: text-center;
}

@media (min-width: 768px) {
  figure {
    transform: scale(1.2);
    transition-property: transform, margin;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    transition-duration: 500ms;
  }

  figure:hover {
    --at-apply: mx-18;
    transform: scale(1.4);
    z-index: 1;
  }

  :is(figcaption, blockquote) {
    --at-apply: text-start;
  }

  .reverse :is(figcaption, blockquote) {
    --at-apply: text-end;
  }
}
</style>
