import { vocabularyItems } from './vocabulary'

const specificTipsByWord: Record<string, readonly string[]> = {
  в: [
    '場所「〜で」は в + 前置格、方向「〜へ」は в + 対格。格の使い分けが4級の定番。',
  ],
  на: [
    '場所「〜で」は на + 前置格、方向「〜へ」は на + 対格。в とセットで整理する。',
  ],
  из: [
    '「〜の中から／〜から」は из + 生格。в ↔ из の対応で覚える。',
  ],
  с: [
    '「〜と一緒に」は с + 造格、「〜の上・場所から」は с + 生格。意味によって支配格が変わる。',
  ],
  к: [
    '「〜のところへ／〜に向かって」は к + 与格。人のところへ行く表現でよく使う。',
  ],
  у: [
    'у + 生格 + есть ... で「〜は…を持っている」。所有表現は4級で重要。',
  ],
  о: [
    '「〜について」は о + 前置格。母音の前などでは об になることがある。',
  ],
  без: ['「〜なしで」は без + 生格。'],
  для: ['「〜のために」は для + 生格。'],
  после: ['「〜の後で」は после + 生格。'],
  до: ['「〜まで」は до + 生格。'],
  от: ['「〜から」は от + 生格。人・起点から離れる意味で使う。'],
  по: ['4級では по + 与格の用法をまず押さえる。曜日・方法などの定型表現にも注意。'],
  через: ['「〜を通って／〜後に」は через + 対格。'],
  перед: ['「〜の前に」は перед + 造格。'],
  между: ['「〜の間に」は между + 造格を取る。'],

  идти: [
    '徒歩で「一方向に行く」移動動詞。反復・往復の ходить と対で覚える。',
    '現在形は иду́, идёшь ...、過去形は шёл / шла́ / шло́ / шли́ と不規則。',
  ],
  ходить: [
    '徒歩で「反復・往復・多方向に行く」移動動詞。一方向の идти と区別する。',
  ],
  ехать: [
    '乗り物で「一方向に行く」移動動詞。反復・往復の ездить と対で覚える。',
  ],
  ездить: [
    '乗り物で「反復・往復・多方向に行く」移動動詞。一方向の ехать と区別する。',
  ],
  быть: [
    '現在の名詞文では быть はふつう省略する。過去は был / была́ / бы́ло / бы́ли。',
    '不完了体動詞の未来は буду / будешь ... + 不定形で作る。',
  ],
  мочь: [
    'мочь + 不定形で「〜できる」。現在形は могу́, мо́жешь, мо́жет ... と語幹が変わる。',
  ],
  хотеть: [
    'хотеть + 不定形で「〜したい」。хочу́, хо́чешь, хо́чет, хоти́м, хоти́те, хотя́т の活用に注意。',
  ],
  нравиться: [
    '「〜が好き」は、好きな人を与格、好きな対象を主格にする：Мне нра́вится музыка.。',
  ],
  помогать: ['「〜を手伝う」は помогать + 与格。日本語の「を」に引っ張られない。'],
  звонить: ['「〜に電話する」は звонить + 与格。'],
  любить: ['「〜が好き／〜を愛する」は любить + 対格。人称変化も確認する。'],
  смотреть: ['「〜を見る」は смотреть на + 対格 の形が頻出。'],
  слушать: ['「〜を聞く」は слушать + 対格。'],
  интересоваться: ['「〜に興味を持つ」は интересоваться + 造格。'],
  писать: ['現在形は пишу́, пи́шешь ...。с → ш の子音交替に注意。'],
  жить: ['現在形は живу́, живёшь, живёт ...。アクセント位置と活用をセットで覚える。'],
  дать: ['完了体。未来の意味で дам, дашь, даст, дади́м, дади́те, даду́т と不規則活用する。'],

  один: ['「1」は名詞の性に合わせて оди́н / одна́ / одно́ と変化する。'],
  одна: ['「1」は名詞の性に一致する。男性 оди́н・女性 одна́・中性 одно́。'],
  одно: ['「1」は名詞の性に一致する。男性 оди́н・女性 одна́・中性 одно́。'],
  два: ['2〜4の後ろの名詞は基本的に生格単数：два стола́。女性名詞では две を使う。'],
  две: ['女性名詞の「2」は две。2〜4の後ろの名詞は基本的に生格単数。'],
  три: ['2〜4の後ろの名詞は基本的に生格単数：три кни́ги。'],
  четыре: ['2〜4の後ろの名詞は基本的に生格単数：четы́ре кни́ги。'],
  пять: ['5以上の数詞の後ろの名詞は基本的に生格複数：пять книг。'],

  нет: ['нет + 生格で「〜がない」。есть と対になる存在・所有表現。'],
  можно: ['можно + 不定形で「〜してよい／〜できる」。主語を立てない無人称表現。'],
  нельзя: ['нельзя + 不定形で「〜してはいけない／〜できない」。無人称表現として覚える。'],
  нужно: ['人を与格にして нужно + 不定形で「〜する必要がある」：Мне ну́жно идти́.。'],
}

