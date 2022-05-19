import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  colorMode: {
    classSuffix: '',
    fallback: 'dark',
  },
  css: ['@/assets/css/main.css'],
  lodash: {
    exclude: ['now'], // I need useNow from vueuse
  },
  modules: [
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-lodash',
  ],
  unocss: {
    preflight: true,
  },
});
