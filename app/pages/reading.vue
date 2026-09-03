<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { readingPassages } from '~/data/readingPassages'

type TimerMode = 'prep' | 'reading'

const currentIndex = ref(0)
const showStress = ref(true)
const speechSupported = ref(false)
const timerMode = ref<TimerMode | null>(null)
const timerSeconds = ref(0)
const timerRunning = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

const currentPassage = computed(() => readingPassages[currentIndex.value]!)
const timerTitle = computed(() => timerMode.value === 'prep' ? '準備時間' : '朗読時間')
const timerDisplay = computed(() => {
  const minutes = Math.floor(timerSeconds.value / 60)
  const seconds = timerSeconds.value % 60
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
})
const timerUrgent = computed(() => timerSeconds.value > 0 && timerSeconds.value <= 30)

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

onUnmounted(() => {
  clearTimer()
  window.speechSynthesis?.cancel()
})

const clearTimer = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const startTimer = (mode: TimerMode) => {
  if (timerMode.value !== mode || timerSeconds.value === 0) {
    timerMode.value = mode
    timerSeconds.value = mode === 'prep' ? 300 : 180
  }

  clearTimer()
  timerRunning.value = true
  timerInterval = setInterval(() => {
    if (timerSeconds.value <= 1) {
      timerSeconds.value = 0
      timerRunning.value = false
      clearTimer()
      return
    }
    timerSeconds.value -= 1
  }, 1000)
}

const pauseTimer = () => {
  clearTimer()
  timerRunning.value = false
}

const resetTimer = () => {
  clearTimer()
  timerMode.value = null
  timerSeconds.value = 0
  timerRunning.value = false
}

const selectPassage = (index: number) => {
  currentIndex.value = index
  resetTimer()
  window.speechSynthesis?.cancel()
}

const goPrevious = () => {
  selectPassage((currentIndex.value - 1 + readingPassages.length) % readingPassages.length)
}

const goNext = () => {
  selectPassage((currentIndex.value + 1) % readingPassages.length)
}

const stripStress = (value: string) => value.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')

