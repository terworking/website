<script setup lang="ts">
const properties = defineProps({
  path: { default: () => useRoute().path, type: String },
});

const items = properties.path.split('/');
const itemsHref = items.map((_item, index) =>
  items.slice(0, index + 1).join('/')
);
</script>

<template>
  <ul inline-flex>
    <template v-for="(item, index) of items" :key="index">
      <template v-if="item !== ''">
        <li font-semibold hover:underline>
          <NuxtLink :to="itemsHref[index]" active-class="underline">
            {{ item }}
          </NuxtLink>
        </li>
        <li v-if="index < items.length - 1" opacity-50 px-2>/</li>
      </template>
    </template>
  </ul>
</template>
