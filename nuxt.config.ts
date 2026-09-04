import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL: '/russian-4kyu-training/',
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
        { rel: 'manifest', href: '/russian-4kyu-training/manifest.webmanifest' },
        { rel: 'icon', href: '/russian-4kyu-training/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/russian-4kyu-training/icon.svg' },
      ],
    },
  },
})
