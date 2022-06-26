<script setup lang="ts">
import { defaultWindow, isClient } from '@vueuse/core';

import PhotoSwipe from 'photoswipe';
import type PhotoSwipeLightBoxType from 'photoswipe/dist/types/lightbox/lightbox';
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/33079
import PhotoSwipeLightBox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

import { GalleryData } from '~~/types/gallery';

definePageMeta({
  title: 'Gallery',
});

// gallery implementation:
// https://github.com/xieranmaya/blog/issues/6
const { data: data_ } = await useFetch('/api/gallery', {
  default: () => [] as GalleryData[],
  key: 'gallery-data',
  server: false,
  transform: (value) =>
    value.map(({ height, path, width }) => {
      const thumbnailSize = useRuntimeConfig().public.galleryThumbnailSize;
      const [thumbnailHeight, thumbnailWidth] =
        height > width
          ? [thumbnailSize, width / (height / thumbnailSize)]
          : [height / (width / thumbnailSize), thumbnailSize];

      return {
        height,
        path,
        thumbnail: {
          height: thumbnailHeight,
          path: `${path}?thumbnail=1`,
          width: thumbnailWidth,
        },
        width,
      };
    }),
});

const data = ref(data_.value.slice(0, 21));

const loaded = ref<string[]>([]);
const loading = ref<string[]>([]);
watch(
  () => data.value.length,
  () => {
    if (isClient) {
      const filtered = data.value.filter(
        ({ thumbnail: { path } }) =>
          !(loaded.value.includes(path) || loading.value.includes(path))
      );

      for (const {
        thumbnail: { path },
      } of filtered) {
        const image = new Image();
        image.addEventListener('load', () => {
          loading.value.splice(loading.value.indexOf(path), 1);
          loaded.value.push(path);
        });
        image.src = path;
        loading.value.push(path);
      }
    }
  },
  { immediate: true }
);

useInfiniteScroll(
  defaultWindow,
  () => {
    data.value.push(
      ...data_.value.slice(data.value.length, data.value.length + 6)
    );
  },
  { distance: 200 }
);

const gallery = ref<HTMLDivElement>();
const items = ref<HTMLAnchorElement[]>([]);
const lightbox = ref<PhotoSwipeLightBoxType>();
onMounted(() => {
  if (lightbox.value === undefined) {
    // https://photoswipe.com/options/
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    lightbox.value = new PhotoSwipeLightBox({
      children: 'a',
      gallery: gallery.value,
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
    }) as PhotoSwipeLightBoxType;

    lightbox.value.on('uiRegister', () => {
      // https://photoswipe.com/adding-ui-elements/#adding-download-button
      lightbox.value?.pswp?.ui.registerElement({
        html: {
          inner:
            '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
          isCustomSVG: true,
          outlineID: 'pswp__icn-download',
        },
        isButton: true,
        name: 'download-button',
        onInit: (element, pswp) => {
          element.setAttribute('download', '');
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener');

          pswp.on('change', () => {
            element.setAttribute(
              'href',
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `${pswp.currSlide.data.src!}?download=1`
            );
          });
        },
        order: 8,
        tagName: 'a',
      });
    });

    lightbox.value.addFilter('numItems', () => {
      return data_.value.length; // use the real data length
    });
    lightbox.value.addFilter(
      'thumbEl',
      (_, __, index) =>
        items.value[
          // return the last item if it's overflowing
          Math.min(items.value.length - 1, index)
        ]
    );
    lightbox.value.addFilter('itemData', (_, index) => {
      const {
        height,
        path,
        thumbnail: { path: msrc },
        width,
        // always use the real (not-lazy) data
      } = data_.value[index];
      return { height, msrc, src: path, width };
    });

    lightbox.value.init();
  }
});

onUnmounted(() => {
  if (lightbox.value !== undefined) {
    lightbox.value.destroy();
    lightbox.value = undefined;
  }
});
</script>

<template>
  <div ref="gallery" flex="~ wrap">
    <ClientOnly>
      <a
        v-for="({ thumbnail, ...original }, index) of data"
        ref="items"
        :key="index"
        :data-pswp-src="original.path"
        :data-pswp-width="original.width"
        :data-pswp-height="original.height"
        target="_blank"
        :style="{
          'width': `${(thumbnail.width * 200) / thumbnail.height}px`,
          'flex-grow': (thumbnail.width * 200) / thumbnail.height,
        }"
        relative
        cursor-pointer
        m-1
      >
        <i
          block
          :class="{
            'content-placeholder animate-pulse': !loaded.includes(
              thumbnail.path
            ),
          }"
          :style="{
            'padding-bottom': `${(thumbnail.height / thumbnail.width) * 100}%`,
          }"
        />
        <img
          v-if="loaded.includes(thumbnail.path)"
          absolute
          top-0
          w-full
          align-bottom
          :src="thumbnail.path"
          alt="Our pictures"
        />
      </a>
    </ClientOnly>
  </div>
</template>

<style scoped>
#gallery::after {
  content: '';
  flex-grow: 999999999;
}
</style>
