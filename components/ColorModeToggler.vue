<script lang="ts" setup>
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button @click="toggleColorMode">
    <Icon
      :class="
        colorMode.value === 'dark'
          ? 'i-material-symbols-dark-mode-outline'
          : 'i-material-symbols-light-mode-outline'
      "
    />
  </button>
</template>
