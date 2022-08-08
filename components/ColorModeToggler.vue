<script lang="ts" setup>
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="relative w-8 h-8"
    id="color-mode-toggler"
    @click="toggleColorMode"
  >
    <Transition name="color-mode-toggler">
      <Icon
        v-if="colorMode.value === 'dark'"
        class="i-material-symbols-dark-mode-outline"
      />
      <Icon v-else class="i-material-symbols-light-mode-outline" />
    </Transition>
  </button>
</template>

<style scoped>
#color-mode-toggler > * {
  position: absolute;
  inset: 0;
  transition: transform 200ms cubic-bezier(0.77, 0, 0.175, 1);
}

.color-mode-toggler-enter-from,
.color-mode-toggler-leave-to {
  transform: scale(0);
}
</style>
