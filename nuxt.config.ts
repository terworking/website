import { defineNuxtConfig } from 'nuxt'

const meta = {
  name: 'Terworking',
  description: 'WEBSITE TERWORKING',
  lang: 'id',
  theme_color: 'rgb(165, 243, 252)',
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        // for banner image redirects
        { rel: 'preconnect', href: 'https://images.weserv.nl' },
        { rel: 'dns-prefetch', href: 'https://images.weserv.nl' },
      ],
    },
  },
  css: ['~~/assets/main.css'],
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@kevinmarrec/nuxt-pwa',
  ],
  colorMode: {
    dataValue: 'theme',
    classSuffix: '',
    fallback: 'dark',
  },
  unocss: {
    preflight: true,
  },
  pwa: {
    icon: { maskablePadding: 0 },
    meta: { ...meta, favicon: false },
    manifest: { ...meta, background_color: '#242427' },
  },
  typescript: {
    shim: false,
    strict: true,
  },
})
