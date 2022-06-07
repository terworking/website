<script setup lang="ts">
import type { FlatNavigation, Navigation } from '~~/typings/content';

const properties = defineProps({
  path: { default: () => useRoute().path, type: String },
});

const query = queryContent(properties.path);
const { data } = await useAsyncData<Navigation[]>(
  `navigation-${properties.path}`,
  () => fetchContentNavigation(query)
);

const navigation = computed(() => {
  // https://stackoverflow.com/a/54245371
  const transform1 = ({ children = [], ...rest }: Navigation) => [
    { ...rest },
    ...transformAll(children),
  ];

  // https://stackoverflow.com/a/54245371
  const transformAll = (children: Navigation[] = []): FlatNavigation[] =>
    children.flatMap((c) => transform1(c));

  return transformAll(data.value)
    .filter(
      ({ _path }) =>
        _path.startsWith(properties.path) && _path !== properties.path
    )
    .filter(
      // don't list subdirectory items if the subdirectory is there
      ({ _path, description }, _, array) =>
        // description is undefined on subdirectory
        // this will make sure the subdirectory is listed
        description === undefined ||
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
    ({ _path }) => [..._path.split('/')].reverse()[1] === lastPath
  );
});
</script>

<template>
  <nav card bg-body>
    <AppBreadcrumbs p="x-4 t-2" :show-lash-path="pathIsComplete" />
    <template v-if="navigation.length > 0">
      <BlogNavigationItem
        v-for="(item, index) of navigation"
        :key="index"
        :value="item"
      />
    </template>
    <template v-else>
      <div flex="~ col" justify-center items-center h-96 w-full>
        <div font-semibold opacity-75 text="3xl md:4xl">404 NOT FOUND</div>
        <AppButton m="t-4 md:b-12" @click="$router.back">Go Back</AppButton>
      </div>
    </template>
  </nav>
</template>
