import tailwindcss from '@tailwindcss/vite'

const baseURL = process.env.NUXT_APP_BASE_URL ?? '/russian-4kyu-training/'
const assetUrl = (path: string) => `${baseURL.replace(/\/$/, '')}/${path}`

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
      title: 'ロシア語4級トレーニング',
      meta: [
        {
          name: 'description',
          content: 'ロシア語能力検定4級向けのミニ問題演習アプリ',
        },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'ロシア語4級' },
      ],
      link: [
        { rel: 'manifest', href: assetUrl('manifest.webmanifest') },
        { rel: 'icon', href: assetUrl('icon.svg'), type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: assetUrl('icon.svg') },
      ],
    },
  },
})
