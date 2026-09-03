import { vocabularyItems } from '~/data/vocabulary'
import type { AdjectiveVocabularyItem, NounVocabularyItem, RussianCase } from '~/types/vocabulary'

export type Section5TargetCase = Exclude<RussianCase, 'nominative'>

export type Section5Question = {
  id: string
  targetCase: Section5TargetCase
  caseLabel: string
  before: string
  after: string
  basePhrase: string
  correctPhrase: string
  choices: string[]
  meaning: string
  answerTranslation: string
  explanation: string
}

type Determiner = 'этот' | 'мой' | 'наш'
type PhraseSeed = {
  determiner: Determiner
  adjective: string
  noun: string
}

const caseLabels: Record<Section5TargetCase, string> = {
  genitive: '生格',
  dative: '与格',
  accusative: '対格',
  instrumental: '造格',
  prepositional: '前置格',
}

const contexts: Record<Section5TargetCase, { before: string; after: string; explanation: string }> = {
  genitive: {
    before: 'Зде́сь не́т',
    after: '.',
    explanation: 'не́т の後の名詞句は生格になる。',
  },
  dative: {
    before: 'Я подошёл к',
    after: '.',
    explanation: 'к + 与格で「〜のところへ・〜に近づいて」を表す。',
  },
  accusative: {
    before: 'Я ви́жу',
    after: '.',
    explanation: 'ви́деть の直接目的語なので対格になる。',
  },
  instrumental: {
    before: 'Я стою́ пе́ред',
    after: '.',
    explanation: 'пе́ред + 造格で「〜の前に」を表す。',
  },
  prepositional: {
    before: 'Мы говори́м о́б',
    after: '.',
    explanation: 'о́б + 前置格で「〜について」を表す。',
  },
}

const seeds: PhraseSeed[] = [
  { determiner: 'этот', adjective: 'новый', noun: 'студент' },
  { determiner: 'мой', adjective: 'хороший', noun: 'учитель' },
  { determiner: 'наш', adjective: 'молодой', noun: 'инженер' },
  { determiner: 'этот', adjective: 'новый', noun: 'стол' },
  { determiner: 'мой', adjective: 'большой', noun: 'город' },
  { determiner: 'наш', adjective: 'старый', noun: 'дом' },
  { determiner: 'этот', adjective: 'красивый', noun: 'парк' },
  { determiner: 'мой', adjective: 'русский', noun: 'язык' },
  { determiner: 'наш', adjective: 'маленький', noun: 'магазин' },
  { determiner: 'этот', adjective: 'новый', noun: 'компьютер' },
  { determiner: 'мой', adjective: 'новый', noun: 'книга' },
  { determiner: 'наш', adjective: 'большой', noun: 'школа' },
  { determiner: 'этот', adjective: 'русский', noun: 'газета' },
  { determiner: 'мой', adjective: 'красивый', noun: 'улица' },
  { determiner: 'наш', adjective: 'маленький', noun: 'комната' },
  { determiner: 'этот', adjective: 'добрый', noun: 'женщина' },
  { determiner: 'мой', adjective: 'новый', noun: 'письмо' },
  { determiner: 'наш', adjective: 'большой', noun: 'окно' },
  { determiner: 'этот', adjective: 'русский', noun: 'слово' },
  { determiner: 'мой', adjective: 'маленький', noun: 'озеро' },
]

const nounMap = new Map(
  vocabularyItems
    .filter((item): item is NounVocabularyItem => item.partOfSpeech === 'noun')
    .map((item) => [item.word, item]),
)
const adjectiveMap = new Map(
  vocabularyItems
    .filter((item): item is AdjectiveVocabularyItem => item.partOfSpeech === 'adjective')
    .map((item) => [item.word, item]),
)

const determinerMeanings: Record<Determiner, string> = {
  этот: 'この',
  мой: '私の',
  наш: '私たちの',
}

const adjectiveMeanings: Record<string, string> = {
  новый: '新しい',
  хороший: 'よい',
  молодой: '若い',
  большой: '大きい',
  старый: '古い',
  красивый: '美しい',
  русский: 'ロシアの',
  маленький: '小さい',
  добрый: '優しい',
}

const phraseTranslation = (seed: PhraseSeed, noun: NounVocabularyItem) =>
  `${determinerMeanings[seed.determiner]}${adjectiveMeanings[seed.adjective]}${noun.meaning}`

const answerTranslation = (
  targetCase: Section5TargetCase,
  phrase: string,
  animate: boolean,
) => {
  switch (targetCase) {
    case 'genitive':
      return `ここには${phrase}が${animate ? 'いません' : 'ありません'}。`
    case 'dative':
      return `私は${phrase}に近づきました。`
    case 'accusative':
      return `私は${phrase}を見ます。`
    case 'instrumental':
      return `私は${phrase}の前に立っています。`
    case 'prepositional':
      return `私たちは${phrase}について話しています。`
  }
}

const allCases: RussianCase[] = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional']

