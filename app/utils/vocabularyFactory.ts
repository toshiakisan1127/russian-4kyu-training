import type {
  AdjectiveForms,
  AdjectiveVocabularyItem,
  NounVocabularyItem,
  RussianCase,
  SimpleVocabularyItem,
  VerbConjugation,
  VerbVocabularyItem,
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

const stripStress = (text: string) => text.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')

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
  животное: { nominative: 'животное', genitive: 'животного', dative: 'животному', accusative: 'животное', instrumental: 'животным', prepositional: 'животном' },
}

const indeclinableNouns = new Set(['метро', 'кафе', 'радио', 'меню', 'пальто'])
const pluralOnlyNouns = new Set(['деньги', 'брюки'])
const spellingRuleLetters = new Set(['г', 'к', 'х', 'ж', 'ч', 'ш', 'щ'])

const makeNounDeclension = (
  word: string,
  gender: 'masculine' | 'feminine' | 'neuter',
  animate = false,
): Record<RussianCase, string> | undefined => {
  if (pluralOnlyNouns.has(word) || word.includes(' ')) return undefined
  if (nounSpecialDeclensions[word]) return nounSpecialDeclensions[word]
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
    example: {
      sentence: `Это ${stressedWord}.`,
      translation: `これは「${meaning}」です。`,
    },
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
  if (verbOverrides[word]) return verbOverrides[word]

  if (word.endsWith('ся') || word.endsWith('сь')) {
    const base = word.slice(0, -2)
    const baseForms = conjugateBare(base)
    if (!baseForms) return undefined
    return baseForms.map(addReflexive) as unknown as readonly [string, string, string, string, string, string]
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
    example: presentConjugation
      ? { sentence: `${presentConjugation.firstSingular.replace(/^я /, 'Я ')}.`, translation: `私は「${meaning}」。` }
      : undefined,
  }
}

const makeAdjectiveGrammar = (word: string): { forms: AdjectiveForms; declension: Record<RussianCase, AdjectiveForms> } => {
  const soft = word.endsWith('ний') || word === 'синий'
  const velar = /[кгх]ий$/u.test(word)
  const husher = /[жшчщ]ий$/u.test(word)
  const ending = word.endsWith('ый') || word.endsWith('ой') ? 2 : 2
  const stem = word.slice(0, -ending)

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
  } else if (velar) {
    forms = { masculine: word, feminine: `${stem}ая`, neuter: `${stem}ое`, plural: `${stem}ие` }
    genM = `${stem}ого`; datM = `${stem}ому`; insM = `${stem}им`; prepM = `${stem}ом`; genF = `${stem}ой`; pluralGen = `${stem}их`; pluralDat = `${stem}им`; pluralIns = `${stem}ими`
  } else if (husher) {
    forms = { masculine: word, feminine: `${stem}ая`, neuter: `${stem}ее`, plural: `${stem}ие` }
    genM = `${stem}его`; datM = `${stem}ему`; insM = `${stem}им`; prepM = `${stem}ем`; genF = `${stem}ей`; pluralGen = `${stem}их`; pluralDat = `${stem}им`; pluralIns = `${stem}ими`
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
    example: { sentence: `Это ${grammar.forms.masculine} дом.`, translation: `これは「${meaning}」家です。` },
  }
}

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
})
