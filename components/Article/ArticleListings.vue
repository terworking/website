<script setup lang="ts">
import type { FlatNavigation } from '~~/types/content';

const properties = defineProps({
  path: { default: () => useRoute().path, type: String },
  value: { required: true, type: Object as () => FlatNavigation[] },
});

const navigation = computed(() => {
  return properties.value
    .filter(
      ({ _path }) =>
        _path.startsWith(properties.path) && _path !== properties.path
    )
    .filter(
      // don't list subdirectory items if the subdirectory is there
      ({ _path, description }, index, array) =>
        // description is undefined on subdirectory
        // this will make sure the subdirectory is listed
        (description === undefined &&
          array.findIndex(
            ({ description, _path: step }) =>
              description === undefined && _path.startsWith(step)
          ) === index) ||
        !array.some(
          ({ description, _path: step }) =>
            description === undefined && _path.startsWith(step)
        )
    )
    .sort((a, b) => {
      if (a.description === undefined && b.description !== undefined) {
        return -1;
      } else if (b.description === undefined) {
        return 1;
      } else {
        return 0;
      }
    });
});

const pathIsComplete = computed(() => {
  const lastPath = [...properties.path.split('/')].reverse()[0];
  return navigation.value.some(
    (it) => [...it._path.split('/')].reverse()[1] === lastPath
  );
});

const title = computed(() => useTitleTemplate(`${properties.path} Navigation`));

// @ts-expect-error nuxt type error
useHead({ title });
</script>

<template>
  <div>
    <AppBreadcrumbs p="x-4 y-2" :show-lash-path="pathIsComplete" />
    <nav card bg-body_b>
      <template v-if="navigation.length > 0">
        <ArticleListingsItem
          v-for="(item, index) of navigation"
          :key="index"
          :value="item"
        />
      </template>
      <template v-else>
        <div flex="~ col" justify-center items-center h-96 w-full>
          <div font-semibold opacity-75 text="3xl md:4xl">404 NOT FOUND</div>
          <button btn-primary m="t-4 md:b-12" @click="$router.back">
            Go Back
          </button>
        </div>
      </template>
    </nav>
  </div>
</template>