const vocabularyByWord = new Map(vocabularyItems.map((item) => [item.word, item]))

const genderLabel = {
  masculine: '男性',
  feminine: '女性',
  neuter: '中性',
} as const

const generatedTipsForWord = (word: string): string[] => {
  const item = vocabularyByWord.get(word)
  if (!item) return []

  if (item.partOfSpeech === 'noun') {
    const tips: string[] = []
    const pluralTip = item.plural === '通常複数形なし'
      ? `${item.stressedWord} は${genderLabel[item.gender]}名詞で、通常は複数形を使わない。`
      : `${item.stressedWord} は${genderLabel[item.gender]}名詞。複数主格は ${item.plural}。`
    tips.push(pluralTip)

    if (item.declension) {
      const { genitive, accusative, prepositional } = item.declension
      const allSame = Object.values(item.declension).every((form) => form === item.declension?.nominative)
      tips.push(allSame
        ? `格が変わっても語形は ${item.declension.nominative} のまま。変化しない名詞として覚える。`
        : `単数の主要格は、生格 ${genitive}・対格 ${accusative}・前置格 ${prepositional}。実際の語形で覚える。`)
    }

    if (item.animate) {
      tips.push(`${item.stressedWord} は有生名詞。対格を作るときは「人・動物」であることを意識する。`)
    }

    return tips
  }

  if (item.partOfSpeech === 'verb') {
    const tips: string[] = []
    const aspectLabel = item.aspect === 'imperfective' ? '不完了体' : '完了体'

    if (item.presentConjugation) {
      const forms = item.presentConjugation
      tips.push(item.aspect === 'imperfective'
        ? `${item.stressedWord} は${aspectLabel}。現在形は ${forms.firstSingular} / ${forms.secondSingular} / ${forms.thirdPlural}。`
        : `${item.stressedWord} は${aspectLabel}。${forms.firstSingular} / ${forms.secondSingular} / ${forms.thirdPlural} は未来の意味になる。`)
    } else {
      tips.push(`${item.stressedWord} は${aspectLabel}。動詞の体まで単語とセットで覚える。`)
    }

    if (item.aspect === 'imperfective') {
      tips.push(`未来は быть の未来形 + ${item.word}：例「буду ${item.word}」。不完了体の複合未来として押さえる。`)
    }

    return tips
  }

  if (item.partOfSpeech === 'adjective') {
    const tips: string[] = []
    if (item.forms) {
      tips.push(`${item.stressedWord} の基本形は、男性 ${item.forms.masculine}・女性 ${item.forms.feminine}・中性 ${item.forms.neuter}・複数 ${item.forms.plural}。`)
    }

    if (item.declension) {
      tips.push(`生格は男/中 ${item.declension.genitive.masculine}・女 ${item.declension.genitive.feminine}、前置格は男/中 ${item.declension.prepositional.masculine}・女 ${item.declension.prepositional.feminine}。`)
    }

    return tips
  }

  return []
}

export const getVocabularyExamTips = (word: string): readonly string[] => {
  const tips = [
    ...(specificTipsByWord[word] ?? []),
    ...generatedTipsForWord(word),
  ]

  return [...new Set(tips)].slice(0, 3)
}
