<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { section5Questions } from '~/data/section5'
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

const createQuestionSet = () => {
  const statuses = getQuestionStatuses(section5Questions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof section5Questions> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  section5Questions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof section5Questions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof section5Questions = []
  const take = (status: QuestionStatus, count: number) => {
    if (count <= 0) return
    selected.push(...queues[status].splice(0, count))
  }

  take('review', 4)
  take('new', 4)
  take('learning', 2)

  for (const status of ['review', 'new', 'learning', 'mastered'] as QuestionStatus[]) {
    take(status, SESSION_SIZE - selected.length)
  }

  return shuffle(selected).map((question) => ({
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
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.correctPhrase)
const fullCorrectSentence = computed(() => `${currentQuestion.value.before} ${currentQuestion.value.correctPhrase}${currentQuestion.value.after}`)
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

const speak = (text: string) => {
  if (!speechSupported.value) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
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

  const correct = choice === currentQuestion.value.correctPhrase
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
  const base = 'flex min-h-20 w-full items-center rounded-2xl border px-4 py-3 text-left transition'

  if (!answered.value) {
    return `${base} border-slate-300 bg-white hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50`
  }

  if (choice === currentQuestion.value.correctPhrase) {
    return `${base} border-2 border-solid border-sky-500 bg-sky-50 shadow-[inset_5px_0_0_#0ea5e9]`
  }

  if (selectedAnswer.value === choice) {
    return `${base} border-2 border-dashed border-amber-500 bg-amber-50`
  }

  return `${base} border-slate-200 bg-slate-50 opacity-55`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">大問別問題集</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">第V問・格変化</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">100問から習熟度に合わせて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-sky-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">{{ currentStatusText }}</span>
            <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">3択</span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              文に合う名詞句の形を3つから選びなさい。
            </p>
          </div>

          <div class="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Base Form</p>
            <p class="m-0 text-xl font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.basePhrase }}</p>
            <p class="mt-1 mb-0 text-sm font-bold text-slate-500">中心語: {{ currentQuestion.meaning }}</p>
          </div>

          <div class="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-5 text-center">
            <p class="m-0 text-xl font-bold leading-9 sm:text-2xl" style="font-family: 'PT Serif', Georgia, serif">
              {{ currentQuestion.before }} <span class="rounded-lg border-b-2 border-sky-500 bg-white px-3 py-1">__________</span>{{ currentQuestion.after }}
            </p>
          </div>

          <div class="grid gap-3">
            <button
              v-for="(choice, index) in currentQuestion.choices"
              :key="choice"
              type="button"
              :class="choiceClasses(choice)"
              :disabled="answered"
              @click="selectAnswer(choice)"
            >
              <span class="mr-4 grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">{{ index + 1 }}</span>
              <strong class="text-lg" style="font-family: 'PT Serif', Georgia, serif">{{ choice }}</strong>
              <span v-if="answered && choice === currentQuestion.correctPhrase" class="ml-auto shrink-0 rounded-full bg-sky-600 px-2 py-1 text-[11px] font-black text-white">✓ 正解</span>
              <span v-else-if="answered && selectedAnswer === choice" class="ml-auto shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-950">× 回答</span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-6 flex items-center gap-4 rounded-2xl border-2 p-4" :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'">
              <div class="grid size-12 shrink-0 place-items-center border-[3px] text-2xl font-black" :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'">
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">{{ isCorrect ? '正解！' : '不正解' }}</p>
                <p v-if="!isCorrect" class="m-0 text-sm text-slate-700">正解は {{ currentQuestion.correctPhrase }}</p>
              </div>
            </div>

            <div class="mb-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="mb-1 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">{{ currentQuestion.caseLabel }}</p>
                  <p class="m-0 text-xl font-bold leading-8" style="font-family: 'PT Serif', Georgia, serif">{{ fullCorrectSentence }}</p>
                </div>
                <button
                  type="button"
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-lg transition hover:bg-sky-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  @click="speak(fullCorrectSentence)"
                >🔊</button>
              </div>
            </div>

            <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-700 uppercase">日本語訳</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.answerTranslation }}</p>
            </div>

            <div class="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.explanation }}</p>
            </div>

            <button type="button" class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Section V Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            前置詞や動詞を見て必要な格を判断し、名詞句全体を一緒に変化させる練習。
          </p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="restart">
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
