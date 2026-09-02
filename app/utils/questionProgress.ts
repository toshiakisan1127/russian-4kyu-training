export type QuestionProgress = {
  attempts: number
  consecutiveCorrect: number
  lastResult: 'correct' | 'incorrect' | null
}

export type QuestionStatus = 'new' | 'review' | 'learning' | 'mastered'

export type QuestionStatusCounts = Record<QuestionStatus, number>

const STORAGE_KEY = 'russian-study-question-progress-v1'

const emptyProgress = (): QuestionProgress => ({
  attempts: 0,
  consecutiveCorrect: 0,
  lastResult: null,
})

const readAllProgress = (): Record<string, QuestionProgress> => {
  if (!import.meta.client) return {}

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as Record<string, QuestionProgress> : {}
  } catch {
    return {}
  }
}

export const getQuestionProgress = (questionId: string): QuestionProgress => {
  const allProgress = readAllProgress()
  return allProgress[questionId] ?? emptyProgress()
}

export const recordQuestionResult = (questionId: string, correct: boolean): QuestionProgress => {
  if (!import.meta.client) return emptyProgress()

  const allProgress = readAllProgress()
  const current = allProgress[questionId] ?? emptyProgress()
  const next: QuestionProgress = {
    attempts: current.attempts + 1,
    consecutiveCorrect: correct ? current.consecutiveCorrect + 1 : 0,
    lastResult: correct ? 'correct' : 'incorrect',
  }

  try {
    allProgress[questionId] = next
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch {
    // localStorage が使えない環境では、保存せずその場の結果だけ返す。
  }

  return next
}

export const getQuestionStatus = (progress: QuestionProgress): QuestionStatus => {
  if (progress.attempts === 0) return 'new'
  if (progress.lastResult === 'incorrect') return 'review'
  if (progress.consecutiveCorrect >= 3) return 'mastered'
  return 'learning'
}

export const getQuestionStatuses = (questionIds: string[]): Record<string, QuestionStatus> => {
  const allProgress = readAllProgress()
  return Object.fromEntries(questionIds.map((questionId) => [
    questionId,
    getQuestionStatus(allProgress[questionId] ?? emptyProgress()),
  ]))
}

export const getQuestionStatusCounts = (questionIds: string[]): QuestionStatusCounts => {
  const statuses = getQuestionStatuses(questionIds)
  const counts: QuestionStatusCounts = {
    new: 0,
    review: 0,
    learning: 0,
    mastered: 0,
  }

  questionIds.forEach((questionId) => {
    counts[statuses[questionId] ?? 'new'] += 1
  })

  return counts
}

export const questionStatusLabel: Record<QuestionStatus, string> = {
  new: '新規',
  review: '要復習',
  learning: '練習中',
  mastered: '定着',
}
