<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { japaneseToRussianQuestions } from '~/data/japaneseToRussian'
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
  const statuses = getQuestionStatuses(japaneseToRussianQuestions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof japaneseToRussianQuestions> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  japaneseToRussianQuestions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof japaneseToRussianQuestions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof japaneseToRussianQuestions = []
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

  return shuffle(selected)
}

const questionSet = ref(createQuestionSet())
const currentIndex = ref(0)
const draft = ref('')
const revealed = ref(false)
const graded = ref(false)
const strongCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)
const progressVersion = ref(0)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
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

const revealAnswer = () => {
  revealed.value = true
}

const gradeAnswer = (understood: boolean) => {
  if (!revealed.value || graded.value) return
  recordQuestionResult(currentQuestion.value.id, understood)
  progressVersion.value += 1
  graded.value = true
  if (understood) strongCount.value += 1
}

const goNext = () => {
  if (!graded.value) return
  window.speechSynthesis?.cancel()

  if (currentIndex.value === questionSet.value.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  draft.value = ''
  revealed.value = false
  graded.value = false
}

const restart = () => {
  window.speechSynthesis?.cancel()
  questionSet.value = createQuestionSet()
  currentIndex.value = 0
  draft.value = ''
  revealed.value = false
  graded.value = false
  strongCount.value = 0
  completed.value = false
  progressVersion.value += 1
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Translation</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">和文露訳</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">80問から習熟度に合わせて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-sky-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">{{ currentStatusText }}</span>
            <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">自己採点</span>
            <span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-600">{{ currentQuestion.topic }}</span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              次の日本語をロシア語に訳しなさい。格・活用・語順を意識して書いてから模範解答と比較。
            </p>
          </div>

          <div class="mb-5 rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <p class="mb-2 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">Japanese</p>
            <p class="m-0 text-xl font-bold leading-8 sm:text-2xl">
              {{ currentQuestion.prompt }}
            </p>
          </div>

          <label class="mb-2 block text-sm font-black text-slate-700" for="translation-draft">自分のロシア語</label>
          <textarea
            id="translation-draft"
            v-model="draft"
            rows="4"
            class="mb-4 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg leading-8 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            style="font-family: 'PT Serif', Georgia, serif"
            placeholder="ロシア語を書いてみる（アクセント記号なしでもOK）"
            :disabled="graded"
          />

          <button
            v-if="!revealed"
            type="button"
            class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
            @click="revealAnswer"
          >
            模範解答を見る
          </button>

          <section v-else class="mt-6 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="mb-2 text-xs font-black tracking-[0.12em] text-emerald-700 uppercase">Model Answer</p>
                  <p class="m-0 text-xl font-bold leading-9 text-slate-900" style="font-family: 'PT Serif', Georgia, serif">
                    {{ currentQuestion.answer }}
                  </p>
                </div>
                <button
                  type="button"
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-emerald-200 bg-white text-lg transition hover:bg-emerald-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  aria-label="模範解答を読み上げる"
                  @click="speak(currentQuestion.answer)"
                >🔊</button>
              </div>
            </div>

            <div v-if="draft.trim()" class="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-2 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Your Answer</p>
              <p class="m-0 text-lg leading-8 text-slate-800" style="font-family: 'PT Serif', Georgia, serif">{{ draft }}</p>
            </div>

            <div class="mb-5 rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p class="mb-2 text-sm font-black text-violet-900">別解・語順について</p>
              <p class="m-0 text-sm leading-6 text-slate-700">
                ロシア語は文脈によって語順を変えられるので、模範解答と語順が違っても、意味・格・動詞の活用が自然なら正解としてよい。
              </p>
            </div>

            <div class="mb-5 grid gap-4 sm:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="mb-3 text-sm font-black text-slate-900">語彙</p>
                <ul class="m-0 space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  <li v-for="item in currentQuestion.vocabulary" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="mb-3 text-sm font-black text-slate-900">格・活用・文法</p>
                <ul class="m-0 space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  <li v-for="item in currentQuestion.grammar" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>

            <div v-if="!graded" class="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                class="min-h-13 rounded-2xl border-2 border-amber-400 bg-amber-50 px-5 py-3 font-black text-amber-900 transition hover:bg-amber-100"
                @click="gradeAnswer(false)"
              >
                要復習
              </button>
              <button
                type="button"
                class="min-h-13 rounded-2xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                @click="gradeAnswer(true)"
              >
                できた
              </button>
            </div>

            <div v-else>
              <p class="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-bold text-slate-700">
                自己採点を学習状況に記録しました。
              </p>
              <button
                type="button"
                class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
                @click="goNext"
              >
                {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
              </button>
            </div>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Translation Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ strongCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            格・活用まで自然に作れた問題を「できた」にして、要復習は次回優先して出題。
          </p>
          <button
            type="button"
            class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
            @click="restart"
          >
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
