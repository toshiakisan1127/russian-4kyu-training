import { section5Questions, type Section5TargetCase } from '~/data/section5'

export type CaseTrainingFilter = 'all' | Section5TargetCase

export const caseTrainingQuestions = section5Questions.map((question) => ({
  ...question,
  id: question.id.replace('section5-', 'case-training-'),
}))

export const caseTrainingFilters: { key: CaseTrainingFilter; label: string; hint: string }[] = [
  { key: 'all', label: '全部', hint: '5つの格を混ぜて練習' },
  { key: 'genitive', label: '生格', hint: 'нет / из / после など' },
  { key: 'dative', label: '与格', hint: 'к / звонить など' },
  { key: 'accusative', label: '対格', hint: '直接目的語・方向' },
  { key: 'instrumental', label: '造格', hint: 'с / перед / 職業など' },
  { key: 'prepositional', label: '前置格', hint: 'в / на / о の場所・話題' },
]
