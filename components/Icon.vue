<script lang="ts" setup>
defineProps({
  darkenOnHover: {
    default: true,
  },
})
</script>

<template>
  <span
    :class="{ 'icon-darken-on-hover': darkenOnHover }"
    class="h-8 w-8 md:h-10 md:w-10"
  />
</template>

<style scoped>
.icon-darken-on-hover:hover {
  filter: brightness(0.7);
}
</style>
