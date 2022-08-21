<script lang="ts" setup>
const colorModes = [
  ['light', 'i-material-symbols-light-mode-outline'],
  ['system', 'i-material-symbols-computer-outline-rounded'],
  ['dark', 'i-material-symbols-dark-mode-outline'],
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
    class="color-mode-toggler relative w-7 h-7 md:(h-8 w-8)"
    aria-label="Toggle Color Mode"
    @click="toggleColorMode"
  >
    <Transition name="color-mode-toggler">
      <span :key="$colorMode.preference" :class="currentColorMode.icon" />
    </Transition>
  </button>
</template>

<style scoped>
.color-mode-toggler > * {
  position: absolute;
  height: inherit;
  width: inherit;
  inset: 0;
  transition: transform 200ms cubic-bezier(0.77, 0, 0.175, 1);
  transform: scale(1) translateY(calc(v-bind('currentColorMode.index') * 1px));
}

.color-mode-toggler-enter-from,
.color-mode-toggler-leave-to {
  transform: scale(0) translateY(calc(v-bind('currentColorMode.index') * -1px));
}
</style>
