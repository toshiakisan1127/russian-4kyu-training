<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { verbTrainingQuestions, type VerbTrainingCategory } from '~/data/verbTraining'
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

type FilterKey = 'all' | VerbTrainingCategory

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'present', label: '現在形' },
  { key: 'past', label: '過去形' },
  { key: 'future', label: '未来形' },
  { key: 'motion', label: '移動動詞' },
  { key: 'aspect', label: '体' },
]

const categoryLabels: Record<VerbTrainingCategory, string> = {
  present: '現在形',
  past: '過去形',
  future: '未来形',
  motion: '移動動詞',
  aspect: '完了体・不完了体',
}

const selectedFilter = ref<FilterKey>('all')

const filteredPool = computed(() => selectedFilter.value === 'all'
  ? verbTrainingQuestions
  : verbTrainingQuestions.filter((question) => question.category === selectedFilter.value))

const createQuestionSet = () => {
  const pool = filteredPool.value
  const statuses = getQuestionStatuses(pool.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof pool> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  pool.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof pool> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof pool = []
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
const verbChoiceDetails = computed(() => currentQuestion.value.choices.map((choice) => ({
  value: choice,
  isCorrect: choice === currentQuestion.value.correctAnswer,
  explanation: currentQuestion.value.choiceExplanations?.[choice] ?? 'この選択肢の詳しい説明はありません。',
})))

const filterCount = (key: FilterKey) => key === 'all'
  ? verbTrainingQuestions.length
  : verbTrainingQuestions.filter((question) => question.category === key).length

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

const resetSession = () => {
  window.speechSynthesis?.cancel()
  questionSet.value = createQuestionSet()
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  correctCount.value = 0
  completed.value = false
  progressVersion.value += 1
}

const changeFilter = (key: FilterKey) => {
  selectedFilter.value = key
  resetSession()
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
        <header class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-700 uppercase">Training</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">動詞トレーニング</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">{{ verbTrainingQuestions.length }}問から分野を選んで10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-indigo-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.key"
            type="button"
            class="rounded-full border px-3 py-2 text-xs font-black transition"
            :class="selectedFilter === filter.key
              ? 'border-indigo-700 bg-indigo-700 text-white'
              : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'"
            @click="changeFilter(filter.key)"
          >
            {{ filter.label }} {{ filterCount(filter.key) }}
          </button>
        </div>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">{{ currentStatusText }}</span>
            <span class="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-800">
              {{ categoryLabels[currentQuestion.category] }}
            </span>
            <span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-600">4択</span>
          </div>

          <div class="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Verb</p>
            <p class="m-0 text-xl font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.infinitive }}</p>
            <p class="mt-1 mb-0 text-sm font-bold text-slate-500">{{ currentQuestion.meaning }}</p>
          </div>

          <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-5 text-center">
            <p class="m-0 text-xl font-bold leading-9 sm:text-2xl" style="font-family: 'PT Serif', Georgia, serif">
              {{ currentQuestion.prompt }}
            </p>
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
              <strong class="text-lg" style="font-family: 'PT Serif', Georgia, serif">{{ choice }}</strong>
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
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.answerTranslation ?? currentQuestion.meaning }}</p>
            </div>

            <div class="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.explanation }}</p>
            </div>

            <ChoiceExplanationList :choices="verbChoiceDetails" title="活用形の選択肢を確認" />

            <button type="button" class="min-h-13 w-full rounded-2xl bg-indigo-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-700 uppercase">Verb Result</p>
          <h2 class="mb-3 text-4xl font-black text-indigo-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            苦手な時制や移動動詞・体を選んで、同じ分野だけ繰り返し練習できる。
          </p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-indigo-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" @click="resetSession">
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
