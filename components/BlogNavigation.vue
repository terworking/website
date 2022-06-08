<script setup lang="ts">
import type { FlatNavigation, Navigation } from '~~/typings/content';

const properties = defineProps({
  path: { default: () => useRoute().path, type: String },
});

const { data, pending } = await useLazyAsyncData<Navigation[]>(
  'blog-navigation',
  () => fetchContentNavigation()
);

const { path } = toRefs(properties);
const navigation = computed(() => {
  if (pending.value)
    return Array.from({ length: randomInt(2, 3) }) as undefined[];

  // https://stackoverflow.com/a/54245371
  const transform1 = ({ children = [], ...rest }: Navigation) => [
    { ...rest },
    ...transformAll(children),
  ];

  // https://stackoverflow.com/a/54245371
  const transformAll = (children: Navigation[] = []): FlatNavigation[] =>
    children.flatMap((c) => transform1(c));

  return transformAll(data.value)
    .filter(({ _path }) => _path.startsWith(path.value) && _path !== path.value)
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
  return navigation.value.some((it) =>
    it === undefined ? true : [...it._path.split('/')].reverse()[1] === lastPath
  );
});
</script>

<template>
  <div>
    <AppBreadcrumbs p="x-4 y-2" :show-lash-path="pathIsComplete" />
    <nav card bg-body>
      <template v-if="navigation.length > 0">
        <template v-for="(item, index) of navigation" :key="index">
          <BlogNavigationItem v-if="item" :value="item" />
          <PlaceholderBlogNavigationItem v-else />
        </template>
      </template>
      <template v-else>
        <div flex="~ col" justify-center items-center h-96 w-full>
          <div font-semibold opacity-75 text="3xl md:4xl">404 NOT FOUND</div>
          <AppButton m="t-4 md:b-12" @click="$router.back">Go Back</AppButton>
        </div>
      </template>
    </nav>
  </div>
</template>
