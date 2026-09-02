<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { vocabularyItems } from '~/data/vocabulary'
import { shuffle } from '~/utils/shuffle'
import {
  getQuestionProgress,
  getQuestionStatus,
  questionStatusLabel,
  recordQuestionResult,
} from '~/utils/questionProgress'

const createQuestionSet = () => shuffle(vocabularyItems).map((item) => {
  const distractors = shuffle(vocabularyItems.filter((candidate) => candidate.id !== item.id))
    .slice(0, 3)
    .map((candidate) => candidate.meaning)

  return {
    ...item,
    choices: shuffle([item.meaning, ...distractors]),
  }
})

const questionSet = ref(createQuestionSet())
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)
const progressVersion = ref(0)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.meaning)
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

const speakCurrentWord = () => {
  if (!speechSupported.value) return

  const text = currentQuestion.value.stressedWord
    .normalize('NFD')
    .replace(/\u0301/g, '')
    .normalize('NFC')

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.7

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))

  if (russianVoice) {
    utterance.voice = russianVoice
  }

  window.speechSynthesis.speak(utterance)
}

const selectAnswer = (value: string) => {
  if (answered.value) return

  selectedAnswer.value = value
  answered.value = true

  const correct = value === currentQuestion.value.meaning
  recordQuestionResult(currentQuestion.value.id, correct)
  progressVersion.value += 1

  if (correct) {
    correctCount.value += 1
  }
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

const choiceClasses = (value: string) => {
  const base = 'flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-base font-bold transition'

  if (!answered.value) {
    return `${base} border-slate-300 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50`
  }

  if (value === currentQuestion.value.meaning) {
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
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Vocabulary</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">語彙トレーニング</h1>
          </div>
          <span class="shrink-0 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">
              {{ currentStatusText }}
            </span>
          </div>

          <div class="mb-6 text-center">
            <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">この単語の意味は？</p>
            <p
              class="m-0 text-[clamp(2.4rem,10vw,4rem)] leading-[1.35]"
              style="font-family: 'PT Serif', Georgia, serif"
            >
              {{ currentQuestion.stressedWord }}
            </p>
            <button
              type="button"
              class="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-black text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              @click="speakCurrentWord"
            >
              🔊 読み上げ
            </button>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="choice in currentQuestion.choices"
              :key="choice"
              type="button"
              :class="choiceClasses(choice)"
              :disabled="answered"
              @click="selectAnswer(choice)"
            >
              <span>{{ choice }}</span>
              <span
                v-if="answered && choice === currentQuestion.meaning"
                class="shrink-0 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-black text-white"
              >
                ✓ 正解
              </span>
              <span
                v-else-if="answered && selectedAnswer === choice"
                class="shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950"
              >
                × 回答
              </span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div
              class="mb-6 flex items-center gap-4 rounded-2xl border-2 p-4"
              :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'"
            >
              <div
                class="grid size-12 shrink-0 place-items-center border-[3px] text-2xl font-black"
                :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'"
              >
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">
                  {{ isCorrect ? '正解！' : '不正解' }}
                </p>
                <p class="m-0 text-sm text-slate-700">
                  {{ currentQuestion.stressedWord }} = <strong>{{ currentQuestion.meaning }}</strong>
                </p>
              </div>
            </div>

            <div class="mb-7 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-indigo-600 uppercase">Pronunciation</p>
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="m-0 text-xl font-bold" style="font-family: 'PT Serif', Georgia, serif">
                    {{ currentQuestion.stressedWord }}
                  </p>
                  <p class="mt-1 mb-0 font-mono text-sm text-slate-600">{{ currentQuestion.ipa }}</p>
                </div>
                <button
                  type="button"
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-indigo-200 bg-white text-lg transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!speechSupported"
                  @click="speakCurrentWord"
                >
                  🔊
                </button>
              </div>
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
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Vocabulary Result</p>
          <h2 class="mb-3 text-4xl font-black text-indigo-700 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            まずは5語で操作感を確認。語彙マスターを増やせば、この形式のまま問題を自動生成できる。
          </p>
          <button
            type="button"
            class="mt-7 min-h-13 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
            @click="restart"
          >
            もう一度やる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
