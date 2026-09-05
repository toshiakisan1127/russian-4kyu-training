import type {
  AdjectiveForms,
  AdjectiveVocabularyItem,
  NounVocabularyItem,
  RussianCase,
  SimpleVocabularyItem,
  VerbConjugation,
  VerbVocabularyItem,
  VocabularyExample,
  VocabularyPartOfSpeech,
} from '~/types/vocabulary'

export type NounSeed = readonly [
  word: string,
  stressedWord: string,
  meaning: string,
  gender: 'masculine' | 'feminine' | 'neuter',
  plural: string,
  animate?: boolean,
]

export type WordSeed = readonly [word: string, stressedWord: string, meaning: string]

const nounSpecialDeclensions: Record<string, Record<RussianCase, string>> = {
  время: { nominative: 'время', genitive: 'времени', dative: 'времени', accusative: 'время', instrumental: 'временем', prepositional: 'времени' },
  имя: { nominative: 'имя', genitive: 'имени', dative: 'имени', accusative: 'имя', instrumental: 'именем', prepositional: 'имени' },
  мать: { nominative: 'мать', genitive: 'матери', dative: 'матери', accusative: 'мать', instrumental: 'матерью', prepositional: 'матери' },
  дочь: { nominative: 'дочь', genitive: 'дочери', dative: 'дочери', accusative: 'дочь', instrumental: 'дочерью', prepositional: 'дочери' },
  путь: { nominative: 'путь', genitive: 'пути', dative: 'пути', accusative: 'путь', instrumental: 'путём', prepositional: 'пути' },
  день: { nominative: 'день', genitive: 'дня', dative: 'дню', accusative: 'день', instrumental: 'днём', prepositional: 'дне' },
  камень: { nominative: 'камень', genitive: 'камня', dative: 'камню', accusative: 'камень', instrumental: 'камнем', prepositional: 'камне' },
  огонь: { nominative: 'огонь', genitive: 'огня', dative: 'огню', accusative: 'огонь', instrumental: 'огнём', prepositional: 'огне' },
  ветер: { nominative: 'ветер', genitive: 'ветра', dative: 'ветру', accusative: 'ветер', instrumental: 'ветром', prepositional: 'ветре' },
  рот: { nominative: 'рот', genitive: 'рта', dative: 'рту', accusative: 'рот', instrumental: 'ртом', prepositional: 'рте' },
  любовь: { nominative: 'любовь', genitive: 'любви', dative: 'любви', accusative: 'любовь', instrumental: 'любовью', prepositional: 'любви' },
  человек: { nominative: 'человек', genitive: 'человека', dative: 'человеку', accusative: 'человека', instrumental: 'человеком', prepositional: 'человеке' },
  ребёнок: { nominative: 'ребёнок', genitive: 'ребёнка', dative: 'ребёнку', accusative: 'ребёнка', instrumental: 'ребёнком', prepositional: 'ребёнке' },
  отец: { nominative: 'отец', genitive: 'отца', dative: 'отцу', accusative: 'отца', instrumental: 'отцом', prepositional: 'отце' },
  палец: { nominative: 'палец', genitive: 'пальца', dative: 'пальцу', accusative: 'палец', instrumental: 'пальцем', prepositional: 'пальце' },
  продавец: { nominative: 'продавец', genitive: 'продавца', dative: 'продавцу', accusative: 'продавца', instrumental: 'продавцом', prepositional: 'продавце' },
  конец: { nominative: 'конец', genitive: 'конца', dative: 'концу', accusative: 'конец', instrumental: 'концом', prepositional: 'конце' },
  рынок: { nominative: 'рынок', genitive: 'рынка', dative: 'рынку', accusative: 'рынок', instrumental: 'рынком', prepositional: 'рынке' },
  подарок: { nominative: 'подарок', genitive: 'подарка', dative: 'подарку', accusative: 'подарок', instrumental: 'подарком', prepositional: 'подарке' },
  ботинок: { nominative: 'ботинок', genitive: 'ботинка', dative: 'ботинку', accusative: 'ботинок', instrumental: 'ботинком', prepositional: 'ботинке' },
  цветок: { nominative: 'цветок', genitive: 'цветка', dative: 'цветку', accusative: 'цветок', instrumental: 'цветком', prepositional: 'цветке' },
  ванная: { nominative: 'ванная', genitive: 'ванной', dative: 'ванной', accusative: 'ванную', instrumental: 'ванной', prepositional: 'ванной' },
  столовая: { nominative: 'столовая', genitive: 'столовой', dative: 'столовой', accusative: 'столовую', instrumental: 'столовой', prepositional: 'столовой' },
  животное: { nominative: 'животное', genitive: 'животного', dative: 'животному', accusative: 'животное', instrumental: 'животным', prepositional: 'животном' },
}

