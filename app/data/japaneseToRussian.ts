import { russianToJapaneseQuestions } from './russianToJapanese'

export type JapaneseToRussianQuestion = {
  id: string
  prompt: string
  answer: string
  topic: string
  vocabulary: string[]
  grammar: string[]
}

export const japaneseToRussianQuestions: JapaneseToRussianQuestion[] = russianToJapaneseQuestions.map((question) => ({
  id: question.id.replace('ru-ja-', 'ja-ru-'),
  prompt: question.translation,
  answer: question.sentence,
  topic: question.topic,
  vocabulary: question.vocabulary,
  grammar: question.grammar,
}))
