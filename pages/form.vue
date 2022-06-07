<script setup lang="ts">
import { reset as resetForm, submitForm, FormKitNode } from '@formkit/core';
import { createInput } from '@formkit/vue';

import FormCropperVue from '~~/components/FormCropper.vue';
import FormInstagramInputVue from '~~/components/FormInstagramInput.vue';

const cropper = createInput(FormCropperVue);
const instagram = createInput(FormInstagramInputVue);

definePageMeta({
  title: 'Form',
});

const { isOpen } = useFormStatus();
const { member } = useTerworking();
const { data: names, refresh: refreshNames } = useAsyncData(
  'form',
  async () => {
    if (!isOpen) return;

    const response = await $fetch('/api/member', { params: { pick: 'name' } });

    if (typeof response === 'string' || response.length === member.length)
      return;

    return member.map(({ name }) => ({
      attrs: { disabled: response.some((it) => it.name === name) },
      label: name,
      value: name,
    }));
  }
);

const loading = ref(false);
const success = ref(false);
const closed = computed(() => names.value === undefined);
const disabled = computed(() => loading.value || closed.value);

const reset = async () => {
  resetForm('form');
  await refreshNames();
};

const showAlert = ref(false);
const alertDescription = ref('');
const closeAlert = () => {
  showAlert.value = false;
};
const closeAlertWithReset = async () => {
  closeAlert();
  await reset();
};
const alertProperties = computed(() => {
  return success.value
    ? {
        button: { primary: 'OK' },
        options: { closeOnClickOutside: true },
        title: 'Success',
        type: 'success' as const,
      }
    : {
        button: { primary: 'RESET', secondary: 'CLOSE' },
        description: alertDescription.value,
        onClickSecondary: closeAlert,
        title: 'Failed',
        type: 'error' as const,
      };
});

const submit = async (body: unknown) => {
  loading.value = true;

  const response = await $fetch('/api/form', {
    body: body as never,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  success.value = response === 'OK';
  alertDescription.value = response;

  showAlert.value = true;
  await until(showAlert).toBe(false);

  loading.value = false;
};

const validateInstagram = ({ value }: FormKitNode) => {
  const re = [
    new RegExp(/^\w(?!.*?\.{2})[\w.]{1,28}\w$/),
    new RegExp(/\D/), // https://stackoverflow.com/a/64910992
  ];

  return re.every((re) => re.test(value as string));
};
</script>

<template>
  <div max-w-xl md="mx-auto px-10" :class="{ 'cursor-not-allowed': disabled }">
    <AppAlert
      :show="showAlert"
      v-bind="alertProperties"
      @click-primary="closeAlertWithReset"
      @close="closeAlertWithReset"
    />
    <div v-if="disabled" fixed z-99 w-full h-full cursor-not-allowed></div>
    <FormKit
      id="form"
      :actions="false"
      :disabled="disabled"
      type="form"
      mt-5
      p="x-5 t-5"
      @submit="submit"
    >
      <h1 font-semibold text-5xl text-center mb-4>Form</h1>
      <FormKit
        type="select"
        label="Name"
        name="name"
        validation="required"
        placeholder="Select your name"
        :options="names ?? []"
      ></FormKit
      ><FormKit
        type="text"
        label="Quote"
        name="quote"
        placeholder="Type your quote"
        validation="length:0,50"
      ></FormKit
      ><FormKit
        :type="instagram"
        label="Instagram"
        name="instagram"
        placeholder="Type your username"
        validation="validateInstagram"
        :validation-rules="{ validateInstagram }"
        :validation-messages="{
          validateInstagram: 'Your username is invalid',
        }"
      ></FormKit
      ><FormKit
        :type="cropper"
        inner-class="$reset rounded-lg mb-1"
        outer-class="overflow-x-auto"
        label="Image"
        name="avatar"
        validation="required"
      ></FormKit>
    </FormKit>
    <div flex p="x-5 b-5" space-x-5>
      <AppButton
        :disabled="disabled"
        :class="{ 'remove-before': closed }"
        flex-1
        before="content-none mr-0 h-5 w-0 border-2 border-transparent rounded-full transition-margin-500"
        disabled:before="mr-3 w-5 border-current border-r-transparent animate-spin"
        @click="submitForm('form')"
      >
        {{ loading ? 'Submitting...' : 'Submit' }}
      </AppButton>
      <AppButton
        :disabled="disabled"
        px-4
        class="!bg-transparent !text-body"
        :class="{ '!text-opacity-50': disabled }"
        @click="reset"
      >
        Reset
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.remove-before:before {
  content: none;
}
</style>
