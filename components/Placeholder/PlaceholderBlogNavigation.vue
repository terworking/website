<script setup lang="ts">
const count = randomInt(2, 3);
</script>

<template>
  <div>
    <AppBreadcrumbs p="x-4 y-2" />
    <nav card bg-body>
      <PlaceholderBlogNavigationItem
        v-for="(_, index) of Array.from({ length: count })"
        :key="index"
      />
    </nav>
  </div>
</template>
