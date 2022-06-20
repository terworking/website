<script setup lang="ts">
defineProps<{ value: number }>();
</script>

<template>
  <span text-4xl text-placeholder :style="{ width: value + '%' }" />
</template>
