<script setup lang="ts">
defineProps({
  count: { default: randomInt(2, 3), type: Number },
});
</script>

<template>
  <ClientOnly>
    <div aria-hidden="true">
      <AppBreadcrumbs p="x-4 y-2" />
      <nav card bg-body>
        <PlaceholderBlogNavigationItem
          v-for="(_, index) of Array.from({ length: count })"
          :key="index"
        />
      </nav>
    </div>
  </ClientOnly>
</template>
