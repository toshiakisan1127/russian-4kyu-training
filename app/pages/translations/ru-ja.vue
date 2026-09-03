<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ruJaQuestions } from '~/data/translationRuJa'
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
  const statuses = getQuestionStatuses(ruJaQuestions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof ruJaQuestions> = { new: [], review: [], learning: [], mastered: [] }

  ruJaQuestions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof ruJaQuestions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof ruJaQuestions = []
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
const revealed = ref(false)
const graded = ref(false)
const gotItCount = ref(0)
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
  utterance.rate = 0.7
  const russianVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice
  window.speechSynthesis.speak(utterance)
}

const reveal = () => {
  revealed.value = true
}

const grade = (gotIt: boolean) => {
  if (!revealed.value || graded.value) return
  recordQuestionResult(currentQuestion.value.id, gotIt)
  if (gotIt) gotItCount.value += 1
  graded.value = true
  progressVersion.value += 1
}

const goNext = () => {
  if (!graded.value) return
  window.speechSynthesis?.cancel()

  if (currentIndex.value === questionSet.value.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  revealed.value = false
  graded.value = false
}

const restart = () => {
  window.speechSynthesis?.cancel()
  questionSet.value = createQuestionSet()
  currentIndex.value = 0
  revealed.value = false
  graded.value = false
  gotItCount.value = 0
  completed.value = false
  progressVersion.value += 1
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-sky-700 transition hover:text-sky-900">← トップへ戻る</NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Translation</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">露文和訳</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">60文から習熟度に合わせて10問</p>
          </div>
          <span class="shrink-0 rounded-full bg-sky-700 px-3 py-1.5 text-sm font-black text-white">{{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}</span>
        </header>

        <div v-if="!completed">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full border px-2.5 py-1 text-xs font-black" :class="currentStatusClasses">{{ currentStatusText }}</span>
            <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">自己採点</span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">次のロシア語文を日本語に訳してから、模範訳を確認しよう。</p>
          </div>

          <div class="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 sm:p-6">
            <p class="mb-2 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">Russian</p>
            <div class="flex items-start justify-between gap-4">
              <p class="m-0 text-2xl font-bold leading-10 sm:text-3xl" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.russian }}</p>
              <button type="button" class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-lg transition hover:bg-sky-100 disabled:opacity-40" :disabled="!speechSupported" @click="speak(currentQuestion.russian)">🔊</button>
            </div>
          </div>

          <button v-if="!revealed" type="button" class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="reveal">模範訳を見る</button>

          <section v-else class="space-y-5" aria-live="polite">
            <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p class="mb-2 text-xs font-black tracking-[0.12em] text-emerald-700 uppercase">Model Translation</p>
              <p class="m-0 text-lg font-black leading-8 text-slate-900">{{ currentQuestion.japanese }}</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-3 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Vocabulary</p>
              <ul class="m-0 grid gap-2 pl-5 text-sm font-bold leading-6 text-slate-700">
                <li v-for="item in currentQuestion.vocabulary" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div class="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p class="mb-2 text-xs font-black tracking-[0.12em] text-violet-700 uppercase">Grammar</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.grammar }}</p>
            </div>

            <div v-if="!graded" class="grid gap-3 sm:grid-cols-2">
              <button type="button" class="min-h-13 rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-3 font-black text-amber-900 transition hover:bg-amber-100" @click="grade(false)">要復習</button>
              <button type="button" class="min-h-13 rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-4 py-3 font-black text-emerald-900 transition hover:bg-emerald-100" @click="grade(true)">できた</button>
            </div>

            <button v-else type="button" class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="goNext">{{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}</button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Translation Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ gotItCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">模範訳と比べて意味を取れた文を「できた」として記録。要復習の文は次回優先して出る。</p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="restart">次の10問をやる</button>
        </section>
      </div>
    </section>
  </main>
</template>