const indeclinableNouns = new Set(['метро', 'кафе', 'кофе', 'радио', 'меню', 'пальто'])
const pluralOnlyNouns = new Set(['деньги', 'брюки'])
const spellingRuleLetters = new Set(['г', 'к', 'х', 'ж', 'ч', 'ш', 'щ'])

const nearbyPlaceNouns = new Set([
  'школа', 'университет', 'магазин', 'рынок', 'ресторан', 'кафе', 'гостиница', 'парк', 'стадион',
  'театр', 'музей', 'вокзал', 'аэропорт', 'почта', 'банк', 'аптека', 'больница', 'библиотека', 'кинотеатр',
])

const capitalize = (text: string) => text.length > 0 ? `${text[0]!.toUpperCase()}${text.slice(1)}` : text

const makeNounExample = (
  word: string,
  stressedWord: string,
  meaning: string,
  gender: 'masculine' | 'feminine' | 'neuter',
  animate: boolean,
): VocabularyExample => {
  if (animate) {
    const objectPronoun = gender === 'feminine' ? 'её' : 'его́'
    return {
      sentence: `${capitalize(stressedWord)} живёт недалеко́ от нас, и мы ча́сто ви́дим ${objectPronoun} по выходны́м.`,
      translation: `${meaning}は私たちの近くに住んでいて、週末によく会います。`,
    }
  }

  if (nearbyPlaceNouns.has(word)) {
    return {
      sentence: `Недалеко́ от на́шего до́ма есть ${stressedWord}, и мы ча́сто быва́ем там по выходны́м.`,
      translation: `私たちの家の近くには${meaning}があり、週末によくそこへ行きます。`,
    }
  }

  return {
    sentence: `Сло́во «${stressedWord}» ча́сто встреча́ется в просты́х те́кстах, поэ́тому я записа́л его́ в свой слова́рь.`,
    translation: `「${meaning}」という語は簡単な文章によく出てくるので、自分の単語帳に書きました。`,
  }
}