const speakPassage = () => {
  if (!speechSupported.value) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(
    currentPassage.value.paragraphs.map(stripStress).join(' '),
  )
  utterance.lang = 'ru-RU'
  utterance.rate = Number(window.localStorage.getItem('russian-speech-rate') ?? '0.4')
  utterance.pitch = 1

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-4xl">
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-rose-200 bg-white p-5 shadow-xl shadow-rose-100/60 sm:p-8">
        <header class="mb-7">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800">Exam Reading</span>
            <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">{{ readingPassages.length }}題</span>
          </div>
          <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-4xl">朗読対策</h1>
          <p class="m-0 max-w-3xl leading-7 text-slate-600">
            4級の本番を想定して、アクセント付きの短文を準備してから声に出して読もう。文章はすべてオリジナルの練習文です。
          </p>
        </header>

        <div class="mb-7 grid gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-950 sm:grid-cols-3 sm:gap-4">
          <div>
            <span class="block text-xs font-black tracking-[0.12em] text-rose-700 uppercase">Step 1</span>
            <span>5分で黙読・書き込み</span>
          </div>
          <div>
            <span class="block text-xs font-black tracking-[0.12em] text-rose-700 uppercase">Step 2</span>
            <span>音声で発音を確認</span>
          </div>
          <div>
            <span class="block text-xs font-black tracking-[0.12em] text-rose-700 uppercase">Step 3</span>
            <span>3分間、声に出して朗読</span>
          </div>
        </div>

        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="(passage, index) in readingPassages"
            :key="passage.id"
            type="button"
            class="grid size-10 place-items-center rounded-full border text-sm font-black transition hover:-translate-y-0.5"
            :class="index === currentIndex ? 'border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-200' : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50'"
            :aria-label="(index + 1) + '題目・' + passage.title"
            :aria-pressed="index === currentIndex"
            @click="selectPassage(index)"
          >
            {{ index + 1 }}
          </button>
        </div>

        <div class="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.12em] text-rose-700 uppercase">{{ currentPassage.theme }}</p>
            <h2 class="m-0 text-2xl font-black">{{ currentPassage.title }}</h2>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="min-h-11 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-black text-rose-800 transition hover:bg-rose-100"
              :aria-pressed="showStress"
              @click="showStress = !showStress"
            >
              {{ showStress ? 'アクセントを隠す' : 'アクセントを表示' }}
            </button>
            <button
              type="button"
              class="min-h-11 rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              @click="speakPassage"
            >
              🔊 音声を聴く
            </button>
          </div>
        </div>

        <section class="mb-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7" aria-labelledby="reading-text-heading">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Text</p>
              <h3 id="reading-text-heading" class="m-0 text-xl font-black">朗読テキスト</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">アクセント付き</span>
          </div>
          <div class="space-y-5 text-lg leading-9 sm:text-xl sm:leading-10" style="font-family: 'PT Serif', Georgia, serif">
            <p v-for="(paragraph, index) in currentPassage.paragraphs" :key="currentPassage.id + '-paragraph-' + index" class="m-0">
              {{ showStress ? paragraph : stripStress(paragraph) }}
            </p>
          </div>
        </section>

        <section class="mb-7 grid gap-5 lg:grid-cols-[1fr_18rem]">
          <div class="rounded-3xl border border-rose-100 bg-rose-50 p-5 sm:p-6">
            <p class="mb-1 text-xs font-black tracking-[0.12em] text-rose-700 uppercase">Timer</p>
            <h3 class="mb-4 text-xl font-black">本番タイマー</h3>
            <div class="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-white px-4 py-4">
              <div>
                <p class="mb-1 text-xs font-black text-slate-500">{{ timerMode ? timerTitle : 'モードを選択' }}</p>
                <p class="m-0 text-4xl font-black tabular-nums" :class="timerUrgent ? 'text-rose-600' : 'text-slate-900'">{{ timerMode ? timerDisplay : '00:00' }}</p>
              </div>
              <span v-if="timerRunning" class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">計測中</span>
              <span v-else-if="timerMode && timerSeconds === 0" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">終了</span>
            </div>
            <div class="grid gap-2 sm:grid-cols-2">
              <button type="button" class="min-h-12 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-black text-rose-800 transition hover:bg-rose-100" @click="startTimer('prep')">
                {{ timerMode === 'prep' && timerRunning ? '準備タイマーを再開' : '5分準備を開始' }}
              </button>
              <button type="button" class="min-h-12 rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700" @click="startTimer('reading')">
                {{ timerMode === 'reading' && timerRunning ? '朗読タイマーを再開' : '3分朗読を開始' }}
              </button>
            </div>
            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <button type="button" class="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100 disabled:opacity-40" :disabled="!timerRunning" @click="pauseTimer">
                一時停止
              </button>
              <button type="button" class="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100 disabled:opacity-40" :disabled="!timerMode" @click="resetTimer">
                リセット
              </button>
            </div>
          </div>

          <aside class="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Reading Tips</p>
            <h3 class="mb-4 text-xl font-black">読むときのポイント</h3>
            <ul class="m-0 space-y-3 pl-5 text-sm font-bold leading-6 text-slate-700">
              <li v-for="point in currentPassage.readingPoints" :key="point">{{ point }}</li>
            </ul>
          </aside>
        </section>

        <details class="mb-7 rounded-2xl border border-slate-200 bg-slate-50">
          <summary class="cursor-pointer list-none px-4 py-4 text-sm font-black text-slate-700 [&::-webkit-details-marker]:hidden">
            日本語訳を表示
          </summary>
          <div class="border-t border-slate-200 px-4 py-4 leading-7 text-slate-700">
            {{ currentPassage.translation }}
          </div>
        </details>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button type="button" class="min-h-12 rounded-xl border border-slate-200 bg-white px-5 py-2 font-black text-slate-700 transition hover:bg-slate-100" @click="goPrevious">
            ← 前の文章
          </button>
          <button type="button" class="min-h-12 rounded-xl bg-rose-600 px-5 py-2 font-black text-white transition hover:bg-rose-700" @click="goNext">
            次の文章 →
          </button>
        </div>

        <p v-if="!speechSupported" class="mt-5 mb-0 text-xs font-bold leading-5 text-slate-500">
          このブラウザでは音声再生に対応していません。タイマーと音読テキストはそのまま利用できます。
        </p>
      </div>
    </section>
  </main>
</template>
