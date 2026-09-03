import { questions as coreQuestions } from './questions'
import { extraPrepositionQuestions } from './prepositionPool'
import type { MultipleChoiceQuestion } from '~/types/question'

export const prepositionQuestions: MultipleChoiceQuestion[] = [
  ...coreQuestions,
  ...extraPrepositionQuestions,
]

if (prepositionQuestions.length !== 100) {
  throw new Error(`Preposition pool must contain 100 items, got ${prepositionQuestions.length}`)
}