const makeNounDeclension = (
  word: string,
  gender: 'masculine' | 'feminine' | 'neuter',
  animate = false,
): Record<RussianCase, string> | undefined => {
  if (pluralOnlyNouns.has(word) || word.includes(' ')) return undefined

  const special = nounSpecialDeclensions[word]
  if (special) return special

  if (indeclinableNouns.has(word)) {
    return { nominative: word, genitive: word, dative: word, accusative: word, instrumental: word, prepositional: word }
  }

  if (word.endsWith('ия')) {
    const stem = word.slice(0, -1)
    return { nominative: word, genitive: `${stem}и`, dative: `${stem}и`, accusative: `${stem}ю`, instrumental: `${stem}ей`, prepositional: `${stem}и` }
  }

  if (word.endsWith('а')) {
    const stem = word.slice(0, -1)
    const genitiveEnding = spellingRuleLetters.has(stem.at(-1) ?? '') ? 'и' : 'ы'
    return { nominative: word, genitive: `${stem}${genitiveEnding}`, dative: `${stem}е`, accusative: `${stem}у`, instrumental: `${stem}ой`, prepositional: `${stem}е` }
  }

  if (word.endsWith('я')) {
    const stem = word.slice(0, -1)
    return { nominative: word, genitive: `${stem}и`, dative: `${stem}е`, accusative: `${stem}ю`, instrumental: `${stem}ей`, prepositional: `${stem}е` }
  }

  if (gender === 'feminine' && word.endsWith('ь')) {
    const stem = word.slice(0, -1)
    return { nominative: word, genitive: `${stem}и`, dative: `${stem}и`, accusative: word, instrumental: `${stem}ью`, prepositional: `${stem}и` }
  }

  if (word.endsWith('й')) {
    const stem = word.slice(0, -1)
    const genitive = `${stem}я`
    return { nominative: word, genitive, dative: `${stem}ю`, accusative: animate ? genitive : word, instrumental: `${stem}ем`, prepositional: `${stem}е` }
  }

  if (gender === 'masculine' && word.endsWith('ь')) {
    const stem = word.slice(0, -1)
    const genitive = `${stem}я`
    return { nominative: word, genitive, dative: `${stem}ю`, accusative: animate ? genitive : word, instrumental: `${stem}ем`, prepositional: `${stem}е` }
  }

  if (word.endsWith('о')) {
    const stem = word.slice(0, -1)
    return { nominative: word, genitive: `${stem}а`, dative: `${stem}у`, accusative: word, instrumental: `${stem}ом`, prepositional: `${stem}е` }
  }

  if (word.endsWith('е') || word.endsWith('ё')) {
    const stem = word.slice(0, -1)
    return { nominative: word, genitive: `${stem}я`, dative: `${stem}ю`, accusative: word, instrumental: `${stem}ем`, prepositional: `${stem}е` }
  }

  const genitive = `${word}а`
  return { nominative: word, genitive, dative: `${word}у`, accusative: animate ? genitive : word, instrumental: `${word}ом`, prepositional: `${word}е` }
}

export const makeNoun = (id: string, seed: NounSeed): NounVocabularyItem => {
  const [word, stressedWord, meaning, gender, plural, animate = false] = seed
  const declension = makeNounDeclension(word, gender, animate)

  return {
    id,
    word,
    stressedWord,
    meaning,
    partOfSpeech: 'noun',
    gender,
    plural,
    animate,
    declension,
    example: makeNounExample(word, stressedWord, meaning, gender, animate),
  }
}

const withPronouns = (forms: readonly [string, string, string, string, string, string]): VerbConjugation => ({
  firstSingular: `я ${forms[0]}`,
  secondSingular: `ты ${forms[1]}`,
  thirdSingular: `он / она ${forms[2]}`,
  firstPlural: `мы ${forms[3]}`,
  secondPlural: `вы ${forms[4]}`,
  thirdPlural: `они ${forms[5]}`,
})

