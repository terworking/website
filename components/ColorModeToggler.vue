<script lang="ts" setup>
const colorModes = [
  ['system', 'i-material-symbols-computer-outline-rounded'],
  ['dark', 'i-material-symbols-dark-mode-outline'],
  ['light', 'i-material-symbols-light-mode-outline'],
]

const colorMode = useColorMode()
const currentColorMode = computed(() => {
  const index = colorModes.findIndex(
    ([value]) => colorMode.preference === value
  )

  return { index, icon: colorModes[index][1] }
})

const toggleColorMode = () => {
  colorMode.preference =
    colorModes[(currentColorMode.value.index + 1) % colorModes.length][0]
}
</script>

<template>
  <button
    class="color-mode-toggler hidden lg:block relative w-8 h-8 md:(w-10 h-10)"
    aria-label="Toggle Color Mode"
    @click="toggleColorMode"
  >
    <Transition name="color-mode-toggler">
      <Icon :key="$colorMode.preference" :class="currentColorMode.icon" />
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
