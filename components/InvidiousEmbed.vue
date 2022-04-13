<script lang="ts" setup>
const { instance, videoId } =
  defineProps<{ instance: string; videoId: string }>();

const embed = `https://${instance}/embed/${videoId}?autoplay=0&local=true&player_style=youtube&quality=dash`;
</script>

<template>
  <iframe :src="embed" frameborder="0" allowfullscreen> </iframe>
</template>