const verbOverrides: Record<string, readonly [string, string, string, string, string, string]> = {
  быть: ['есть', 'есть', 'есть', 'есть', 'есть', 'есть'],
  мочь: ['могу', 'можешь', 'может', 'можем', 'можете', 'могут'],
  хотеть: ['хочу', 'хочешь', 'хочет', 'хотим', 'хотите', 'хотят'],
  видеть: ['вижу', 'видишь', 'видит', 'видим', 'видите', 'видят'],
  висеть: ['вишу', 'висишь', 'висит', 'висим', 'висите', 'висят'],
  идти: ['иду', 'идёшь', 'идёт', 'идём', 'идёте', 'идут'],
  стоять: ['стою', 'стоишь', 'стоит', 'стоим', 'стоите', 'стоят'],
  жить: ['живу', 'живёшь', 'живёт', 'живём', 'живёте', 'живут'],
  смотреть: ['смотрю', 'смотришь', 'смотрит', 'смотрим', 'смотрите', 'смотрят'],
  сидеть: ['сижу', 'сидишь', 'сидит', 'сидим', 'сидите', 'сидят'],
  давать: ['даю', 'даёшь', 'даёт', 'даём', 'даёте', 'дают'],
  любить: ['люблю', 'любишь', 'любит', 'любим', 'любите', 'любят'],
  ждать: ['жду', 'ждёшь', 'ждёт', 'ждём', 'ждёте', 'ждут'],
  лежать: ['лежу', 'лежишь', 'лежит', 'лежим', 'лежите', 'лежат'],
  писать: ['пишу', 'пишешь', 'пишет', 'пишем', 'пишете', 'пишут'],
  ходить: ['хожу', 'ходишь', 'ходит', 'ходим', 'ходите', 'ходят'],
  слышать: ['слышу', 'слышишь', 'слышит', 'слышим', 'слышите', 'слышат'],
  бояться: ['боюсь', 'боишься', 'боится', 'боимся', 'боитесь', 'боятся'],
  брать: ['беру', 'берёшь', 'берёт', 'берём', 'берёте', 'берут'],
  вести: ['веду', 'ведёшь', 'ведёт', 'ведём', 'ведёте', 'ведут'],
  выходить: ['выхожу', 'выходишь', 'выходит', 'выходим', 'выходите', 'выходят'],
  просить: ['прошу', 'просишь', 'просит', 'просим', 'просите', 'просят'],
  держать: ['держу', 'держишь', 'держит', 'держим', 'держите', 'держат'],
  уходить: ['ухожу', 'уходишь', 'уходит', 'уходим', 'уходите', 'уходят'],
  находить: ['нахожу', 'находишь', 'находит', 'находим', 'находите', 'находят'],
  спать: ['сплю', 'спишь', 'спит', 'спим', 'спите', 'спят'],
  молчать: ['молчу', 'молчишь', 'молчит', 'молчим', 'молчите', 'молчат'],
  становить: ['становлю', 'становишь', 'становит', 'становим', 'становите', 'становят'],
  искать: ['ищу', 'ищешь', 'ищет', 'ищем', 'ищете', 'ищут'],
  звать: ['зову', 'зовёшь', 'зовёт', 'зовём', 'зовёте', 'зовут'],
  нравить: ['нравлю', 'нравишь', 'нравит', 'нравим', 'нравите', 'нравят'],
  смеяться: ['смеюсь', 'смеёшься', 'смеётся', 'смеёмся', 'смеётесь', 'смеются'],
  приносить: ['приношу', 'приносишь', 'приносит', 'приносим', 'приносите', 'приносят'],
  пить: ['пью', 'пьёшь', 'пьёт', 'пьём', 'пьёте', 'пьют'],
  есть: ['ем', 'ешь', 'ест', 'едим', 'едите', 'едят'],
  готовить: ['готовлю', 'готовишь', 'готовит', 'готовим', 'готовите', 'готовят'],
  учить: ['учу', 'учишь', 'учит', 'учим', 'учите', 'учат'],
  переводить: ['перевожу', 'переводишь', 'переводит', 'переводим', 'переводите', 'переводят'],
  платить: ['плачу', 'платишь', 'платит', 'платим', 'платите', 'платят'],
  ездить: ['езжу', 'ездишь', 'ездит', 'ездим', 'ездите', 'ездят'],
  ехать: ['еду', 'едешь', 'едет', 'едем', 'едете', 'едут'],
  бежать: ['бегу', 'бежишь', 'бежит', 'бежим', 'бежите', 'бегут'],
  петь: ['пою', 'поёшь', 'поёт', 'поём', 'поёте', 'поют'],
  танцевать: ['танцую', 'танцуешь', 'танцует', 'танцуем', 'танцуете', 'танцуют'],
  носить: ['ношу', 'носишь', 'носит', 'носим', 'носите', 'носят'],
  мыть: ['мою', 'моешь', 'моет', 'моем', 'моете', 'моют'],
  вставать: ['встаю', 'встаёшь', 'встаёт', 'встаём', 'встаёте', 'встают'],
  ложить: ['ложу', 'ложишь', 'ложит', 'ложим', 'ложите', 'ложат'],
}

