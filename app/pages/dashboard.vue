<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { caseTrainingQuestions } from '~/data/caseTraining'
import { mockExams } from '~/data/mockExams'
import { questions } from '~/data/questions'
import { section1Questions } from '~/data/section1'
import { generatedSection1Questions } from '~/data/section1Extra'
import { section2Questions } from '~/data/section2'
import { section3Questions } from '~/data/section3'
import { section4Questions } from '~/data/section4'
import { section5Questions } from '~/data/section5'
import { section6Questions } from '~/data/section6'
import { section7Questions } from '~/data/section7'
import { section8Questions } from '~/data/section8'
import { verbTrainingQuestions } from '~/data/verbTraining'
import { vocabularyItems } from '~/data/vocabulary'
import {
  getQuestionStatusCounts,
  type QuestionStatusCounts,
} from '~/utils/questionProgress'
import { stripStress } from '~/utils/russianStress'

type ProgressSummary = QuestionStatusCounts & {
  total: number
  attempted: number
  completion: number
  mastery: number
}

type SavedMockResult = {
  version?: number
  answers?: Record<string, string | number>
  selfGrades?: Record<string, number>
}

type MockResultSummary = {
  examTitle: string
  score: number
  grammarPercentage: number | null
  translationPercentage: number | null
  reviewCount: number
  examIndex: number
}

type ProgressGroup = {
  key: string
  label: string
  description: string
  to: string
  ids: string[]
}

const emptyCounts = (): QuestionStatusCounts => ({
  new: 0,
  review: 0,
  learning: 0,
  mastered: 0,
})

const progressGroups: ProgressGroup[] = [
  {
    key: 'prepositions',
    label: '前置詞',
    description: 'в / на / из / с / к など',
    to: '/prepositions',
    ids: questions.map((question) => question.id),
  },
  {
    key: 'cases',
    label: '格変化',
    description: '5つの格の使い分け',
    to: '/cases',
    ids: caseTrainingQuestions.map((question) => question.id),
  },
  {
    key: 'verbs',
    label: '動詞',
    description: '現在・過去・未来・移動動詞',
    to: '/verbs',
    ids: verbTrainingQuestions.map((question) => question.id),
  },
  {
    key: 'vocabulary',
    label: '語彙',
    description: '4級基本語彙579語',
    to: '/vocabulary',
    ids: vocabularyItems.map((item) => item.id),
  },
  {
    key: 'pronunciation',
    label: '発音・アクセント',
    description: '第I問・第II問',
    to: '/sections/1',
    ids: [
      ...section1Questions,
      ...generatedSection1Questions,
      ...section2Questions,
    ].map((question) => question.id),
  },
  {
    key: 'grammar',
    label: '文法・記述',
    description: '第III問〜第VIII問',
    to: '/sections/3',
    ids: [
      ...section3Questions,
      ...section4Questions,
      ...section5Questions,
      ...section6Questions,
      ...section7Questions,
      ...section8Questions,
    ].map((question) => question.id),
  },
]

const progress = ref<Record<string, ProgressSummary>>({})
const mockResults = ref<MockResultSummary[]>([])
const isLoaded = ref(false)

const buildProgressSummary = (ids: string[]): ProgressSummary => {
  const counts = getQuestionStatusCounts(ids)
  const total = ids.length
  const attempted = total - counts.new
  return {
    ...counts,
    total,
    attempted,
    completion: total > 0 ? Math.round((attempted / total) * 100) : 0,
    mastery: total > 0 ? Math.round((counts.mastered / total) * 100) : 0,
  }
}

const answerKey = (questionId: string, fieldId = 'choice') => `${questionId}:${fieldId}`

const normalizeAnswer = (value: string) =>
  stripStress(value.normalize('NFC').trim().replace(/\s+/gu, ' ')).toLocaleLowerCase('ru-RU')

