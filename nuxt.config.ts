import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  colorMode: {
    classSuffix: '',
    fallback: 'system',
  },
  content: {
    highlight: { theme: 'css-variables' },
    navigation: {
      fields: ['description', 'image'],
    },
    sources: [
      {
        base: 'content',
        driver: 'fs',
        name: 'article',
        prefix: '/article',
      },
    ],
  },
  css: ['~~/assets/css/main.css', 'hint.css'],
  lodash: {
    exclude: ['now'], // I need useNow from vueuse
  },
  modules: [
    '@formkit/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-lodash',
  ],
  runtimeConfig: {
    public: {
      graphcommentId: '',
    },
  },
  typescript: { shim: false, strict: true, typeCheck: true },
  unocss: {
    preflight: true,
  },
});
