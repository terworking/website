<script setup lang="ts">
const colorMode = useColorMode();
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <button
    aria-label="toggleColorMode"
    i-tabler-sun
    dark:i-tabler-moon
    text-accent
    @click="toggleColorMode"
  />
</template>
