<script setup lang="ts">
import type { FormKitNode } from '@formkit/core';
import { reset as resetForm, submitForm } from '@formkit/core';
import { createInput } from '@formkit/vue';
import { Component } from '@nuxt/schema';
import type { H3Error } from 'h3';
import { FetchError } from 'ohmyfetch';
import { FormCropper } from '#components';

const cropper = createInput(FormCropper as unknown as Component);

definePageMeta({
  title: 'Form',
});

const { member } = useTerworking();
const { data: names, refresh: refreshNames } = await useAsyncData(
  'form-select',
  async () => {
    // fetch the inputted data till now
    const data = await $fetch('/api/member');

    return member.map(({ name }) => ({
      // disable the option if it's already been submitted
      attrs: { disabled: data.some((it) => it.name === name) },
      label: name,
      value: name,
    }));
  }
);

const loading = ref(false);
const success = ref(false);

const reset = async () => {
  resetForm('form');
  await refreshNames();
};

const showAlert = ref(false);
const alertDescription = ref('');
const closeAlert = () => (showAlert.value = false);
const closeAlertAndReset = async () => {
  closeAlert();
  await reset();
};
const alertProperties = computed(() => {
  const onClose = closeAlertAndReset,
    onClickPrimary = onClose,
    onClickSecondary = onClose;

  const properties = success.value
    ? {
        value: {
          button: { primary: 'OK' },
          options: { closeOnClickOutside: true },
          title: 'Success',
          type: 'success' as const,
        },
      }
    : {
        onClickSecondary: closeAlert,
        value: {
          button: { primary: 'RESET', secondary: 'CLOSE' },
          description: alertDescription.value,
          title: 'Failed',
          type: 'error' as const,
        },
      };

  return {
    onClickPrimary,
    onClickSecondary,
    onClose,
    ...properties,
  };
});

const submit = async (body: unknown) => {
  loading.value = true;

  const response = await $fetch('/api/submit', {
    body: body as never,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).catch((error) => (error as FetchError).data as H3Error);

  success.value = response === 'OK';
  if (typeof response !== 'string') {
    alertDescription.value = response.message;
  }

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
  <div m-auto max-w-2xl p="4 md:y-8">
    <AppAlert :show="showAlert" v-bind="alertProperties" />
    <template v-if="loading">
      <Body overflow-hidden />
      <div fixed z-100 inset-0 cursor-not-allowed></div>
    </template>
    <div card>
      <FormKit
        id="form"
        :actions="false"
        :disabled="loading"
        type="form"
        mt-6
        p="x-6 t-6"
        @submit="submit"
      >
        <h1 font-semibold text-5xl text-center mb-4>Form</h1>
        <FormKit
          type="select"
          label="Name"
          name="name"
          validation="required"
          placeholder="Select your name"
          label-class="required"
          :options="names ?? []"
        ></FormKit
        ><FormKit
          type="text"
          label="Quote (optional)"
          name="quote"
          placeholder="Type your kata-kata atau saran atau motivasi or quote"
          validation="length:0,50"
        ></FormKit
        ><FormKit
          type="text"
          label="Instagram (optional)"
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
          label="Image (boleh gambar anime)"
          name="avatar"
          validation="required"
          label-class="required"
        ></FormKit>
      </FormKit>
      <div flex p="x-6 b-6" space-x-6>
        <button
          flex-1
          btn-primary
          :disabled="loading"
          @click="submitForm('form')"
        >
          {{ loading ? 'Submitting...' : 'Submit' }}
        </button>
        <button :disabled="loading" btn-secondary @click="reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.required)::after {
  --at-apply: text-red-500;
  content: ' *';
}
</style>