const readMockResult = (exam: (typeof mockExams)[number], examIndex: number): MockResultSummary | null => {
  const raw = window.localStorage.getItem(`russian-mock-exam-result-v1:${exam.id}`)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as SavedMockResult
    if (parsed.version !== 1 || !parsed.answers || typeof parsed.answers !== 'object') return null

    let autoCorrect = 0
    let autoTotal = 0
    let grammarCorrect = 0
    let grammarTotal = 0
    let reviewCount = 0
    const translationGrades: number[] = []

    exam.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const isTranslation = section.roman === 'IX' || section.roman === 'X'

        if (question.kind === 'input' && question.selfGrade) {
          const grade = parsed.selfGrades?.[question.id]
          if (typeof grade === 'number' && Number.isInteger(grade) && grade >= 0 && grade <= 100) {
            translationGrades.push(grade)
          }
          if (typeof grade !== 'number' || grade < 100) reviewCount += 1
          return
        }

        const entries = question.kind === 'choice'
          ? [{ key: answerKey(question.id), answer: String(question.answer), valueType: 'choice' as const }]
          : question.fields.map((field) => ({
            key: answerKey(question.id, field.id),
            answer: field.answer,
            valueType: 'input' as const,
          }))

        let questionHasIncorrectAnswer = false
        entries.forEach((entry) => {
          const value = parsed.answers?.[entry.key]
          const correct = entry.valueType === 'choice'
            ? typeof value === 'number' && String(value) === entry.answer
            : typeof value === 'string' && normalizeAnswer(value) === normalizeAnswer(entry.answer)

          autoTotal += 1
          if (!isTranslation) grammarTotal += 1
          if (correct) {
            autoCorrect += 1
            if (!isTranslation) grammarCorrect += 1
          } else {
            questionHasIncorrectAnswer = true
          }
        })
        if (questionHasIncorrectAnswer) reviewCount += 1
      })
    })

    return {
      examTitle: exam.title,
      // This mirrors the result screen's automatic-score denominator.
      score: Math.round((autoCorrect / exam.totalAnswerFields) * 100),
      grammarPercentage: grammarTotal > 0 ? Math.round((grammarCorrect / grammarTotal) * 100) : null,
      translationPercentage: translationGrades.length > 0
        ? Math.round(translationGrades.reduce((sum, value) => sum + value, 0) / translationGrades.length)
        : null,
      reviewCount,
      examIndex,
    }
  } catch {
    return null
  }
}

const loadDashboard = () => {
  progress.value = Object.fromEntries(
    progressGroups.map((group) => [group.key, buildProgressSummary(group.ids)]),
  )
  mockResults.value = mockExams
    .map((exam, index) => readMockResult(exam, index))
    .filter((result): result is MockResultSummary => result !== null)
  isLoaded.value = true
}

onMounted(loadDashboard)

const getProgress = (key: string): ProgressSummary => progress.value[key] ?? {
  ...emptyCounts(),
  total: 0,
  attempted: 0,
  completion: 0,
  mastery: 0,
}

const latestMock = computed(() => mockResults.value[mockResults.value.length - 1] ?? null)
const practiceReviewCount = computed(() =>
  progressGroups.reduce((sum, group) => sum + getProgress(group.key).review, 0),
)
const totalAttempted = computed(() =>
  progressGroups.reduce((sum, group) => sum + getProgress(group.key).attempted, 0),
)
const totalQuestions = computed(() =>
  progressGroups.reduce((sum, group) => sum + getProgress(group.key).total, 0),
)
const masteredQuestions = computed(() =>
  progressGroups.reduce((sum, group) => sum + getProgress(group.key).mastered, 0),
)
const nextGroup = computed(() =>
  [...progressGroups]
    .sort((left, right) => {
      const leftProgress = getProgress(left.key)
      const rightProgress = getProgress(right.key)
      return (rightProgress.review - leftProgress.review)
        || (leftProgress.mastery - rightProgress.mastery)
    })[0]!,
)
const nextAction = computed(() => {
  if (latestMock.value?.reviewCount) {
    return {
      label: '模試の間違いを復習',
      description: `${latestMock.value.reviewCount}問の復習候補があります。`,
      to: '/mock',
      action: '復習する',
    }
  }

  const group = nextGroup.value
  const groupProgress = getProgress(group.key)
  return {
    label: groupProgress.review > 0 ? `${group.label}を復習` : `${group.label}を始める`,
    description: groupProgress.review > 0
      ? `要復習が${groupProgress.review}問あります。`
      : `${group.description}を少しずつ進めましょう。`,
    to: group.to,
    action: groupProgress.review > 0 ? '復習する' : '学習する',
  }
})

