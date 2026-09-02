export type QuestionProgress = {
  attempts: number
  consecutiveCorrect: number
  lastResult: 'correct' | 'incorrect' | null
}

export type QuestionStatus = 'new' | 'review' | 'learning' | 'mastered'

const STORAGE_KEY = 'russian-study-question-progress-v1'

const emptyProgress = (): QuestionProgress => ({
  attempts: 0,
  consecutiveCorrect: 0,
  lastResult: null,
})

export const getQuestionProgress = (questionId: string): QuestionProgress => {
  if (!import.meta.client) return emptyProgress()

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return emptyProgress()

    const allProgress = JSON.parse(stored) as Record<string, QuestionProgress>
    return allProgress[questionId] ?? emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export const recordQuestionResult = (questionId: string, correct: boolean): QuestionProgress => {
  if (!import.meta.client) return emptyProgress()

  const current = getQuestionProgress(questionId)
  const next: QuestionProgress = {
    attempts: current.attempts + 1,
    consecutiveCorrect: correct ? current.consecutiveCorrect + 1 : 0,
    lastResult: correct ? 'correct' : 'incorrect',
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const allProgress = stored
      ? JSON.parse(stored) as Record<string, QuestionProgress>
      : {}

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

export const questionStatusLabel: Record<QuestionStatus, string> = {
  new: '新規',
  review: '要復習',
  learning: '練習中',
  mastered: '定着',
}