const addReflexive = (form: string) => `${form}${/[аеёиоуыэюя]$/u.test(form) ? 'сь' : 'ся'}`

const conjugateBare = (word: string): readonly [string, string, string, string, string, string] | undefined => {
  const override = verbOverrides[word]
  if (override) return override

  if (word.endsWith('ся') || word.endsWith('сь')) {
    const base = word.slice(0, -2)
    const baseForms = conjugateBare(base)
    if (!baseForms) return undefined
    return baseForms.map(addReflexive) as unknown as readonly [string, string, string, string, string, string]
  }

  if (word.endsWith('ировать')) {
    const stem = word.slice(0, -7)
    return [`${stem}ирую`, `${stem}ируешь`, `${stem}ирует`, `${stem}ируем`, `${stem}ируете`, `${stem}ируют`]
  }

  if (word.endsWith('овать')) {
    const stem = word.slice(0, -5)
    return [`${stem}ую`, `${stem}уешь`, `${stem}ует`, `${stem}уем`, `${stem}уете`, `${stem}уют`]
  }

  if (word.endsWith('ить')) {
    const stem = word.slice(0, -3)
    const hardSibilant = /[жчшщ]$/u.test(stem)
    return [
      `${stem}${hardSibilant ? 'у' : 'ю'}`,
      `${stem}ишь`,
      `${stem}ит`,
      `${stem}им`,
      `${stem}ите`,
      `${stem}${hardSibilant ? 'ат' : 'ят'}`,
    ]
  }

  if (word.endsWith('ать') || word.endsWith('ять') || word.endsWith('еть')) {
    const stem = word.slice(0, -2)
    return [`${stem}ю`, `${stem}ешь`, `${stem}ет`, `${stem}ем`, `${stem}ете`, `${stem}ют`]
  }

  return undefined
}

const movementVerbs = new Set([
  'идти', 'ходить', 'выходить', 'уходить', 'гулять', 'путешествовать', 'летать', 'ездить', 'ехать',
  'плавать', 'бегать', 'бежать',
])

const learningVerbs = new Set([
  'говорить', 'знать', 'понимать', 'писать', 'считать', 'помнить', 'слышать', 'слушать', 'спрашивать',
  'рассказывать', 'отвечать', 'учиться', 'учить', 'изучать', 'повторять', 'переводить', 'проверять', 'решать',
])

const verbExampleOverrides: Record<string, VocabularyExample> = {
  быть: { sentence: 'Я хочу́ быть до́ма до семи́, потому́ что ве́чером к нам придут го́сти.', translation: '夕方にお客さんが来るので、7時までには家にいたいです。' },
  мочь: { sentence: 'Сейча́с я могу́ говори́ть по-ру́сски то́лько немно́го, но ка́ждый день занима́юсь.', translation: '今はロシア語を少ししか話せませんが、毎日勉強しています。' },
  хотеть: { sentence: 'Я хочу́ лу́чше говори́ть по-ру́сски, поэ́тому занима́юсь ка́ждый день.', translation: 'ロシア語をもっと上手に話したいので、毎日勉強しています。' },
  есть: { sentence: 'Я люблю́ есть до́ма, потому́ что там ти́хо и мо́жно не спеши́ть.', translation: '家は静かで急がなくてよいので、家で食べるのが好きです。' },
  спать: { sentence: 'Я стара́юсь спать не ме́ньше семи́ часо́в, потому́ что у́тром ра́но встаю́.', translation: '朝早く起きるので、7時間以上寝るようにしています。' },
  идти: { sentence: 'Сего́дня я хочу́ идти́ домо́й пешко́м, потому́ что пого́да хоро́шая.', translation: '今日は天気がよいので、歩いて家へ帰りたいです。' },
  ехать: { sentence: 'За́втра мы бу́дем е́хать в Москву́ на по́езде с друзья́ми.', translation: '明日は友人たちと列車でモスクワへ行きます。' },
  бежать: { sentence: 'Мне на́до бежа́ть на авто́бус, потому́ что я уже́ опа́здываю.', translation: 'もう遅れそうなので、バスへ走らなければなりません。' },
}

