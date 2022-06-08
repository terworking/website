<script setup lang="ts">
const data = {
  heading: randomInt(50, 95),
  paragraphs: Array.from({ length: randomInt(3, 6) }).flatMap(() =>
    distribute(randomInt(2, 5), 90)
  ),
};
</script>

<template>
  <div aria-hidden="true">
    <AppBreadcrumbs p="x-4 y-2" />
    <div card>
      <PlaceholderImage h-64 />
      <div p="x-4 y-6">
        <PlaceholderHeading :value="data.heading" />
        <PlaceholderParagraph :value="data.paragraphs" />
      </div>
    </div>
  </div>
</template>
