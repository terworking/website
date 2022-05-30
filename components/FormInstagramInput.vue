<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';

const properties = defineProps<{ context: FormKitFrameworkContext }>();

const inputStartsWithAtSign = computed(() =>
  (properties.context.value as string | undefined)?.startsWith('@')
);

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    const { value } = event.target;

    if (
      properties.context.value === undefined ||
      properties.context.value === ''
    ) {
      // Allow @ on 1st character
      properties.context.node.input(value.replace(/[^\w.@]/, ''));
    } else if (inputStartsWithAtSign.value ?? false) {
      // Drop the @ on 2nd character
      properties.context.node.input(value.slice(1));
    } else {
      // Drop all non-word and non-digit except for period (.)
      properties.context.node.input(value.replace(/[^\w.]/, ''));
    }
  }
};
</script>

<template>
  <div relative flex h-12>
    <Transition name="at-sign">
      <div
        v-if="!inputStartsWithAtSign"
        id="at-sign"
        flex
        items-center
        justify-center
        h-12
        w-14
        px-3
        font-semibold
        text-3xl
        border="r gray-400"
      >
        <span select-none :class="{ 'opacity-50': context.disabled }">@</span>
      </div>
    </Transition>
    <input
      :id="context.id"
      v-bind="context.attrs"
      :name="context.node.name"
      :disabled="context.disabled as boolean"
      :class="context.classes.input"
      :value="context._value"
      type="text"
      @blur="context.handlers.blur"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
#at-sign {
  transition-property: font-size, width;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 0.5s;
}

.at-sign-leave-active {
  border-color: transparent;
  transition-duration: 0.25s;
}

.at-sign-enter-from,
.at-sign-leave-to {
  font-size: 0;
  width: 0;
}

.at-sign-leave-to {
  position: absolute;
}
</style>
