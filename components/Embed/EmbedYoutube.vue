<script setup lang="ts">
interface Properties {
  id: string;
  thumbnail?: string;
}

const properties = defineProps<Properties>();

const loaded = ref(false);
const data = computed(() => {
  const { id, thumbnail } = properties as Properties;
  return {
    source: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
    thumbnail: useImageProxy({
      output: 'webp',
      q: 80,
      url: thumbnail ?? `https://i3.ytimg.com/vi/${id}/hqdefault.jpg`,
    }),
  };
});
</script>

<template>
  <div relative inline-block overflow-hidden card>
    <img
      absolute
      inset-0
      w-full
      h-full
      object-cover
      loading="lazy"
      :src="data.thumbnail"
      :alt="`${id} thumbnail`"
    />
    <div v-if="loaded" absolute inset-0>
      <iframe
        w-full
        h-full
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="true"
        :src="data.source"
      />
    </div>
    <div
      v-else
      id="play"
      flex
      items-center
      justify-center
      absolute
      inset-0
      cursor-pointer
      backdrop-brightness="md:80 hover:100"
      dark:backdrop-brightness="60 md:40 hover:60"
      transition-backdrop-filter-400
      @click="loaded = true"
    >
      <button
        aria-label="play"
        class="play"
        i-ci-play-circle-filled
        h-30
        w-30
        text-red="700 dark:600"
        transition-color-200
        ease
      />
    </div>
  </div>
</template>

<style scoped>
#play:hover .play {
  color: white;
}
</style>
