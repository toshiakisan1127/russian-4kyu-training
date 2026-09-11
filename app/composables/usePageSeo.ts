type PageSeo = {
  title: string
  description: string
  noindex?: boolean
  learningResourceType?: string
}

const pageSeoByPath: Record<string, PageSeo> = {
  '/': {
    title: 'ロシア語能力検定4級対策｜文法・語彙・模擬試験トレーニング',
    description: 'ロシア語能力検定4級の合格を目指す無料・登録不要の学習サイト。語彙・格変化・動詞活用・前置詞・露文和訳・和文露訳・模擬試験を分野別に練習できます。',
    learningResourceType: 'Interactive practice',
  },
  '/about': {
    title: 'ロシア語能力検定4級とは？試験内容と学習方法｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級の試験内容と、このサイトでできる対策をまとめています。分野別トレーニングから模擬試験まで4級対策に使えます。',
    learningResourceType: 'Study guide',
  },
  '/cases': {
    title: 'ロシア語4級 格変化トレーニング｜名詞・形容詞の格変化を練習',
    description: 'ロシア語能力検定4級向けの格変化問題。生格・与格・対格・造格・前置格を、名詞や形容詞を使った問題で練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/prepositions': {
    title: 'ロシア語4級 前置詞トレーニング｜в・на・из・с・кを練習',
    description: 'ロシア語能力検定4級向けの前置詞問題。в・на・из・с・кなど、場所や方向を表す前置詞と格支配を練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/verbs': {
    title: 'ロシア語4級 動詞活用トレーニング｜現在形・過去形・未来形・移動動詞',
    description: 'ロシア語能力検定4級向けの動詞問題。現在形の人称変化、過去形、未来形、完了体・不完了体、移動動詞を練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/vocabulary': {
    title: 'ロシア語4級 単語・語彙トレーニング｜基本語彙を問題で覚える',
    description: 'ロシア語能力検定4級向けの基本単語・語彙トレーニング。意味、品詞、活用や格変化、例文を確認しながら繰り返し学習できます。',
    learningResourceType: 'Vocabulary practice',
  },
  '/mixed': {
    title: 'ロシア語4級 総合トレーニング｜文法・語彙をまとめて演習',
    description: '前置詞・格変化・動詞・語彙を混ぜたロシア語能力検定4級向け総合問題。苦手分野を横断して練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/mock': {
    title: 'ロシア語能力検定4級 模擬試験｜本番形式で実力チェック',
    description: 'ロシア語能力検定4級の本番形式を意識した模擬試験。発音・アクセント・文法・動詞・翻訳問題までまとめて実力を確認できます。',
    learningResourceType: 'Mock exam',
  },
  '/reading': {
    title: 'ロシア語4級 読解・露文和訳トレーニング｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級レベルの文章を使って、読解と露文和訳を練習できます。語彙や重要表現も確認できます。',
    learningResourceType: 'Reading practice',
  },
  '/reference': {
    title: 'ロシア語4級 重要表現まとめ｜文法・動詞・頻度表現を確認',
    description: 'ロシア語能力検定4級で押さえたい重要表現をまとめて確認。動詞活用、移動動詞、頻度表現など試験前の復習に使えます。',
    learningResourceType: 'Reference',
  },
  '/sections/1': {
    title: 'ロシア語4級 第1問 発音トレーニング｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級の第1問を意識した発音問題。下線部の発音が異なる単語を選ぶ形式で練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/2': {
    title: 'ロシア語4級 第2問 アクセントトレーニング｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級の第2問を意識したアクセント問題。単語のアクセント位置を問題形式で確認できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/3': {
    title: 'ロシア語4級 第3問 名詞の性・代名詞｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級向けに、名詞の性とон・она・оно・ониなどの代名詞の使い分けを練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/4': {
    title: 'ロシア語4級 第4問 名詞の複数形｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級向けに、名詞の主格複数形とアクセントを問題形式で練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/5': {
    title: 'ロシア語4級 第5問 格変化｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級の第5問を意識した格変化問題。文脈や格支配に合わせた名詞・形容詞の変化を練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/6': {
    title: 'ロシア語4級 第6問 疑問文への応答｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級向けに、疑問詞と文意に合う自然な応答を選ぶ問題を練習できます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/7': {
    title: 'ロシア語4級 第7問 動詞の人称変化｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級の動詞人称変化を集中練習。主語に合わせて現在形の動詞を正しく活用する問題に取り組めます。',
    learningResourceType: 'Practice exercise',
  },
  '/sections/8': {
    title: 'ロシア語4級 第8問 過去形・未来形｜ロシア語4級トレーニング',
    description: 'ロシア語能力検定4級向けの過去形・未来形トレーニング。指定された文を過去形または未来形へ書き換える練習ができます。',
    learningResourceType: 'Practice exercise',
  },
  '/translations/ru-ja': {
    title: 'ロシア語4級 露文和訳トレーニング｜ロシア語から日本語へ',
    description: 'ロシア語能力検定4級レベルのロシア語文を日本語へ訳す練習。自己採点しながら模範訳や重要表現を確認できます。',
    learningResourceType: 'Translation practice',
  },
  '/translations/ja-ru': {
    title: 'ロシア語4級 和文露訳トレーニング｜日本語からロシア語へ',
    description: 'ロシア語能力検定4級レベルの日本語文をロシア語へ訳す練習。基本語彙と文法を使って露作文に取り組めます。',
    learningResourceType: 'Translation practice',
  },
  '/bonus': {
    title: 'ロシア国歌でロシア語学習｜歌詞・日本語訳・単語・アクセント',
    description: 'ロシア国歌の歌詞、日本語訳、アクセント、単語を見ながらロシア語を楽しく学べるおまけページです。',
  },
  '/dashboard': {
    title: '学習ダッシュボード｜ロシア語4級トレーニング',
    description: 'ロシア語4級トレーニングの学習状況を端末内のデータから確認できます。',
    noindex: true,
  },
  '/feedback': {
    title: 'ご意見・機能要望｜ロシア語4級トレーニング',
    description: 'ロシア語4級トレーニングへのご意見、不具合報告、機能要望の送り方をご案内します。',
    noindex: true,
  },
}

const defaultSeo = pageSeoByPath['/']!

const normalizePath = (path: string) => {
  if (path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}

export const usePageSeo = () => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  const normalizedPath = computed(() => normalizePath(route.path))
  const pageSeo = computed(() => pageSeoByPath[normalizedPath.value] ?? defaultSeo)
  const canonicalUrl = computed(() => {
    const siteUrl = String(runtimeConfig.public.siteUrl).replace(/\/$/, '')
    return normalizedPath.value === '/' ? `${siteUrl}/` : `${siteUrl}${normalizedPath.value}`
  })

  useSeoMeta({
    title: () => pageSeo.value.title,
    description: () => pageSeo.value.description,
    robots: () => pageSeo.value.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    ogTitle: () => pageSeo.value.title,
    ogDescription: () => pageSeo.value.description,
    ogUrl: () => canonicalUrl.value,
    twitterTitle: () => pageSeo.value.title,
    twitterDescription: () => pageSeo.value.description,
  })

  useHead(() => {
    const structuredData = pageSeo.value.learningResourceType
      ? {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: pageSeo.value.title,
          description: pageSeo.value.description,
          url: canonicalUrl.value,
          inLanguage: 'ja',
          educationalLevel: 'ロシア語能力検定4級',
          learningResourceType: pageSeo.value.learningResourceType,
          isAccessibleForFree: true,
          about: {
            '@type': 'Thing',
            name: 'ロシア語能力検定4級',
          },
        }
      : null

    return {
      link: [
        { rel: 'canonical', href: canonicalUrl.value },
      ],
      script: structuredData
        ? [{
            key: 'page-learning-resource',
            type: 'application/ld+json',
            innerHTML: JSON.stringify(structuredData),
          }]
        : [],
    }
  })
}
