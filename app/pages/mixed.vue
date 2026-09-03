<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mixedTrainingQuestions, mixedTrainingSources } from '~/data/mixedTraining'
import { shuffle } from '~/utils/shuffle'
import {
  getQuestionProgress,
  getQuestionStatus,
  getQuestionStatuses,
  questionStatusLabel,
  recordQuestionResult,
  type QuestionStatus,
} from '~/utils/questionProgress'

const SESSION_SIZE = 10
const BASE_PER_SOURCE = 2

const takeByStatus = <T extends { id: string }>(pool: T[], count: number) => {
  const statuses = getQuestionStatuses(pool.map((question) => question.id))
  const buckets: Record<QuestionStatus, T[]> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  pool.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const selected: T[] = []
  for (const status of ['review', 'new', 'learning', 'mastered'] as QuestionStatus[]) {
    const queue = shuffle(buckets[status])
    selected.push(...queue.slice(0, Math.max(0, count - selected.length)))
    if (selected.length === count) break
  }

  return selected
}

const createQuestionSet = () => {
  const selected = mixedTrainingSources.flatMap(({ key }) =>
    takeByStatus(mixedTrainingQuestions.filter((question) => question.source === key), BASE_PER_SOURCE),
  )

  const selectedIds = new Set(selected.map((question) => question.id))
  const remainder = mixedTrainingQuestions.filter((question) => !selectedIds.has(question.id))
  const extra = takeByStatus(remainder, SESSION_SIZE - selected.length)

  return shuffle([...selected, ...extra]).map((question) => ({
    ...question,
    choices: shuffle(question.choices),
  }))
}

const questionSet = ref(createQuestionSet())
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)
const progressVersion = ref(0)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.correctAnswer)
const currentStatus = computed(() => {
  progressVersion.value
  return getQuestionStatus(getQuestionProgress(currentQuestion.value.id))
})
const currentStatusText = computed(() => questionStatusLabel[currentStatus.value])
const currentStatusClasses = computed(() => ({
  new: 'border-sky-200 bg-sky-50 text-sky-700',
  review: 'border-amber-300 bg-amber-50 text-amber-900',
  learning: 'border-violet-200 bg-violet-50 text-violet-700',
  mastered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}[currentStatus.value]))

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  progressVersion.value += 1
})

const stripStress = (text: string) => text.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')

const speak = (text: string) => {
  if (!speechSupported.value) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(stripStress(text))
  utterance.lang = 'ru-RU'
  utterance.rate = Number(window.localStorage.getItem('russian-speech-rate') ?? '0.4')

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}

const selectAnswer = (choice: string) => {
  if (answered.value) return

  selectedAnswer.value = choice
  answered.value = true
  const correct = choice === currentQuestion.value.correctAnswer
  recordQuestionResult(currentQuestion.value.id, correct)
  progressVersion.value += 1
  if (correct) correctCount.value += 1
}

const goNext = () => {
  if (!answered.value) return
  window.speechSynthesis?.cancel()

  if (currentIndex.value === questionSet.value.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  selectedAnswer.value = null
  answered.value = false
}

const restart = () => {
  window.speechSynthesis?.cancel()
  questionSet.value = createQuestionSet()
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  correctCount.value = 0
  completed.value = false
  progressVersion.value += 1
}

const choiceClasses = (choice: string) => {
  const base = 'flex min-h-16 w-full items-center rounded-2xl border px-4 py-3 text-left transition'
  if (!answered.value) return `${base} border-slate-300 bg-white hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50`
  if (choice === currentQuestion.value.correctAnswer) return `${base} border-2 border-indigo-500 bg-indigo-50`
  if (selectedAnswer.value === choice) return `${base} border-2 border-dashed border-amber-500 bg-amber-50`
  return `${base} border-slate-200 bg-slate-50 opacity-55`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-700 uppercase">Training</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">総合トレーニング</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">{{ mixedTrainingQuestions.length }}問から4分野を混ぜて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-indigo-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">{{ currentStatusText }}</span>
            <span class="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-800">{{ currentQuestion.sourceLabel }}</span>
            <span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-600">4択</span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              前置詞・格変化・動詞・語彙を混ぜて出題。各分野を最低2問ずつ、残りは要復習を優先。
            </p>
          </div>

          <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-5 text-center">
            <p class="m-0 text-xl font-bold leading-9 sm:text-2xl" style="font-family: 'PT Serif', Georgia, serif">
              {{ currentQuestion.prompt }}
            </p>
            <p v-if="currentQuestion.subtext" class="mt-2 mb-0 text-sm font-bold text-slate-500">{{ currentQuestion.subtext }}</p>
          </div>

          <div class="grid gap-3">
            <button
              v-for="(choice, index) in currentQuestion.choices"
              :key="`${choice}-${index}`"
              type="button"
              :class="choiceClasses(choice)"
              :disabled="answered"
              @click="selectAnswer(choice)"
            >
              <span class="mr-4 grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">{{ index + 1 }}</span>
              <strong class="text-base sm:text-lg" style="font-family: 'PT Serif', Georgia, serif">{{ choice }}</strong>
              <span v-if="answered && choice === currentQuestion.correctAnswer" class="ml-auto rounded-full bg-indigo-600 px-2 py-1 text-[11px] font-black text-white">✓ 正解</span>
              <span v-else-if="answered && selectedAnswer === choice" class="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-900">× 回答</span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-5 rounded-2xl border-2 p-4" :class="isCorrect ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-amber-500 bg-amber-50'">
              <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-indigo-800' : 'text-amber-900'">{{ isCorrect ? '正解！' : '不正解' }}</p>
              <p v-if="!isCorrect" class="m-0 text-sm text-slate-700">正解は {{ currentQuestion.correctAnswer }}</p>
            </div>

            <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-700 uppercase">Answer</p>
                  <p class="m-0 text-xl font-bold leading-8" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.answerSentence }}</p>
                </div>
                <button
                  type="button"
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-indigo-200 bg-white text-lg transition hover:bg-indigo-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  aria-label="正解文を読み上げる"
                  @click="speak(currentQuestion.answerSentence)"
                >🔊</button>
              </div>
            </div>

            <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-700 uppercase">日本語訳</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.answerTranslation ?? currentQuestion.subtext }}</p>
            </div>

            <div class="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.explanation }}</p>
            </div>

            <button type="button" class="min-h-13 w-full rounded-2xl bg-indigo-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-700 uppercase">Mixed Result</p>
          <h2 class="mb-3 text-4xl font-black text-indigo-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            要復習の問題は次回の総合トレーニングでも優先して出題。
          </p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-indigo-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" @click="restart">
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
