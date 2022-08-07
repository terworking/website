import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@nuxtjs/color-mode'],
  colorMode: {
    dataValue: 'theme',
    classSuffix: '',
    fallback: 'dark',
  },
  unocss: {
    preflight: true,
  },
  typescript: {
    shim: false,
    strict: true,
  },
})
