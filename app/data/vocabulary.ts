import { bulkVocabularyItems } from './vocabularyBulk'
import { getVocabularyExample, vocabularyExampleCount } from './vocabularyExamples'
import type { VocabularyItem } from '~/types/vocabulary'

export type {
  AdjectiveForms,
  AdjectiveVocabularyItem,
  NounVocabularyItem,
  RussianCase,
  SimpleVocabularyItem,
  VerbConjugation,
  VerbVocabularyItem,
  VocabularyItem,
  VocabularyPartOfSpeech,
} from '~/types/vocabulary'

const coreVocabularyItems: VocabularyItem[] = [
  {
    id: 'vocab-001',
    word: 'книга',
    stressedWord: 'кни́га',
    meaning: '本',
    ipa: '/ˈknʲiɡə/',
    partOfSpeech: 'noun',
    gender: 'feminine',
    plural: 'книги',
    example: {
      sentence: 'Ве́чером я чита́ю э́ту кни́гу, потому́ что за́втра мы бу́дем говори́ть о ней на уро́ке.',
      translation: '明日の授業でこの本について話すので、今晩この本を読んでいます。',
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
    plural: 'семьи',
    example: {
      sentence: 'Моя́ семья́ живёт в Москве́, но ле́том мы ча́сто е́здим к ба́бушке.',
      translation: '私の家族はモスクワに住んでいますが、夏にはよく祖母のところへ行きます。',
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
      sentence: 'Ка́ждый ве́чер я чита́ю по-ру́сски, потому́ что хочу́ лу́чше понима́ть просты́е те́ксты.',
      translation: '簡単な文章をもっと理解したいので、毎晩ロシア語で読んでいます。',
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
      sentence: 'Мы купи́ли но́вый стол, потому́ что ста́рый стол был о́чень ма́ленький.',
      translation: '古い机がとても小さかったので、私たちは新しい机を買いました。',
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
    plural: 'воды',
    example: {
      sentence: 'По́сле футбо́ла я всегда́ пью во́ду, потому́ что о́чень хочу́ пить.',
      translation: 'サッカーの後はとても喉が渇くので、いつも水を飲みます。',
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

const rawVocabularyItems: VocabularyItem[] = [
  ...coreVocabularyItems,
  ...bulkVocabularyItems,
]

export const vocabularyItems: VocabularyItem[] = rawVocabularyItems.map((item) => ({
  ...item,
  example: getVocabularyExample(item.word),
}) as VocabularyItem)

if (vocabularyItems.length !== 579) {
  throw new Error(`Vocabulary pool must contain 579 items, got ${vocabularyItems.length}`)
}

if (vocabularyExampleCount !== vocabularyItems.length) {
  throw new Error(`Vocabulary examples must match the 579-word pool, got ${vocabularyExampleCount}`)
}

const exampleOwners = new Map<string, string>()
const duplicateExampleSentences: string[] = []
for (const item of vocabularyItems) {
  const sentence = item.example?.sentence
  if (!sentence) throw new Error(`Vocabulary item has no example: ${item.id}:${item.word}`)

  const existingWord = exampleOwners.get(sentence)
  if (existingWord) {
    duplicateExampleSentences.push(`${existingWord}/${item.word}`)
  } else {
    exampleOwners.set(sentence, item.word)
  }
}

if (duplicateExampleSentences.length > 0) {
  throw new Error(`Vocabulary examples must be unique: ${duplicateExampleSentences.join(', ')}`)
}

const stripStress = (text: string) => text
  .normalize('NFD')
  .replace(/\u0301/g, '')
  .normalize('NFC')

const tokenNeedsStressMark = (token: string) => {
  const vowelCount = token.match(/[аеёиоуыэюя]/giu)?.length ?? 0
  return vowelCount > 1
}

const tokenHasStressMark = (token: string) => /[ёЁ\u0301]/u.test(token)

const invalidStressItems = vocabularyItems.filter((item) => {
  if (stripStress(item.stressedWord) !== item.word) return true

  return item.stressedWord
    .split(/[\s-]+/u)
    .filter(Boolean)
    .some((token) => tokenNeedsStressMark(token) && !tokenHasStressMark(token))
})

if (invalidStressItems.length > 0) {
  throw new Error(`Vocabulary stress metadata is invalid: ${invalidStressItems.map((item) => `${item.id}:${item.stressedWord}`).join(', ')}`)
}
