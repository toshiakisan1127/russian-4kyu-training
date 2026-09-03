// @ts-expect-error russian-nouns-js ships without TypeScript declarations.
import RussianNouns from 'russian-nouns-js'
import { vocabularyItems } from '~/data/vocabulary'
import type { NounVocabularyItem } from '~/types/vocabulary'
import { stressNounPluralBase, stripStress } from '~/utils/russianStress'

export type Section3Pronoun = 'он' | 'она' | 'оно' | 'они'

export type Section3Question = {
  id: string
  word: string
  stressedWord: string
  meaning: string
  number: 'singular' | 'plural'
  gender: NounVocabularyItem['gender']
  lemma: string
  stressedLemma: string
  plural: string
  correctPronoun: Section3Pronoun
}

export const section3Pronouns: { value: Section3Pronoun; stressed: string }[] = [
  { value: 'он', stressed: 'он' },
  { value: 'она', stressed: 'она́' },
  { value: 'оно', stressed: 'оно́' },
  { value: 'они', stressed: 'они́' },
]

const genderPronoun: Record<NounVocabularyItem['gender'], Section3Pronoun> = {
  masculine: 'он',
  feminine: 'она',
  neuter: 'оно',
}

const nounEngine = new RussianNouns.Engine()
const nounGender = {
  masculine: RussianNouns.Gender.MASCULINE,
  feminine: RussianNouns.Gender.FEMININE,
  neuter: RussianNouns.Gender.NEUTER,
} as const
const indeclinableNouns = new Set(['метро', 'кафе', 'кофе', 'радио', 'меню', 'пальто'])

const nouns = vocabularyItems.filter(
  (item): item is NounVocabularyItem => item.partOfSpeech === 'noun',
)

const getStressedPlural = (noun: NounVocabularyItem) => {
  if (noun.plural === '通常複数形なし' || noun.plural === '複数形のみ') return noun.plural

  try {
    const lemma = RussianNouns.Lemma.create({
      text: noun.word,
      gender: nounGender[noun.gender],
      animate: noun.animate ?? false,
      indeclinable: indeclinableNouns.has(noun.word),
    })
    const endingStress = nounEngine.sd.hasStressedEndingPlural(lemma, RussianNouns.CASES[0])?.[0] as boolean | undefined
    return stressNounPluralBase(noun.word, noun.plural, noun.stressedWord, endingStress)
  } catch {
    return stressNounPluralBase(noun.word, noun.plural, noun.stressedWord)
  }
}

const singularNouns = nouns.filter((noun) => noun.plural !== '複数形のみ')

const takeGender = (gender: NounVocabularyItem['gender']) => {
  const selected = singularNouns.filter((noun) => noun.gender === gender).slice(0, 25)
  if (selected.length !== 25) {
    throw new Error(`Section III needs 25 ${gender} nouns, got ${selected.length}`)
  }
  return selected
}

const singularQuestions = (['masculine', 'feminine', 'neuter'] as const).flatMap((gender) =>
  takeGender(gender).map((noun) => ({
    word: noun.word,
    stressedWord: noun.stressedWord,
    meaning: noun.meaning,
    number: 'singular' as const,
    gender: noun.gender,
    lemma: noun.word,
    stressedLemma: noun.stressedWord,
    plural: getStressedPlural(noun),
    correctPronoun: genderPronoun[noun.gender],
  })),
)

const pluralForms: { lemma: string; stressedForm: string }[] = [
  { lemma: 'книга', stressedForm: 'кни́ги' },
  { lemma: 'семья', stressedForm: 'семьи́' },
  { lemma: 'дом', stressedForm: 'дома́' },
  { lemma: 'город', stressedForm: 'города́' },
  { lemma: 'человек', stressedForm: 'лю́ди' },
  { lemma: 'друг', stressedForm: 'друзья́' },
  { lemma: 'год', stressedForm: 'го́ды' },
  { lemma: 'день', stressedForm: 'дни' },
  { lemma: 'работа', stressedForm: 'рабо́ты' },
  { lemma: 'школа', stressedForm: 'шко́лы' },
  { lemma: 'университет', stressedForm: 'университе́ты' },
  { lemma: 'студент', stressedForm: 'студе́нты' },
  { lemma: 'язык', stressedForm: 'языки́' },
  { lemma: 'слово', stressedForm: 'слова́' },
  { lemma: 'вопрос', stressedForm: 'вопро́сы' },
  { lemma: 'улица', stressedForm: 'у́лицы' },
  { lemma: 'машина', stressedForm: 'маши́ны' },
  { lemma: 'автобус', stressedForm: 'авто́бусы' },
  { lemma: 'поезд', stressedForm: 'поезда́' },
  { lemma: 'билет', stressedForm: 'биле́ты' },
  { lemma: 'магазин', stressedForm: 'магази́ны' },
  { lemma: 'ресторан', stressedForm: 'рестора́ны' },
  { lemma: 'квартира', stressedForm: 'кварти́ры' },
  { lemma: 'комната', stressedForm: 'ко́мнаты' },
  { lemma: 'окно', stressedForm: 'о́кна' },
]

const pluralQuestions = pluralForms.map(({ lemma, stressedForm }) => {
  const noun = nouns.find((item) => item.word === lemma)
  if (!noun) throw new Error(`Section III plural noun is missing from vocabulary: ${lemma}`)
  if (stripStress(stressedForm) !== noun.plural) {
    throw new Error(`Section III plural form mismatch for ${lemma}: ${stressedForm} / ${noun.plural}`)
  }

  return {
    word: noun.plural,
    stressedWord: stressedForm,
    meaning: noun.meaning,
    number: 'plural' as const,
    gender: noun.gender,
    lemma: noun.word,
    stressedLemma: noun.stressedWord,
    plural: stressedForm,
    correctPronoun: 'они' as const,
  }
})

const rawQuestions = [...singularQuestions, ...pluralQuestions]

export const section3Questions: Section3Question[] = rawQuestions.map((question, index) => ({
  id: `section3-${String(index + 1).padStart(3, '0')}`,
  ...question,
}))

if (section3Questions.length !== 100) {
  throw new Error(`Section III question pool must contain 100 items, got ${section3Questions.length}`)
}
