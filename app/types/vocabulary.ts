export type RussianCase = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional'

export type VocabularyPartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'numeral'
  | 'particle'

export type VocabularyExample = {
  sentence: string
  translation: string
  ipa?: string
}

export type VocabularyBase = {
  id: string
  word: string
  stressedWord: string
  meaning: string
  ipa?: string
  example?: VocabularyExample
}

export type NounVocabularyItem = VocabularyBase & {
  partOfSpeech: 'noun'
  gender: 'masculine' | 'feminine' | 'neuter'
  plural: string
  animate?: boolean
  declension?: Record<RussianCase, string>
}

export type VerbConjugation = {
  firstSingular: string
  secondSingular: string
  thirdSingular: string
  firstPlural: string
  secondPlural: string
  thirdPlural: string
}

export type VerbVocabularyItem = VocabularyBase & {
  partOfSpeech: 'verb'
  aspect: 'imperfective' | 'perfective'
  presentConjugation?: VerbConjugation
}

export type AdjectiveForms = {
  masculine: string
  feminine: string
  neuter: string
  plural: string
}

export type AdjectiveVocabularyItem = VocabularyBase & {
  partOfSpeech: 'adjective'
  forms?: AdjectiveForms
  declension?: Record<RussianCase, AdjectiveForms>
}

export type SimpleVocabularyItem = VocabularyBase & {
  partOfSpeech: Exclude<VocabularyPartOfSpeech, 'noun' | 'verb' | 'adjective'>
}

export type VocabularyItem =
  | NounVocabularyItem
  | VerbVocabularyItem
  | AdjectiveVocabularyItem
  | SimpleVocabularyItem