const determinerForms: Record<Determiner, Record<NounVocabularyItem['gender'], Record<RussianCase, string>>> = {
  этот: {
    masculine: { nominative: 'этот', genitive: 'этого', dative: 'этому', accusative: 'этот', instrumental: 'этим', prepositional: 'этом' },
    feminine: { nominative: 'эта', genitive: 'этой', dative: 'этой', accusative: 'эту', instrumental: 'этой', prepositional: 'этой' },
    neuter: { nominative: 'это', genitive: 'этого', dative: 'этому', accusative: 'это', instrumental: 'этим', prepositional: 'этом' },
  },
  мой: {
    masculine: { nominative: 'мой', genitive: 'моего', dative: 'моему', accusative: 'мой', instrumental: 'моим', prepositional: 'моём' },
    feminine: { nominative: 'моя', genitive: 'моей', dative: 'моей', accusative: 'мою', instrumental: 'моей', prepositional: 'моей' },
    neuter: { nominative: 'моё', genitive: 'моего', dative: 'моему', accusative: 'моё', instrumental: 'моим', prepositional: 'моём' },
  },
  наш: {
    masculine: { nominative: 'наш', genitive: 'нашего', dative: 'нашему', accusative: 'наш', instrumental: 'нашим', prepositional: 'нашем' },
    feminine: { nominative: 'наша', genitive: 'нашей', dative: 'нашей', accusative: 'нашу', instrumental: 'нашей', prepositional: 'нашей' },
    neuter: { nominative: 'наше', genitive: 'нашего', dative: 'нашему', accusative: 'наше', instrumental: 'нашим', prepositional: 'нашем' },
  },
}

const cleanAlternative = (value: string, animate: boolean) => {
  const alternatives = value.split(/\s*\/\s*/u)
  if (alternatives.length === 1) return alternatives[0]!.replace(/（.*?）/gu, '').trim()
  const selected = animate ? alternatives.at(-1)! : alternatives[0]!
  return selected.replace(/（.*?）/gu, '').trim()
}

const buildPhrase = (seed: PhraseSeed, caseKey: RussianCase) => {
  const noun = nounMap.get(seed.noun)
  const adjective = adjectiveMap.get(seed.adjective)
  if (!noun) throw new Error(`Section V noun is missing: ${seed.noun}`)
  if (!adjective) throw new Error(`Section V adjective is missing: ${seed.adjective}`)
  if (!noun.declension) throw new Error(`Section V noun declension is missing: ${seed.noun}`)

  const gender = noun.gender
  const animateAccusative = caseKey === 'accusative' && noun.animate === true
  const determiner = determinerForms[seed.determiner][gender][caseKey]
  const determinerValue = caseKey === 'accusative' && gender === 'masculine' && animateAccusative
    ? seed.determiner === 'этот' ? 'этого' : seed.determiner === 'мой' ? 'моего' : 'нашего'
    : determiner
  const adjectiveValue = cleanAlternative(adjective.declension[caseKey][gender], animateAccusative)
  const nounValue = noun.declension[caseKey]

  return `${determinerValue} ${adjectiveValue} ${nounValue}`
}

const targetCases: Section5TargetCase[] = ['genitive', 'dative', 'accusative', 'instrumental', 'prepositional']

export const section5Questions: Section5Question[] = seeds.flatMap((seed, seedIndex) =>
  targetCases.map((targetCase, caseIndex) => {
    const noun = nounMap.get(seed.noun)
    if (!noun) throw new Error(`Section V noun is missing: ${seed.noun}`)

    const correctPhrase = buildPhrase(seed, targetCase)
    const distractorCandidates = allCases
      .filter((caseKey) => caseKey !== targetCase)
      .map((caseKey) => buildPhrase(seed, caseKey))
      .filter((phrase, index, array) => phrase !== correctPhrase && array.indexOf(phrase) === index)

    if (distractorCandidates.length < 2) {
      throw new Error(`Section V needs two distinct distractors: ${seed.noun}/${targetCase}`)
    }

    const context = contexts[targetCase]
    return {
      id: `section5-${String(seedIndex * targetCases.length + caseIndex + 1).padStart(3, '0')}`,
      targetCase,
      caseLabel: caseLabels[targetCase],
      before: context.before,
      after: context.after,
      basePhrase: buildPhrase(seed, 'nominative'),
      correctPhrase,
      choices: [correctPhrase, distractorCandidates[0]!, distractorCandidates[1]!],
      meaning: noun.meaning,
      answerTranslation: answerTranslation(targetCase, phraseTranslation(seed, noun), noun.animate === true),
      explanation: context.explanation,
    }
  }),
)

if (section5Questions.length !== 100) {
  throw new Error(`Section V question pool must contain 100 items, got ${section5Questions.length}`)
}

const invalidQuestions = section5Questions.filter((question) => new Set(question.choices).size !== 3)
if (invalidQuestions.length > 0) {
  throw new Error(`Section V choices must be distinct: ${invalidQuestions.map((question) => question.id).join(', ')}`)
}
