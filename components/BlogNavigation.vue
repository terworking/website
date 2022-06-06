<script setup lang="ts">
import type { FlatNavigation, Navigation } from '~~/typings/content';

const route = useRoute();
const properties = defineProps<{ path?: string }>();
const path = properties.path ?? route.path.toString();

const query = queryContent(path);
const { data } = await useAsyncData<Navigation[]>(`navigation-${path}`, () =>
  fetchContentNavigation(query)
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
    .filter(({ _path }) => _path.startsWith(path) && _path !== path)
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
    );
});
</script>

<template>
  <nav card bg-body>
    <AppBreadcrumbs v-if="$route.path !== '/blog'" p="x-4 t-2" />
    <BlogNavigationItem
      v-for="(item, index) of navigation"
      :key="index"
      :value="item"
    />
  </nav>
</template>
