<script setup lang="ts">
import { Buffer } from 'buffer';
import type { FormKitFrameworkContext } from '@formkit/core';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import type { CropperResult } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';

const properties = defineProps<{ context: FormKitFrameworkContext }>();
const disabled = toRef(properties.context, 'disabled');

const image = ref('');
const fileInputOnChange = (event: Event) => {
  if (event.target instanceof HTMLInputElement && event.target.files) {
    const file = event.target.files[0];

    if (image.value !== '') URL.revokeObjectURL(image.value);

    image.value = URL.createObjectURL(file);

    // Reset the value to reset
    // the 'onchange' event
    event.target.value = '';
  }
};

const cropperOnChange = ({ canvas }: CropperResult) => {
  if (canvas !== undefined) {
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const arrayBuffer = await blob.arrayBuffer();
          const result = Buffer.from(arrayBuffer).toString('base64');
          properties.context.node.input(result);
        }
      },
      'image/webp',
      75
    );
  }
};

const { dirty, submitted, valid } = toRefs(properties.context.state);
watch(dirty, (dirty) => {
  // Also reset cropper image when the form got reset
  if (!dirty && image.value !== '') image.value = '';
});

const fileInput = ref<HTMLInputElement>();
const triggerInput = () => {
  fileInput.value?.dispatchEvent(new MouseEvent('click'));
};

const cropperContainer = ref<HTMLDivElement>();
const pointer = reactive(usePointer({ target: cropperContainer }));

const withinFocus = computed(
  () =>
    !(disabled.value as boolean) &&
    pointer.isInside &&
    pointer.pressure !== 0 &&
    image.value
);
const disabledPointerNone = computed(() => {
  if (disabled.value as boolean) return '!pointer-events-none';
});
</script>

<template>
  <div
    ref="cropperContainer"
    relative
    rounded-lg
    border="~ gray-400"
    :class="{
      '!border-red': submitted && !valid,
      '!border-accent': withinFocus,
      'children:opacity-50': disabled,
    }"
  >
    <Cropper
      ref="cropper"
      class="h-24 mx-auto transition-height-333"
      :boundaries-class="disabledPointerNone"
      :background-class="'bg-secondary rounded-lg ' + disabledPointerNone"
      :foreground-class="'rounded-lg ' + disabledPointerNone"
      :src="image"
      :class="{ 'h-96': image }"
      :stencil-component="CircleStencil"
      :stencil-size="{
        width: 300,
        height: 300,
      }"
      :stencil-props="{
        handlers: {},
        movable: false,
        scalable: false,
        aspectRatio: 1,
      }"
      :resize-image="{
        adjustStencil: false,
      }"
      image-restriction="stencil"
      @change="cropperOnChange"
    />
    <div
      absolute
      bottom-0
      flex
      items-center
      justify-center
      h-24
      w-full
      :class="{
        '!hover:children:border-accent': !disabled,
        'pointer-events-none': image,
        'cursor-pointer': !image,
      }"
      @click="!image ? triggerInput() : 0"
    >
      <div
        :class="{
          'cursor-pointer': !disabled,
        }"
        relative
        flex
        items-center
        justify-center
        w-25
        h-10
        rounded-lg
        pointer-events-auto
        bg="secondary !opacity-80"
        border="2 dotted primary"
        @click="image ? triggerInput() : 0"
      >
        <span font-semibold select-none>Browse</span>
        <input
          :id="context.id"
          ref="fileInput"
          :name="context.node.name"
          :disabled="(disabled as boolean)"
          type="file"
          accept="image/*"
          absolute
          h-0
          opacity-0
          @blur="context.handlers.blur"
          @change="fileInputOnChange"
        />
      </div>
    </div>
  </div>
</template>

<style>
.vue-advanced-cropper__image-wrapper {
  --at-apply: rounded-lg;
}
</style>
