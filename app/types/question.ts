export type QuestionChoice = {
  value: string
  explanation: string
}

export type MultipleChoiceQuestion = {
  id: string
  category: 'preposition'
  prompt: string
  answer: string
  correctExplanation: string
  choices: QuestionChoice[]
}
