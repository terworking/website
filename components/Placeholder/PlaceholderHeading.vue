<script setup lang="ts">
defineProps<{ value: number }>();
</script>

<template>
  <span text-4xl content-placeholder :style="{ width: value + '%' }" />
</template>
