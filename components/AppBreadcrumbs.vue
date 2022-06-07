<script setup lang="ts">
const properties = defineProps({
  path: { default: () => useRoute().path, type: String },
  // show only if splitted path length exceed this number
  requiredLength: { default: 1, type: Number },
  showLashPath: { default: true, type: Boolean },
});

const { path, showLashPath } = toRefs(properties);

const items = computed(() => {
  const split = path.value.split('/').slice(1);

  return showLashPath.value === true ? split : split.slice(0, -1);
});

const itemsHref = computed(() =>
  items.value.map(
    (_item, index) => '/' + items.value.slice(0, index + 1).join('/')
  )
);
</script>

<template>
  <ul v-if="items.length > requiredLength" inline-flex select-none>
    <template v-for="(item, index) of items" :key="index">
      <li font-semibold hover:underline>
        <span v-if="path === itemsHref[index]" underline cursor-not-allowed>
          {{ item }}
        </span>
        <NuxtLink v-else :to="itemsHref[index]">
          {{ item }}
        </NuxtLink>
      </li>
      <li v-if="index < items.length - 1" opacity-50 px-2>/</li>
    </template>
  </ul>
</template>
