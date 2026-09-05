import type { VocabularyExample } from '~/types/vocabulary'
import { adjectiveExampleData } from './vocabularyExamplesAdjectives'
import { vocabularyExampleLevel4Corrections } from './vocabularyExampleLevel4Corrections'
import { nounExampleDataA } from './vocabularyExamplesNounsA'
import { nounExampleDataB } from './vocabularyExamplesNounsB'
import { simpleExampleData } from './vocabularyExamplesSimple'
import { verbExampleData } from './vocabularyExamplesVerbs'

const sources = [
  nounExampleDataA,
  nounExampleDataB,
  verbExampleData,
  adjectiveExampleData,
  simpleExampleData,
]

const exampleMap = new Map<string, VocabularyExample>()

for (const source of sources) {
  for (const line of source.split('\n')) {
    const parts = line.split('|')
    if (parts.length !== 3) {
      throw new Error(`Vocabulary example line must have exactly 3 columns: ${line}`)
    }

    const [word, sentence, translation] = parts
    if (!word || !sentence || !translation) {
      throw new Error(`Vocabulary example has an empty field: ${line}`)
    }

    if (exampleMap.has(word)) {
      throw new Error(`Duplicate vocabulary example key: ${word}`)
    }

    exampleMap.set(word, { sentence, translation })
  }
}

for (const [word, example] of Object.entries(vocabularyExampleLevel4Corrections)) {
  if (!exampleMap.has(word)) {
    throw new Error(`Level 4 vocabulary example correction has an unknown key: ${word}`)
  }
  exampleMap.set(word, example)
}

export const vocabularyExampleCount = exampleMap.size

if (vocabularyExampleCount !== 579) {
  throw new Error(`Vocabulary example catalog must contain 579 items, got ${vocabularyExampleCount}`)
}

export const getVocabularyExample = (word: string): VocabularyExample => {
  const example = exampleMap.get(word)
  if (!example) {
    throw new Error(`Missing individual vocabulary example for: ${word}`)
  }
  return example
}
