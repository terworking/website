<script setup lang="ts">
import { defaultWindow } from '@vueuse/core';

import { GraphcommentParameters } from '~~/types/graphcomment';

const properties = defineProps<{ disabled?: boolean }>();

const loaded = ref(false);
const show = ref(false);

const { path } = useRoute();
const graphcomment = ref<HTMLDivElement>();
const { y: scrollY } = useScroll(defaultWindow);

const loadGraphcomment = (identifier: string, theme?: string) => {
  const config = useRuntimeConfig();

  const graphcommentParameters = {
    disable_ads: true,
    graphcomment_id: config.public.graphcommentId,
    theme,
    uid: identifier,
  } as GraphcommentParameters;

  window.graphcomment(graphcommentParameters);
};

const { value: colorMode } = toRefs(useColorMode());
watch(colorMode, (value) => {
  if (show.value && loaded.value) {
    const [firstGcIframe, secondGcIframe] = graphcomment.value
      ?.childNodes as NodeListOf<HTMLIFrameElement>;

    // hide current graphcomment instance and
    // load another graphcomment instance
    // so we can easily change graphcomment theme
    if ((graphcomment.value?.childElementCount ?? 0) < 2) {
      firstGcIframe.style.display = 'none';
      loadGraphcomment(path, value);
      return;
    }

    for (const gcIframe of [firstGcIframe, secondGcIframe]) {
      gcIframe.style.display = gcIframe.src.includes(value) ? 'block' : 'none';
    }
  }
});

const graphcommentSource = 'https://graphcomment.com/js/integration.js';
onMounted(() => {
  // this prevents duplicate script element
  if (document.head.querySelector(`[src="${graphcommentSource}"`)) {
    loaded.value = true;
  }
});

const { stop } = useIntersectionObserver(
  graphcomment,
  ([{ isIntersecting }]) => {
    if (properties.disabled === true) {
      stop();
      return;
    }

    if (isIntersecting && scrollY.value >= (defaultWindow?.innerHeight ?? 0)) {
      if (!loaded.value) {
        const graphcommentScript = document.createElement('script');
        graphcommentScript.async = true;
        graphcommentScript.type = 'text/javascript';
        graphcommentScript.addEventListener('load', () => {
          loaded.value = true;
          loadGraphcomment(path, colorMode.value);
        });
        graphcommentScript.src = graphcommentSource;

        document.head.append(graphcommentScript);
      } else {
        loadGraphcomment(path, colorMode.value);
      }

      // stop the observer after
      // graphcomment is loaded
      stop();
    }
  }
);
</script>

<template>
  <div card p="x-2 y-6">
    <template v-if="!disabled">
      <div v-if="show" id="graphcomment" ref="graphcomment"></div>
      <AppButton v-else block m-auto @click="show = true">
        Load Comments
      </AppButton>
    </template>
    <AppButton v-else block m-auto disabled> Comments is disabled </AppButton>
  </div>
</template>
