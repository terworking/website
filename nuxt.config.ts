import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ['@/assets/css/main.css'],
  modules: [
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-lodash',
  ],
  experimental: {
    reactivityTransform: true,
  },
  colorMode: {
    fallback: 'dark',
    classSuffix: '',
  },
  lodash: {
    exclude: ['now'], // I need useNow from vueuse
  },
  unocss: {
    preflight: true,
  },
})
