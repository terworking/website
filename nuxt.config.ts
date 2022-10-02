import { defineNuxtConfig } from 'nuxt'

const language = 'id'
const accentColor = '#a5f3fc'

const websiteTitle = 'Terworking'
const websiteHeading = 'Website Terworking'
const websiteDescription = 'Alumni TKJ SMKN 2 Kandangan (2021/2022)'
const websiteHostFallback = 'terworking.pages.dev'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: language },
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        // for banner image redirects
        { rel: 'preconnect', href: 'https://images.weserv.nl' },
        { rel: 'dns-prefetch', href: 'https://images.weserv.nl' },
      ],
      meta: [
        { property: 'og:type', content: 'website' },
        { name: 'theme-color', content: accentColor },
        { property: 'og:site_name', content: websiteTitle },
      ],
    },
  },
  runtimeConfig: {
    public: {
      websiteDescription,
      websiteHeading,
      websiteTitle,
      websiteHostFallback,
      notFoundTitle: '404 NOT FOUND',
    },
  },
  css: ['~~/assets/main.css', '~~/assets/transition.css'],
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@kevinmarrec/nuxt-pwa',
  ],
  colorMode: {
    dataValue: 'theme',
    fallback: 'dark',
    classSuffix: '',
  },
  unocss: {
    preflight: true,
  },
  pwa: {
    icon: { maskablePadding: 0 },
    meta: false,
    manifest: {
      lang: language,
      description: websiteDescription,
      name: websiteTitle,
      theme_color: accentColor,
      background_color: '#242427',
    },
  },
  typescript: {
    shim: false,
    strict: true,
  },
})
