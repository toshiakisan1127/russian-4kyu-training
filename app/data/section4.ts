// @ts-expect-error russian-nouns-js ships without TypeScript declarations.
import RussianNouns from 'russian-nouns-js'
import { vocabularyItems } from '~/data/vocabulary'
import type { NounVocabularyItem } from '~/types/vocabulary'
import { stressNounPluralBase } from '~/utils/russianStress'

export type Section4Question = {
  id: string
  lemma: string
  stressedLemma: string
  meaning: string
  plural: string
  stressedPlural: string
  rule: string
}

const section4Lemmas = [
  'книга', 'семья', 'дом', 'город', 'человек', 'друг', 'год', 'время', 'день', 'работа',
  'школа', 'университет', 'студент', 'студентка', 'учитель', 'учительница', 'язык', 'слово', 'вопрос', 'ответ',
  'имя', 'страна', 'улица', 'площадь', 'дорога', 'машина', 'автобус', 'поезд', 'вокзал', 'аэропорт',
  'билет', 'магазин', 'рынок', 'ресторан', 'гостиница', 'квартира', 'комната', 'окно', 'дверь', 'стол',
  'стул', 'кровать', 'шкаф', 'кухня', 'ванная', 'телефон', 'компьютер', 'телевизор', 'газета', 'журнал',
  'письмо', 'бумага', 'ручка', 'карандаш', 'тетрадь', 'словарь', 'урок', 'экзамен', 'задача', 'пример',
  'ошибка', 'правило', 'число', 'номер', 'страница', 'текст', 'песня', 'фильм', 'театр', 'музей',
  'парк', 'стадион', 'игра', 'мяч', 'команда', 'игрок', 'картина', 'фотография', 'цвет', 'муж',
  'жена', 'отец', 'мать', 'сын', 'дочь', 'брат', 'сестра', 'дедушка', 'бабушка', 'дядя',
  'тётя', 'ребёнок', 'мальчик', 'девочка', 'мужчина', 'женщина', 'врач', 'инженер', 'водитель', 'продавец',
] as const

const nounEngine = new RussianNouns.Engine()
const nounGender = {
  masculine: RussianNouns.Gender.MASCULINE,
  feminine: RussianNouns.Gender.FEMININE,
  neuter: RussianNouns.Gender.NEUTER,
} as const

const nouns = vocabularyItems.filter(
  (item): item is NounVocabularyItem => item.partOfSpeech === 'noun',
)
const nounsByWord = new Map(nouns.map((noun) => [noun.word, noun]))

const getPluralEndingStress = (noun: NounVocabularyItem) => {
  try {
    const lemma = RussianNouns.Lemma.create({
      text: noun.word,
      gender: nounGender[noun.gender],
      animate: noun.animate ?? false,
    })
    return nounEngine.sd.hasStressedEndingPlural(lemma, RussianNouns.CASES[0])?.[0] as boolean | undefined
  } catch {
    return undefined
  }
}

const specialPluralLemmas = new Set([
  'человек', 'друг', 'время', 'учитель', 'имя', 'поезд', 'окно', 'стул', 'муж', 'жена',
  'отец', 'мать', 'сын', 'дочь', 'брат', 'сестра', 'ребёнок',
])

const pluralRule = (noun: NounVocabularyItem) => {
  if (specialPluralLemmas.has(noun.word)) return '形・語幹やアクセントが変わるので、複数形をまとまりで覚える。'
  if (noun.plural.endsWith('ы')) return '主格複数では基本的に語尾が -ы になるタイプ。アクセント位置も合わせて確認する。'
  if (noun.plural.endsWith('и')) return '主格複数では語尾が -и になるタイプ。綴りとアクセント位置をセットで覚える。'
  if (noun.plural.endsWith('а') || noun.plural.endsWith('я')) return '主格複数が -а / -я になるタイプ。単数形から機械的に -ы / -и にしないよう注意。'
  return '主格複数形とアクセント位置をセットで覚える。'
}

export const section4Questions: Section4Question[] = section4Lemmas.map((lemma, index) => {
  const noun = nounsByWord.get(lemma)
  if (!noun) throw new Error(`Section IV noun is missing from vocabulary: ${lemma}`)
  if (noun.plural === '通常複数形なし' || noun.plural === '複数形のみ') {
    throw new Error(`Section IV noun does not have a singular-to-plural pair: ${lemma}`)
  }

  return {
    id: `section4-${String(index + 1).padStart(3, '0')}`,
    lemma: noun.word,
    stressedLemma: noun.stressedWord,
    meaning: noun.meaning,
    plural: noun.plural,
    stressedPlural: stressNounPluralBase(
      noun.word,
      noun.plural,
      noun.stressedWord,
      getPluralEndingStress(noun),
    ),
    rule: pluralRule(noun),
  }
})

if (section4Questions.length !== 100) {
  throw new Error(`Section IV question pool must contain 100 items, got ${section4Questions.length}`)
}

const invalidQuestions = section4Questions.filter((question) => {
  const plain = question.stressedPlural
    .normalize('NFD')
    .replace(/\u0301/gu, '')
    .normalize('NFC')
  return plain !== question.plural
})

if (invalidQuestions.length > 0) {
  throw new Error(`Section IV stress/plural mismatch: ${invalidQuestions.map((question) => question.lemma).join(', ')}`)
}

const missingStressQuestions = section4Questions.filter((question) => {
  const vowelCount = question.stressedPlural.match(/[аеёиоуыэюя]/giu)?.length ?? 0
  return vowelCount > 1 && !/[ёЁ\u0301]/u.test(question.stressedPlural)
})

if (missingStressQuestions.length > 0) {
  throw new Error(`Section IV plural stress is missing: ${missingStressQuestions.map((question) => question.lemma).join(', ')}`)
}
