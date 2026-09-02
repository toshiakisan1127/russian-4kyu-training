export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
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
