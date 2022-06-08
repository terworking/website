<script setup lang="ts">
defineProps<{ value: number[] }>();
</script>

<template>
  <p>
    <template v-for="(i, index) of value" :key="index">
      <span v-if="i > 15" content-placeholder :style="{ width: i + '%' }" />
    </template>
  </p>
</template>