const makeVerbExample = (word: string, stressedWord: string, meaning: string): VocabularyExample => {
  const override = verbExampleOverrides[word]
  if (override) return override

  if (movementVerbs.has(word)) {
    return {
      sentence: `По выходны́м мы лю́бим ${stressedWord}, е́сли на у́лице хоро́шая пого́да.`,
      translation: `週末は天気がよければ「${meaning}」ことが好きです。`,
    }
  }

  if (learningVerbs.has(word)) {
    return {
      sentence: `Мне ва́жно ${stressedWord}, потому́ что я хочу́ лу́чше понима́ть ру́сский язы́к.`,
      translation: `ロシア語をもっと理解したいので、「${meaning}」ことが大切です。`,
    }
  }

  return {
    sentence: `Глаго́л «${stressedWord}» ча́сто встреча́ется в просты́х фра́зах, поэ́тому я хочу́ хорошо́ его́ запо́мнить.`,
    translation: `「${meaning}」という動詞は簡単なフレーズによく出るので、しっかり覚えたいです。`,
  }
}

export const makeVerb = (id: string, seed: WordSeed): VerbVocabularyItem => {
  const [word, stressedWord, meaning] = seed
  const forms = conjugateBare(word)
  const presentConjugation = forms ? withPronouns(forms) : undefined

  return {
    id,
    word,
    stressedWord,
    meaning,
    partOfSpeech: 'verb',
    aspect: 'imperfective',
    presentConjugation,
    example: makeVerbExample(word, stressedWord, meaning),
  }
}

const makeAdjectiveGrammar = (word: string): { forms: AdjectiveForms; declension: Record<RussianCase, AdjectiveForms> } => {
  const stem = word.slice(0, -2)
  const finalStemLetter = stem.at(-1) ?? ''
  const soft = word.endsWith('ний') || word === 'синий'
  const iEndingAfterHusher = word.endsWith('ий') && /[жшчщ]/u.test(finalStemLetter)
  const velarOrHusher = /[кгхжшчщ]/u.test(finalStemLetter)

  let forms: AdjectiveForms
  let genM: string
  let datM: string
  let insM: string
  let prepM: string
  let genF: string
  let pluralGen: string
  let pluralDat: string
  let pluralIns: string

  if (soft) {
    forms = { masculine: word, feminine: `${stem}яя`, neuter: `${stem}ее`, plural: `${stem}ие` }
    genM = `${stem}его`; datM = `${stem}ему`; insM = `${stem}им`; prepM = `${stem}ем`; genF = `${stem}ей`; pluralGen = `${stem}их`; pluralDat = `${stem}им`; pluralIns = `${stem}ими`
  } else if (iEndingAfterHusher) {
    forms = { masculine: word, feminine: `${stem}ая`, neuter: `${stem}ее`, plural: `${stem}ие` }
    genM = `${stem}его`; datM = `${stem}ему`; insM = `${stem}им`; prepM = `${stem}ем`; genF = `${stem}ей`; pluralGen = `${stem}их`; pluralDat = `${stem}им`; pluralIns = `${stem}ими`
  } else if (velarOrHusher) {
    forms = { masculine: word, feminine: `${stem}ая`, neuter: `${stem}ое`, plural: `${stem}ие` }
    genM = `${stem}ого`; datM = `${stem}ому`; insM = `${stem}им`; prepM = `${stem}ом`; genF = `${stem}ой`; pluralGen = `${stem}их`; pluralDat = `${stem}им`; pluralIns = `${stem}ими`
  } else {
    forms = { masculine: word, feminine: `${stem}ая`, neuter: `${stem}ое`, plural: `${stem}ые` }
    genM = `${stem}ого`; datM = `${stem}ому`; insM = `${stem}ым`; prepM = `${stem}ом`; genF = `${stem}ой`; pluralGen = `${stem}ых`; pluralDat = `${stem}ым`; pluralIns = `${stem}ыми`
  }

  return {
    forms,
    declension: {
      nominative: forms,
      genitive: { masculine: genM, feminine: genF, neuter: genM, plural: pluralGen },
      dative: { masculine: datM, feminine: genF, neuter: datM, plural: pluralDat },
      accusative: {
        masculine: `${forms.masculine} / ${genM}（有生）`,
        feminine: `${stem}${soft ? 'юю' : 'ую'}`,
        neuter: forms.neuter,
        plural: `${forms.plural} / ${pluralGen}（有生）`,
      },
      instrumental: { masculine: insM, feminine: genF, neuter: insM, plural: pluralIns },
      prepositional: { masculine: prepM, feminine: genF, neuter: prepM, plural: pluralGen },
    },
  }
}

