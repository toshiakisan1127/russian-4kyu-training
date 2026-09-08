import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL ?? '/russian-4kyu-training/'
const assetUrl = (path: string) => `${baseURL.replace(/\/$/, '')}/${path}`
const siteUrl = 'https://russian4kyu-training.com/'
const siteTitle = 'ロシア語能力検定4級トレーニング｜文法・語彙・模擬試験'
const siteDescription = 'ロシア語能力検定4級の合格を目指す学習アプリ。語彙・格変化・動詞活用・前置詞・露文和訳・和文露訳・模擬試験を分野別に練習できます。'
const ogImageUrl = new URL('og-image.png?v=20260908', siteUrl).toString()

const prerenderRoutes = [
  '/',
  '/about',
  '/bonus',
  '/cases',
  '/dashboard',
  '/feedback',
  '/mixed',
  '/mock',
  '/prepositions',
  '/reading',
  '/reference',
  '/sections/1',
  '/sections/2',
  '/sections/3',
  '/sections/4',
  '/sections/5',
  '/sections/6',
  '/sections/7',
  '/sections/8',
  '/translations/ja-ru',
  '/translations/ru-ja',
  '/verbs',
  '/vocabulary',
]

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      lastUpdatedAt: '',
      siteUrl,
    },
  },
  nitro: {
    prerender: {
      routes: prerenderRoutes,
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'ja' },
      title: siteTitle,
      meta: [
        {
          name: 'description',
          content: siteDescription,
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'ロシア語4級' },
        { property: 'og:title', content: siteTitle },
        { property: 'og:description', content: siteDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'ロシア語4級トレーニング' },
        { property: 'og:locale', content: 'ja_JP' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImageUrl },
      ],
      link: [
        { rel: 'manifest', href: assetUrl('manifest.webmanifest') },
        { rel: 'icon', href: assetUrl('favicon.ico'), sizes: 'any' },
        { rel: 'icon', href: assetUrl('icon-48.png'), type: 'image/png', sizes: '48x48' },
        { rel: 'icon', href: assetUrl('icon.svg'), type: 'image/svg+xml', sizes: 'any' },
        { rel: 'apple-touch-icon', href: assetUrl('icon-180.png'), sizes: '180x180' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': `${siteUrl}#website`,
                name: 'ロシア語4級トレーニング',
                url: siteUrl,
                description: siteDescription,
                inLanguage: 'ja',
              },
              {
                '@type': 'WebApplication',
                '@id': `${siteUrl}#app`,
                name: 'ロシア語4級トレーニング',
                url: siteUrl,
                description: siteDescription,
                inLanguage: 'ja',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web Browser',
                educationalLevel: 'ロシア語能力検定4級',
                isAccessibleForFree: true,
              },
            ],
          }),
        },
      ],
    },
  },
})