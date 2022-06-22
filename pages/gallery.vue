<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

import PhotoSwipe from 'photoswipe';
import type PhotoSwipeLightBoxType from 'photoswipe/dist/types/lightbox/lightbox';
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/33079
import PhotoSwipeLightBox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

definePageMeta({
  title: 'Gallery',
});

// gallery implementation:
// https://github.com/xieranmaya/blog/issues/6
const { data: _data, pending } = useLazyFetch('/api/gallery');

const data: typeof _data = ref([]);
const dataLength = computed(() => data.value.length);
watch(
  pending,
  (value) => {
    if (!value) {
      data.value.push(..._data.value.slice(0, 14));
    }
  },
  { immediate: true }
);

useInfiniteScroll(
  defaultWindow,
  () => {
    data.value.push(
      ..._data.value.slice(dataLength.value, dataLength.value + 6)
    );
  },
  { distance: 200 }
);

const gallery = ref<HTMLDivElement>();
const lightbox = ref<PhotoSwipeLightBoxType>();
onMounted(() => {
  if (lightbox.value === undefined) {
    // https://photoswipe.com/options/
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    lightbox.value = new PhotoSwipeLightBox({
      children: 'a',
      gallery: '#gallery',
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

    lightbox.value.addFilter('thumbEl', (thumbnail, _, index) => {
      const candidate = gallery.value?.querySelector(
        `[data-id="${index}"] img`
      );

      return (candidate ? candidate : thumbnail) as HTMLElement;
    });
    lightbox.value.addFilter('numItems', () => _data.value.length);
    lightbox.value.addFilter('itemData', (_, index) => {
      if (index > dataLength.value - 1) {
        data.value.push(..._data.value.slice(dataLength.value, index + 1));
      }

      const {
        height,
        path,
        thumbnail: { path: msrc },
        width,
      } = data.value[index];
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
  <div id="gallery" ref="gallery" flex="~ wrap">
    <ClientOnly>
      <a
        v-for="({ thumbnail, ...original }, index) of data"
        :key="index"
        :data-id="index"
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
          :style="{
            'padding-bottom': `${(thumbnail.height / thumbnail.width) * 100}%`,
          }"
        />
        <img absolute top-0 w-full align-bottom :src="thumbnail.path" alt="" />
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