const colorAdjectives = new Set(['белый', 'чёрный', 'красный', 'синий', 'зелёный', 'жёлтый', 'серый', 'коричневый'])
const languageAdjectives: Record<string, string> = {
  русский: 'ロシア語',
  японский: '日本語',
  английский: '英語',
  французский: 'フランス語',
  немецкий: 'ドイツ語',
}
const humanAdjectives = new Set(['старый', 'молодой', 'добрый', 'злой', 'умный', 'глупый', 'сильный', 'слабый', 'свободный', 'занятый'])

const makeAdjectiveExample = (word: string, stressedWord: string, meaning: string): VocabularyExample => {
  if (colorAdjectives.has(word)) {
    return {
      sentence: `На столе́ лежи́т ${stressedWord} каранда́ш, а ря́дом лежи́т бе́лая ру́чка.`,
      translation: `机の上には${meaning}鉛筆があり、その隣には白いペンがあります。`,
    }
  }

  const languageName = languageAdjectives[word]
  if (languageName) {
    return {
      sentence: `${capitalize(stressedWord)} язы́к мне интере́сен, поэ́тому я хочу́ занима́ться им ка́ждый день.`,
      translation: `${languageName}に興味があるので、毎日勉強したいです。`,
    }
  }

  if (humanAdjectives.has(word)) {
    return {
      sentence: `Э́то ${stressedWord} челове́к, и мы ча́сто ви́дим его́ на рабо́те.`,
      translation: `この人は${meaning}人で、私たちは職場でよく会います。`,
    }
  }

  return {
    sentence: `Прилага́тельное «${stressedWord}» ча́сто встреча́ется в описа́ниях, поэ́тому я хочу́ запо́мнить его́ вме́сте с существи́тельным.`,
    translation: `「${meaning}」という形容詞は描写でよく出るので、名詞と一緒に覚えたいです。`,
  }
}

export const makeAdjective = (id: string, seed: WordSeed): AdjectiveVocabularyItem => {
  const [word, stressedWord, meaning] = seed
  const grammar = makeAdjectiveGrammar(word)
  return {
    id,
    word,
    stressedWord,
    meaning,
    partOfSpeech: 'adjective',
    ...grammar,
    example: makeAdjectiveExample(word, stressedWord, meaning),
  }
}

const makeSimpleExample = (stressedWord: string, meaning: string): VocabularyExample => ({
  sentence: `В э́том предложе́нии сло́во «${stressedWord}» помога́ет пра́вильно поня́ть смысл, поэ́тому я чита́ю его́ внима́тельно.`,
  translation: `この文では「${meaning}」という語が意味を正しく理解する助けになるので、注意して読んでいます。`,
})

export const makeSimple = (
  id: string,
  seed: WordSeed,
  partOfSpeech: Exclude<VocabularyPartOfSpeech, 'noun' | 'verb' | 'adjective'>,
): SimpleVocabularyItem => ({
  id,
  word: seed[0],
  stressedWord: seed[1],
  meaning: seed[2],
  partOfSpeech,
  example: makeSimpleExample(seed[1], seed[2]),
})