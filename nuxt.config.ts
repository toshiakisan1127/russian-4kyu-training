import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL ?? '/russian-4kyu-training/'
const assetUrl = (path: string) => `${baseURL.replace(/\/$/, '')}/${path}`
const siteUrl = 'https://russian4kyu-training.com/'
const siteTitle = 'ロシア語能力検定4級トレーニング｜文法・語彙・模擬試験'
const siteDescription = 'ロシア語能力検定4級の合格を目指す学習アプリ。語彙・格変化・動詞活用・前置詞・露文和訳・和文露訳・模擬試験を分野別に練習できます。'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      lastUpdatedAt: '',
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
      ],
      link: [
        { rel: 'canonical', href: siteUrl },
        { rel: 'manifest', href: assetUrl('manifest.webmanifest') },
        { rel: 'icon', href: assetUrl('icon.svg'), type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: assetUrl('icon.svg') },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['WebSite', 'EducationalApplication'],
            name: 'ロシア語4級トレーニング',
            url: siteUrl,
            description: siteDescription,
            inLanguage: 'ja',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            educationalLevel: 'ロシア語能力検定4級',
            isAccessibleForFree: true,
          }),
        },
      ],
    },
  },
})