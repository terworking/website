import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],
  buildModules: ['@vueuse/nuxt', 'nuxt-windicss'],
  head: {
    meta: [{ name: 'description', content: 'Website Terworking' }],
  },
  typescript: {
    shim: false,
  },
  colorMode: {
    fallback: 'dark',
    classSuffix: '',
  },
});
