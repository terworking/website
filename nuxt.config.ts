import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@unocss/nuxt'],
  buildModules: ['nuxt-windicss'],
  experimental: {
    reactivityTransform: true,
    viteNode: true,
  },
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
  unocss: {
    preflight: true,
  },
});
