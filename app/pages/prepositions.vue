<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { questions } from '~/data/questions'
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
  const statuses = getQuestionStatuses(questions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof questions> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  questions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof questions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof questions = []
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
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.answer)
const currentStatus = computed(() => {
  progressVersion.value
  return getQuestionStatus(getQuestionProgress(currentQuestion.value.id))
})
const currentStatusText = computed(() => questionStatusLabel[currentStatus.value])
const currentStatusClasses = computed(() => ({
  new: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  review: 'border-amber-300 bg-amber-50 text-amber-900',
  learning: 'border-violet-200 bg-violet-50 text-violet-700',
  mastered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}[currentStatus.value]))

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  progressVersion.value += 1
})

const selectAnswer = (value: string) => {
  if (answered.value) return

  selectedAnswer.value = value
  answered.value = true

  const correct = value === currentQuestion.value.answer
  recordQuestionResult(currentQuestion.value.id, correct)
  progressVersion.value += 1

  if (correct) correctCount.value += 1
}

const speakCurrentSentence = () => {
  if (!speechSupported.value) return

  window.speechSynthesis.cancel()

  const speechText = currentQuestion.value.fullSentence
    .normalize('NFD')
    .replace(/\u0301/g, '')
    .normalize('NFC')
  const utterance = new SpeechSynthesisUtterance(speechText)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.7

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}

const goNext = () => {
  if (!answered.value) return

  if (currentIndex.value === questionSet.value.length - 1) {
    completed.value = true
    return
  }

  window.speechSynthesis?.cancel()
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

const choiceClasses = (value: string) => {
  const base = 'flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-lg font-bold transition'

  if (!answered.value) {
    return `${base} border-slate-300 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50`
  }

  if (value === currentQuestion.value.answer) {
    return `${base} border-2 border-solid border-sky-500 bg-sky-50 text-slate-950 shadow-[inset_5px_0_0_#0ea5e9]`
  }

  if (selectedAnswer.value === value) {
    return `${base} border-2 border-dashed border-amber-500 bg-amber-50 text-slate-950`
  }

  return `${base} border-slate-200 bg-slate-50 text-slate-400 opacity-55`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">
      <NuxtLink
        to="/"
        class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900"
      >
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60 sm:p-8">
        <header class="mb-8 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">ロシア語能力検定4級</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">前置詞トレーニング</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">100問から習熟度に合わせて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-6">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <p class="m-0 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">前置詞</p>
              <span
                class="rounded-full border px-2.5 py-1 text-xs font-black"
                :class="currentStatusClasses"
              >
                {{ currentStatusText }}
              </span>
            </div>
            <p
              class="m-0 text-[clamp(1.9rem,7vw,2.8rem)] leading-[1.45]"
              style="font-family: 'PT Serif', Georgia, serif"
            >
              {{ currentQuestion.prompt }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="choice in currentQuestion.choices"
              :key="choice.value"
              type="button"
              :class="choiceClasses(choice.value)"
              :disabled="answered"
              @click="selectAnswer(choice.value)"
            >
              <span>{{ choice.value }}</span>
              <span
                v-if="answered && choice.value === currentQuestion.answer"
                class="shrink-0 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-black text-white"
              >
                ✓ 正解
              </span>
              <span
                v-else-if="answered && selectedAnswer === choice.value"
                class="shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950"
              >
                × あなたの回答
              </span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div
              class="mb-7 flex items-center gap-4 rounded-2xl border-2 p-4 sm:p-5"
              :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'"
            >
              <div
                class="grid size-14 shrink-0 place-items-center border-[3px] text-3xl font-black leading-none"
                :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'"
                aria-hidden="true"
              >
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-xl font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">
                  {{ isCorrect ? '正解！' : '不正解' }}
                </p>
                <p v-if="!isCorrect" class="m-0 text-base">
                  正解は <strong class="text-xl text-sky-800">「{{ currentQuestion.answer }}」</strong>
                </p>
                <p v-else class="m-0 text-sm text-slate-600">その調子！</p>
              </div>
            </div>

            <div class="mb-7 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 sm:px-5">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-600 uppercase">日本語訳</p>
              <p class="m-0 text-base font-bold leading-7 text-slate-800">{{ currentQuestion.translation }}</p>

              <div class="my-4 border-t border-indigo-100" />

              <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-600 uppercase">完全な文</p>
              <p
                class="m-0 text-xl leading-8 text-slate-950"
                style="font-family: 'PT Serif', Georgia, serif"
              >
                {{ currentQuestion.fullSentence }}
              </p>

              <p class="mt-3 mb-1 text-xs font-black tracking-[0.12em] text-indigo-600 uppercase">IPA</p>
              <p class="m-0 text-sm leading-6 text-slate-600">{{ currentQuestion.ipa }}</p>

              <button
                type="button"
                class="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!speechSupported"
                @click="speakCurrentSentence"
              >
                🔊 {{ speechSupported ? '読み上げ' : '読み上げ非対応' }}
              </button>
            </div>

            <div class="mb-7">
              <h2 class="mb-2 text-base font-black">なぜ？</h2>
              <p class="m-0 leading-7 text-slate-700">{{ currentQuestion.correctExplanation }}</p>
            </div>

            <div class="mb-7">
              <h2 class="mb-2 text-base font-black">他の選択肢も確認</h2>
              <article
                v-for="choice in currentQuestion.choices"
                :key="`explanation-${choice.value}`"
                class="border-t border-slate-200 py-4"
              >
                <div class="flex items-center gap-2">
                  <strong class="text-lg">{{ choice.value }}</strong>
                  <span
                    v-if="choice.value === currentQuestion.answer"
                    class="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-black text-white"
                  >
                    ✓ 正解
                  </span>
                </div>
                <p class="mt-1.5 mb-0 leading-7 text-slate-700">{{ choice.explanation }}</p>
              </article>
            </div>

            <button
              type="button"
              class="min-h-13 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
              @click="goNext"
            >
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Result</p>
          <h2 class="mb-3 text-4xl font-black text-indigo-700 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            100問から要復習・新規を優先して10問ずつ出題。格支配と前置詞の使い分けを少しずつ定着させよう。
          </p>
          <button
            type="button"
            class="mt-7 min-h-13 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
            @click="restart"
          >
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
