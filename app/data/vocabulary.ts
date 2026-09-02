export type RussianCase = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional'

export type VocabularyExample = {
  sentence: string
  translation: string
  ipa: string
}

type VocabularyBase = {
  id: string
  word: string
  stressedWord: string
  meaning: string
  ipa: string
  example: VocabularyExample
}

export type NounVocabularyItem = VocabularyBase & {
  partOfSpeech: 'noun'
  gender: 'masculine' | 'feminine' | 'neuter'
  declension: Record<RussianCase, string>
}

export type VerbVocabularyItem = VocabularyBase & {
  partOfSpeech: 'verb'
  aspect: 'imperfective' | 'perfective'
  presentConjugation: {
    firstSingular: string
    secondSingular: string
    thirdSingular: string
    firstPlural: string
    secondPlural: string
    thirdPlural: string
  }
}

export type AdjectiveForms = {
  masculine: string
  feminine: string
  neuter: string
  plural: string
}

export type AdjectiveVocabularyItem = VocabularyBase & {
  partOfSpeech: 'adjective'
  forms: AdjectiveForms
  declension: Record<RussianCase, AdjectiveForms>
}

export type VocabularyItem = NounVocabularyItem | VerbVocabularyItem | AdjectiveVocabularyItem

export const vocabularyItems: VocabularyItem[] = [
  {
    id: 'vocab-001',
    word: 'книга',
    stressedWord: 'кни́га',
    meaning: '本',
    ipa: '/ˈknʲiɡə/',
    partOfSpeech: 'noun',
    gender: 'feminine',
    example: {
      sentence: 'Э́то моя́ кни́га.',
      translation: 'これは私の本です。',
      ipa: '/ˈɛtə mɐˈja ˈknʲiɡə/',
    },
    declension: {
      nominative: 'кни́га',
      genitive: 'кни́ги',
      dative: 'кни́ге',
      accusative: 'кни́гу',
      instrumental: 'кни́гой',
      prepositional: 'кни́ге',
    },
  },
  {
    id: 'vocab-002',
    word: 'семья',
    stressedWord: 'семья́',
    meaning: '家族',
    ipa: '/sʲɪˈmʲja/',
    partOfSpeech: 'noun',
    gender: 'feminine',
    example: {
      sentence: 'Моя́ семья́ живёт в Москве́.',
      translation: '私の家族はモスクワに住んでいます。',
      ipa: '/mɐˈja sʲɪˈmʲja ʐɨˈvʲɵt v mɐskˈvʲe/',
    },
    declension: {
      nominative: 'семья́',
      genitive: 'семьи́',
      dative: 'семье́',
      accusative: 'семью́',
      instrumental: 'семьёй',
      prepositional: 'семье́',
    },
  },
  {
    id: 'vocab-003',
    word: 'читать',
    stressedWord: 'чита́ть',
    meaning: '読む',
    ipa: '/tɕɪˈtatʲ/',
    partOfSpeech: 'verb',
    aspect: 'imperfective',
    example: {
      sentence: 'Я чита́ю кни́гу.',
      translation: '私は本を読んでいます。',
      ipa: '/ja tɕɪˈtajʊ ˈknʲiɡʊ/',
    },
    presentConjugation: {
      firstSingular: 'я чита́ю',
      secondSingular: 'ты чита́ешь',
      thirdSingular: 'он / она́ чита́ет',
      firstPlural: 'мы чита́ем',
      secondPlural: 'вы чита́ете',
      thirdPlural: 'они́ чита́ют',
    },
  },
  {
    id: 'vocab-004',
    word: 'новый',
    stressedWord: 'но́вый',
    meaning: '新しい',
    ipa: '/ˈnovɨj/',
    partOfSpeech: 'adjective',
    example: {
      sentence: 'У меня́ но́вая кни́га.',
      translation: '私は新しい本を持っています。',
      ipa: '/u mʲɪˈnʲa ˈnovəjə ˈknʲiɡə/',
    },
    forms: {
      masculine: 'но́вый',
      feminine: 'но́вая',
      neuter: 'но́вое',
      plural: 'но́вые',
    },
    declension: {
      nominative: { masculine: 'но́вый', feminine: 'но́вая', neuter: 'но́вое', plural: 'но́вые' },
      genitive: { masculine: 'но́вого', feminine: 'но́вой', neuter: 'но́вого', plural: 'но́вых' },
      dative: { masculine: 'но́вому', feminine: 'но́вой', neuter: 'но́вому', plural: 'но́вым' },
      accusative: { masculine: 'но́вый / но́вого（有生）', feminine: 'но́вую', neuter: 'но́вое', plural: 'но́вые / но́вых（有生）' },
      instrumental: { masculine: 'но́вым', feminine: 'но́вой', neuter: 'но́вым', plural: 'но́выми' },
      prepositional: { masculine: 'но́вом', feminine: 'но́вой', neuter: 'но́вом', plural: 'но́вых' },
    },
  },
  {
    id: 'vocab-005',
    word: 'вода',
    stressedWord: 'вода́',
    meaning: '水',
    ipa: '/vɐˈda/',
    partOfSpeech: 'noun',
    gender: 'feminine',
    example: {
      sentence: 'Я пью во́ду.',
      translation: '私は水を飲みます。',
      ipa: '/ja pʲju ˈvodʊ/',
    },
    declension: {
      nominative: 'вода́',
      genitive: 'воды́',
      dative: 'воде́',
      accusative: 'во́ду',
      instrumental: 'водо́й',
      prepositional: 'воде́',
    },
  },
]
