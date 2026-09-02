export type QuestionChoice = {
  value: string
  explanation: string
}

export type MultipleChoiceQuestion = {
  id: string
  category: 'preposition'
  prompt: string
  translation: string
  answer: string
  correctExplanation: string
  choices: QuestionChoice[]
}
