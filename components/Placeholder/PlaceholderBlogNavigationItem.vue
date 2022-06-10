<script setup lang="ts">
const heading = randomInt(50, 95),
  paragraphs = Array.from({ length: 2 }).flatMap(() =>
    distribute(randomInt(2, 5), 90)
  );
</script>

<template>
  <ClientOnly>
    <div card m-4 aria-hidden="true">
      <PlaceholderImage h-48 />
      <div p-6>
        <PlaceholderHeading :value="heading" />
        <PlaceholderParagraph :value="paragraphs" />
      </div>
    </div>
  </ClientOnly>
</template>
