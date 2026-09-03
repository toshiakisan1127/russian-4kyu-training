<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { section3Pronouns, section3Questions, type Section3Pronoun } from '~/data/section3'
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

const genderLabel = {
  masculine: '男性名詞',
  feminine: '女性名詞',
  neuter: '中性名詞',
} as const

const createQuestionSet = () => {
  const statuses = getQuestionStatuses(section3Questions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof section3Questions> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  section3Questions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof section3Questions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof section3Questions = []
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

  return shuffle(selected).map((question) => {
    const choices = shuffle(section3Pronouns)
    return {
      ...question,
      choices,
      answer: choices.findIndex((choice) => choice.value === question.correctPronoun),
    }
  })
}

const questionSet = ref(createQuestionSet())
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)
const progressVersion = ref(0)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.answer)
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

const correctChoice = computed(() => currentQuestion.value.choices[currentQuestion.value.answer]!)

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  progressVersion.value += 1
})

const speak = (text: string) => {
  if (!speechSupported.value) return

  const speechText = text
    .normalize('NFD')
    .replace(/\u0301/g, '')
    .normalize('NFC')

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(speechText)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.7

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))

  if (russianVoice) utterance.voice = russianVoice
  window.speechSynthesis.speak(utterance)
}

const selectAnswer = (index: number) => {
  if (answered.value) return

  selectedAnswer.value = index
  answered.value = true

  const correct = index === currentQuestion.value.answer
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

const choiceClasses = (index: number) => {
  const base = 'flex min-h-20 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition'

  if (!answered.value) {
    return `${base} border-slate-300 bg-white hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50`
  }

  if (index === currentQuestion.value.answer) {
    return `${base} border-2 border-solid border-sky-500 bg-sky-50 shadow-[inset_5px_0_0_#0ea5e9]`
  }

  if (selectedAnswer.value === index) {
    return `${base} border-2 border-dashed border-amber-500 bg-amber-50`
  }

  return `${base} border-slate-200 bg-slate-50 opacity-55`
}

const pronounExplanation = computed(() => {
  const question = currentQuestion.value
  if (question.number === 'plural') {
    return `${question.stressedWord} は ${question.stressedLemma} の複数形なので、代名詞は они́。`
  }
  return `${question.stressedLemma} は ${genderLabel[question.gender]}なので、代名詞は ${correctChoice.value.stressed}。`
})

const selectedPronoun = computed<Section3Pronoun | null>(() => {
  if (selectedAnswer.value === null) return null
  return currentQuestion.value.choices[selectedAnswer.value]?.value ?? null
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-sky-700 transition hover:text-sky-900">
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">大問別問題集</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">第III問・名詞の性・代名詞</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">100問から習熟度に合わせて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-sky-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">
              {{ currentStatusText }}
            </span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              次の名詞に合う代名詞を он / она / оно / они から選びなさい。
            </p>
          </div>

          <div class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5">
            <div>
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Noun</p>
              <p class="m-0 text-4xl font-bold" style="font-family: 'PT Serif', Georgia, serif">
                {{ currentQuestion.stressedWord }}
              </p>
            </div>
            <button
              type="button"
              class="grid size-11 shrink-0 place-items-center rounded-full border border-sky-200 bg-sky-50 text-xl transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              :aria-label="`${currentQuestion.word} を読み上げる`"
              @click="speak(currentQuestion.stressedWord)"
            >
              🔊
            </button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="(choice, index) in currentQuestion.choices"
              :key="choice.value"
              type="button"
              :class="choiceClasses(index)"
              :disabled="answered"
              @click="selectAnswer(index)"
            >
              <span class="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                {{ index + 1 }}
              </span>
              <strong class="text-2xl" style="font-family: 'PT Serif', Georgia, serif">{{ choice.stressed }}</strong>
              <span v-if="answered && index === currentQuestion.answer" class="ml-auto shrink-0 rounded-full bg-sky-600 px-2 py-1 text-[11px] font-black text-white">✓ 正解</span>
              <span v-else-if="answered && selectedAnswer === index" class="ml-auto shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-950">× 回答</span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-6 flex items-center gap-4 rounded-2xl border-2 p-4" :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'">
              <div class="grid size-12 shrink-0 place-items-center border-[3px] text-2xl font-black" :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'">
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">{{ isCorrect ? '正解！' : '不正解' }}</p>
                <p v-if="!isCorrect" class="m-0 text-sm text-slate-700">
                  {{ selectedPronoun }} ではなく、正解は {{ correctChoice.stressed }}。
                </p>
              </div>
            </div>

            <div class="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3.5">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ pronounExplanation }}</p>
            </div>

            <div class="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
              <div class="mb-3 flex items-center justify-between gap-3">
                <h2 class="m-0 text-base font-black">単語メモ</h2>
                <button
                  type="button"
                  class="grid size-9 shrink-0 place-items-center rounded-full border border-sky-200 bg-sky-50 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!speechSupported"
                  @click="speak(`${currentQuestion.stressedWord} ${correctChoice.stressed}`)"
                >
                  🔊
                </button>
              </div>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt class="font-black text-slate-500">意味</dt>
                <dd class="m-0 font-bold text-slate-900">{{ currentQuestion.meaning }}</dd>
                <dt class="font-black text-slate-500">単数</dt>
                <dd class="m-0 font-bold text-slate-900" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.stressedLemma }}</dd>
                <dt class="font-black text-slate-500">性</dt>
                <dd class="m-0 font-bold text-slate-900">{{ genderLabel[currentQuestion.gender] }}</dd>
                <dt class="font-black text-slate-500">複数形</dt>
                <dd class="m-0 font-bold text-slate-900" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.plural }}</dd>
              </dl>
            </div>

            <button type="button" class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Section III Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            男性・女性・中性・複数を100問で回して、名詞を見た瞬間に代名詞を選べるようにする。
          </p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="restart">
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
