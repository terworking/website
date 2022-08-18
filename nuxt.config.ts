import { defineNuxtConfig } from 'nuxt'

const lang = 'id'
const themeColor = '#f59e0b'
const siteName = 'Terworking'
const backgroundColor = '#242427'
const description = 'Website Terworking.'
const bannerImage = 'https://terworking.netlify.app/banner/0?w=500'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang },
      link: [
        // for banner image redirects
        { rel: 'preconnect', href: 'https://images.weserv.nl' },
        { rel: 'dns-prefetch', href: 'https://images.weserv.nl' },
      ],
      meta: [
        { property: 'og:type', content: 'website' },
        { name: 'theme_color', content: themeColor },
        { property: 'og:image', content: bannerImage },
        { property: 'og:site_name', content: siteName },
        { name: 'twitter:image', content: bannerImage },
        { name: 'twitter:card', value: 'summary_large_image' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      headerHeading: 'Website Terworking',
      headerParagraph: 'Alumni TKJ SMKN 2 Kandangan (2021/2022)',
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
      lang,
      description,
      name: siteName,
      theme_color: themeColor,
      background_color: backgroundColor,
    },
  },
  typescript: {
    shim: false,
    strict: true,
  },
})
