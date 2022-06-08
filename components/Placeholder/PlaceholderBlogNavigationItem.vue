<script setup lang="ts">
const data = {
  heading: randomInt(50, 95),
  paragraphs: Array.from({ length: 2 }).flatMap(() =>
    distribute(randomInt(2, 5), 90)
  ),
};
</script>

<template>
  <div card m-4 aria-hidden="true">
    <PlaceholderImage h-48 />
    <div p-6>
      <PlaceholderHeading :value="data.heading" />
      <PlaceholderParagraph :value="data.paragraphs" />
    </div>
  </div>
</template>
