<template>
  <button
    class="color-mode-toggler hidden lg:block relative w-8 h-8 md:(w-10 h-10)"
    aria-label="Toggle Color Mode"
    @click="
      $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'
    "
  >
    <Transition name="color-mode-toggler">
      <Icon
        :key="$colorMode.preference"
        :class="
          $colorMode.value === 'dark'
            ? 'i-material-symbols-dark-mode-outline'
            : 'i-material-symbols-light-mode-outline'
        "
      />
    </Transition>
  </button>
</template>

<style scoped>
.color-mode-toggler > * {
  position: absolute;
  inset: 0;
  transition: transform 200ms cubic-bezier(0.77, 0, 0.175, 1);
}

.color-mode-toggler-enter-from,
.color-mode-toggler-leave-to {
  transform: scale(0);
}
</style>
