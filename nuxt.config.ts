import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL: '/toshiaki_Russia_language/',
    head: {
      htmlAttrs: { lang: 'ja' },
      title: 'ロシア語4級トレーニング',
      meta: [
        {
          name: 'description',
          content: 'ロシア語能力検定4級向けのミニ問題演習アプリ',
        },
      ],
    },
  },
})
