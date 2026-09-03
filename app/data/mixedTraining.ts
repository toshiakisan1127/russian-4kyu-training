import { caseTrainingQuestions } from '~/data/caseTraining'
import { questions } from '~/data/questions'
import { verbTrainingQuestions } from '~/data/verbTraining'
import { vocabularyItems } from '~/data/vocabulary'

export type MixedTrainingSource = 'preposition' | 'cases' | 'verbs' | 'vocabulary'

export type MixedTrainingQuestion = {
  id: string
  source: MixedTrainingSource
  sourceLabel: string
  prompt: string
  subtext?: string
  correctAnswer: string
  choices: string[]
  choiceExplanations?: Record<string, string>
  answerSentence: string
  answerTranslation?: string
  explanation: string
}

const prepositionQuestions: MixedTrainingQuestion[] = questions.map((question) => ({
  id: `mixed-${question.id}`,
  source: 'preposition',
  sourceLabel: '前置詞',
  prompt: question.prompt,
  subtext: question.translation,
  correctAnswer: question.answer,
  choices: question.choices.map((choice) => choice.value),
  choiceExplanations: Object.fromEntries(question.choices.map((choice) => [choice.value, choice.explanation])),
  answerSentence: question.fullSentence,
  answerTranslation: question.translation,
  explanation: question.correctExplanation,
}))

const caseQuestions: MixedTrainingQuestion[] = caseTrainingQuestions.map((question) => ({
  id: `mixed-${question.id}`,
  source: 'cases',
  sourceLabel: '格変化',
  prompt: `${question.before} ___${question.after}`,
  subtext: `基本形: ${question.basePhrase}`,
  correctAnswer: question.correctPhrase,
  choices: question.choices,
  choiceExplanations: question.choiceExplanations,
  answerSentence: `${question.before} ${question.correctPhrase}${question.after}`,
  answerTranslation: question.answerTranslation,
  explanation: `${question.caseLabel}: ${question.explanation}`,
}))

const verbQuestions: MixedTrainingQuestion[] = verbTrainingQuestions.map((question) => ({
  id: `mixed-${question.id}`,
  source: 'verbs',
  sourceLabel: '動詞',
  prompt: question.prompt,
  subtext: `${question.infinitive} — ${question.meaning}`,
  correctAnswer: question.correctAnswer,
  choices: question.choices,
  choiceExplanations: question.choiceExplanations,
  answerSentence: question.answerSentence,
  answerTranslation: question.answerTranslation ?? question.meaning,
  explanation: question.explanation,
}))

const getVocabularyChoices = (index: number) => {
  const item = vocabularyItems[index]!
  const choices = [item.meaning]
  const seen = new Set(choices)

  const preferred = vocabularyItems.filter((candidate) => candidate.id !== item.id && candidate.partOfSpeech === item.partOfSpeech)
  const fallback = vocabularyItems.filter((candidate) => candidate.id !== item.id)

  for (const candidate of [...preferred, ...fallback]) {
    if (seen.has(candidate.meaning)) continue
    seen.add(candidate.meaning)
    choices.push(candidate.meaning)
    if (choices.length === 4) break
  }

  return choices
}

const vocabularyQuestions: MixedTrainingQuestion[] = vocabularyItems.map((item, index) => {
  const choices = getVocabularyChoices(index)
  const choiceExplanations = Object.fromEntries(choices.map((choice) => [
    choice,
    choice === item.meaning
      ? `${item.stressedWord}の意味は「${item.meaning}」。この問題の正解。`
      : `「${choice}」という意味の選択肢。この単語「${item.stressedWord}」の意味ではない。`,
  ]))

  return {
  id: `mixed-vocab-${item.id}`,
  source: 'vocabulary',
  sourceLabel: '語彙',
  prompt: item.stressedWord,
  subtext: 'この単語の意味を選びなさい。',
  correctAnswer: item.meaning,
  choices,
  choiceExplanations,
  answerSentence: item.example?.sentence ?? `${item.stressedWord} — ${item.meaning}`,
  answerTranslation: item.example?.translation ?? item.meaning,
  explanation: item.example
    ? `${item.stressedWord} は「${item.meaning}」。例: ${item.example.sentence}（${item.example.translation}）`
    : `${item.stressedWord} は「${item.meaning}」。`,
  }
})
export const mixedTrainingQuestions: MixedTrainingQuestion[] = [
  ...prepositionQuestions,
  ...caseQuestions,
  ...verbQuestions,
  ...vocabularyQuestions,
]

export const mixedTrainingSources: { key: MixedTrainingSource; label: string }[] = [
  { key: 'preposition', label: '前置詞' },
  { key: 'cases', label: '格変化' },
  { key: 'verbs', label: '動詞' },
  { key: 'vocabulary', label: '語彙' },
]