const chartWidth = 360
const chartHeight = 140
const chartPadding = 20
const chartPoints = computed(() => {
  const results = mockResults.value
  if (results.length === 0) return []
  return results.map((result, index) => {
    const x = results.length === 1
      ? chartWidth / 2
      : chartPadding + (index / (results.length - 1)) * (chartWidth - chartPadding * 2)
    const y = chartHeight - chartPadding - (result.score / 100) * (chartHeight - chartPadding * 2)
    return { x, y, ...result }
  })
})
const chartLine = computed(() => chartPoints.value.map((point) => `${point.x},${point.y}`).join(' '))
const thresholdY = chartHeight - chartPadding - 0.6 * (chartHeight - chartPadding * 2)

const formatScoreStatus = (score: number) => score >= 60 ? '合格圏' : `あと${60 - score}点`
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:py-10">
    <div class="mx-auto w-full max-w-5xl">
      <header class="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div>
          <p class="mb-1 text-xs font-black tracking-[0.16em] text-violet-600 uppercase">Learning Dashboard</p>
          <h1 class="m-0 text-3xl font-black tracking-tight sm:text-4xl">学習ダッシュボード</h1>
        </div>
        <NuxtLink to="/" class="shrink-0 text-sm font-black text-indigo-700 hover:text-indigo-900">ホームへ戻る →</NuxtLink>
      </header>

      <section class="mb-5 overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 p-5 text-white shadow-xl shadow-indigo-200/60 sm:mb-6 sm:p-7" data-testid="dashboard-hero">
        <div class="grid gap-6 sm:grid-cols-[1.15fr_0.85fr] sm:items-center">
          <div>
            <p class="mb-2 text-sm font-black tracking-[0.12em] text-violet-200 uppercase">現在の状態</p>
            <template v-if="latestMock">
              <div class="flex items-end gap-3">
                <p class="m-0 text-6xl font-black leading-none tabular-nums">{{ latestMock.score }}<span class="text-2xl text-violet-200">%</span></p>
                <span class="mb-1 rounded-full bg-white/15 px-3 py-1 text-sm font-black">{{ formatScoreStatus(latestMock.score) }}</span>
              </div>
              <p class="mt-3 mb-0 text-sm font-bold text-violet-100">{{ latestMock.examTitle }}・自動採点スコア</p>
              <div class="mt-4 flex flex-wrap gap-2 text-xs font-black text-indigo-950">
                <span class="rounded-full bg-white px-3 py-1.5">文法 {{ latestMock.grammarPercentage ?? '—' }}%</span>
                <span class="rounded-full bg-violet-200 px-3 py-1.5 text-violet-950">翻訳 {{ latestMock.translationPercentage ?? '未採点' }}{{ latestMock.translationPercentage !== null ? '%' : '' }}</span>
              </div>
            </template>
            <template v-else>
              <p class="m-0 text-3xl font-black leading-tight sm:text-4xl">まずは模試で<br>現在地を確認しよう</p>
              <p class="mt-3 mb-0 text-sm font-bold leading-6 text-violet-100">本番形式の模試を受けると、ここに結果と合格ラインとの差が表示されます。</p>
            </template>
          </div>

          <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div class="mb-3 flex items-center justify-between gap-3">
              <p class="m-0 text-sm font-black text-violet-100">次にやること</p>
              <span class="text-lg" aria-hidden="true">✦</span>
            </div>
            <p class="mb-1 text-xl font-black">{{ nextAction.label }}</p>
            <p class="m-0 text-sm font-bold leading-6 text-violet-100">{{ nextAction.description }}</p>
            <NuxtLink :to="nextAction.to" class="mt-4 inline-flex min-h-10 items-center rounded-xl bg-white px-4 py-2 text-sm font-black text-indigo-800 transition hover:bg-violet-100">
              {{ nextAction.action }} →
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:grid-cols-4" data-testid="dashboard-summary">
        <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="mb-1 text-xs font-black text-slate-500">学習済み</p>
          <p class="m-0 text-2xl font-black tabular-nums">{{ totalAttempted }}<span class="text-sm text-slate-500"> / {{ totalQuestions }}</span></p>
          <p class="mt-1 mb-0 text-xs font-bold text-slate-500">問題</p>
        </article>
        <article class="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p class="mb-1 text-xs font-black text-amber-800">要復習</p>
          <p class="m-0 text-2xl font-black tabular-nums text-amber-950">{{ (latestMock?.reviewCount ?? 0) + practiceReviewCount }}</p>
          <p class="mt-1 mb-0 text-xs font-bold text-amber-800">模試・演習</p>
        </article>
        <article class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p class="mb-1 text-xs font-black text-emerald-800">模試</p>
          <p class="m-0 text-2xl font-black tabular-nums text-emerald-950">{{ mockResults.length }}<span class="text-sm text-emerald-800"> / {{ mockExams.length }}</span></p>
          <p class="mt-1 mb-0 text-xs font-bold text-emerald-800">受験済み</p>
        </article>
        <article class="rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
          <p class="mb-1 text-xs font-black text-sky-800">定着</p>
          <p class="m-0 text-2xl font-black tabular-nums text-sky-950">{{ masteredQuestions }}</p>
          <p class="mt-1 mb-0 text-xs font-bold text-sky-800">3回連続正解</p>
        </article>
      </section>

      <section class="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-6 sm:p-6">
        <div class="mb-5 flex items-end justify-between gap-3">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Weak Points</p>
            <h2 class="m-0 text-xl font-black sm:text-2xl">分野別の学習状況</h2>
          </div>
          <span class="text-xs font-bold text-slate-500">バーは学習済み、数字は定着</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <NuxtLink v-for="group in progressGroups" :key="group.key" :to="group.to" class="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
            <div class="mb-2 flex items-start justify-between gap-3">
              <div>
                <h3 class="m-0 font-black">{{ group.label }}</h3>
                <p class="mt-1 mb-0 text-xs font-bold text-slate-500">{{ group.description }}</p>
              </div>
              <span class="shrink-0 text-sm font-black text-indigo-700">{{ getProgress(group.key).mastery }}%</span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-600 transition-all" :style="{ width: `${getProgress(group.key).completion}%` }" />
            </div>
            <div class="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
              <span>学習済み {{ getProgress(group.key).attempted }} / {{ getProgress(group.key).total }}問</span>
              <span :class="getProgress(group.key).review > 0 ? 'text-amber-700' : 'text-emerald-700'">要復習 {{ getProgress(group.key).review }}問</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-6 sm:p-6">
        <div class="mb-4 flex items-end justify-between gap-3">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">Mock Exam Trend</p>
            <h2 class="m-0 text-xl font-black sm:text-2xl">模試の成績推移</h2>
          </div>
          <NuxtLink to="/mock" class="text-sm font-black text-amber-800 hover:text-amber-950">模試一覧 →</NuxtLink>
        </div>
        <div v-if="mockResults.length" data-testid="dashboard-chart">
          <div class="overflow-x-auto">
            <svg class="h-auto min-w-[320px]" viewBox="0 0 360 140" role="img" aria-label="模試の自動採点スコア推移">
              <line x1="20" :y1="thresholdY" x2="340" :y2="thresholdY" stroke="#f59e0b" stroke-dasharray="5 5" stroke-width="1.5" />
              <text x="338" :y="thresholdY - 5" text-anchor="end" fill="#b45309" font-size="10" font-weight="700">合格目安60%</text>
              <line x1="20" y1="20" x2="20" y2="120" stroke="#cbd5e1" stroke-width="1" />
              <line x1="20" y1="120" x2="340" y2="120" stroke="#cbd5e1" stroke-width="1" />
              <polyline :points="chartLine" fill="none" stroke="#6366f1" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
              <g v-for="point in chartPoints" :key="point.examIndex">
                <circle :cx="point.x" :cy="point.y" r="5" fill="#fff" stroke="#6366f1" stroke-width="3" />
                <text :x="point.x" y="136" text-anchor="middle" fill="#475569" font-size="10" font-weight="700">第{{ point.examIndex + 1 }}回</text>
                <text :x="point.x" :y="point.y - 10" text-anchor="middle" fill="#312e81" font-size="11" font-weight="800">{{ point.score }}%</text>
              </g>
            </svg>
          </div>
        </div>
        <div v-else class="rounded-2xl bg-amber-50 px-4 py-5 text-center">
          <p class="m-0 font-black text-amber-950">まだ模試の記録がありません</p>
          <NuxtLink to="/mock" class="mt-3 inline-flex rounded-xl bg-amber-700 px-4 py-2 font-black text-white hover:bg-amber-800">第1回を受ける →</NuxtLink>
        </div>
      </section>

      <p v-if="isLoaded" class="m-0 text-center text-xs font-bold text-slate-500">学習履歴はこの端末のローカルデータから集計しています</p>
    </div>
  </main>
</template>
