<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { section4Questions } from '~/data/section4'
import { shuffle } from '~/utils/shuffle'
import { stripStress } from '~/utils/russianStress'
import {
  getQuestionProgress,
  getQuestionStatus,
  getQuestionStatuses,
  questionStatusLabel,
  recordQuestionResult,
  type QuestionStatus,
} from '~/utils/questionProgress'

const SESSION_SIZE = 10
const VOWEL_RE = /[аеёиоуыэюя]/iu
const ACUTE = '\u0301'

const createQuestionSet = () => {
  const statuses = getQuestionStatuses(section4Questions.map((question) => question.id))
  const buckets: Record<QuestionStatus, typeof section4Questions> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  section4Questions.forEach((question) => {
    buckets[statuses[question.id] ?? 'new'].push(question)
  })

  const queues: Record<QuestionStatus, typeof section4Questions> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof section4Questions = []
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
const answerInput = ref('')
const selectedVowelIndex = ref<number | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)
const progressVersion = ref(0)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
const answerChars = computed(() => Array.from(answerInput.value))
const vowelIndexes = computed(() => answerChars.value
  .map((char, index) => VOWEL_RE.test(char) ? index : -1)
  .filter((index) => index >= 0))
const hasYo = computed(() => /ё/iu.test(answerInput.value))
const needsStressSelection = computed(() => vowelIndexes.value.length > 1 && !hasYo.value)

const addStress = (text: string, charIndex: number | null) => {
  const chars = Array.from(stripStress(text))
  if (charIndex === null) return chars.join('')
  const char = chars[charIndex]
  if (!char || !VOWEL_RE.test(char) || char.toLowerCase() === 'ё') return chars.join('')
  chars[charIndex] = `${char}${ACUTE}`
  return chars.join('')
}

const accentedAnswer = computed(() => addStress(answerInput.value, selectedVowelIndex.value))
const normalizePlain = (text: string) => stripStress(text.trim().toLowerCase()).normalize('NFC')
const normalizeStressed = (text: string) => text.trim().toLowerCase().normalize('NFD')
const formCorrect = computed(() => normalizePlain(answerInput.value) === normalizePlain(currentQuestion.value.plural))
const stressCorrect = computed(() => normalizeStressed(accentedAnswer.value) === normalizeStressed(currentQuestion.value.stressedPlural))
const isCorrect = computed(() => answered.value && formCorrect.value && stressCorrect.value)
const canSubmit = computed(() => answerInput.value.trim().length > 0 && (!needsStressSelection.value || selectedVowelIndex.value !== null))

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

  const speechText = stripStress(text)
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(speechText)
  utterance.lang = 'ru-RU'
  utterance.rate = Number(window.localStorage.getItem('russian-speech-rate') ?? '0.4')

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  answerInput.value = stripStress(target.value.trimStart())
  selectedVowelIndex.value = null
}

const chooseStress = (index: number) => {
  if (answered.value || !VOWEL_RE.test(answerChars.value[index] ?? '')) return
  selectedVowelIndex.value = index
}

const submitAnswer = () => {
  if (answered.value || !canSubmit.value) return
  answered.value = true

  const correct = formCorrect.value && stressCorrect.value
  recordQuestionResult(currentQuestion.value.id, correct)
  progressVersion.value += 1
  if (correct) correctCount.value += 1
}

const resetAnswer = () => {
  answerInput.value = ''
  selectedVowelIndex.value = null
  answered.value = false
}

const goNext = () => {
  if (!answered.value) return
  window.speechSynthesis?.cancel()

  if (currentIndex.value === questionSet.value.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  resetAnswer()
}

const restart = () => {
  window.speechSynthesis?.cancel()
  questionSet.value = createQuestionSet()
  currentIndex.value = 0
  correctCount.value = 0
  completed.value = false
  resetAnswer()
  progressVersion.value += 1
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">大問別問題集</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">第IV問・名詞の複数形</h1>
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
            <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">記述式</span>
          </div>

          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              名詞を主格複数形に直しなさい。複数形を入力したあと、強勢のある母音をタップしてください。
            </p>
          </div>

          <div class="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5">
            <div>
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Singular</p>
              <p class="m-0 text-4xl font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.stressedLemma }}</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-500">{{ currentQuestion.meaning }}</p>
            </div>
            <button
              type="button"
              class="grid size-11 shrink-0 place-items-center rounded-full border border-sky-200 bg-sky-50 text-xl transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              :aria-label="`${currentQuestion.lemma} を読み上げる`"
              @click="speak(currentQuestion.stressedLemma)"
            >🔊</button>
          </div>

          <label class="mb-2 block text-sm font-black text-slate-700" for="plural-answer">主格複数形</label>
          <input
            id="plural-answer"
            :value="answerInput"
            type="text"
            lang="ru"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            placeholder="例: студенты"
            class="min-h-14 w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-2xl font-bold outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50"
            style="font-family: 'PT Serif', Georgia, serif"
            :disabled="answered"
            @input="onInput"
            @keydown.enter.prevent="submitAnswer"
          >

          <div v-if="answerInput" class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="mb-3 text-xs font-black tracking-[0.1em] text-slate-500 uppercase">Stress</p>
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="(char, index) in answerChars"
                :key="`${char}-${index}`"
                type="button"
                class="grid min-h-11 min-w-9 place-items-center rounded-xl px-2 text-2xl font-bold transition"
                :class="VOWEL_RE.test(char)
                  ? selectedVowelIndex === index
                    ? 'bg-sky-700 text-white shadow-md'
                    : 'border border-sky-200 bg-white text-sky-900 hover:bg-sky-100'
                  : 'cursor-default text-slate-700'"
                :disabled="answered || !VOWEL_RE.test(char)"
                @click="chooseStress(index)"
              >{{ char }}</button>
            </div>
            <p class="mt-3 mb-0 text-sm font-bold text-slate-600">
              <template v-if="hasYo">ё はそれ自体が強勢を表すので、追加の選択は不要。</template>
              <template v-else-if="needsStressSelection && selectedVowelIndex === null">強勢のある母音を1つ選んでください。</template>
              <template v-else>回答: <span class="text-lg text-slate-950" style="font-family: 'PT Serif', Georgia, serif">{{ accentedAnswer }}</span></template>
            </p>
          </div>

          <button
            v-if="!answered"
            type="button"
            class="mt-6 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="!canSubmit"
            @click="submitAnswer"
          >答え合わせ</button>

          <section v-else class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-6 flex items-center gap-4 rounded-2xl border-2 p-4" :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'">
              <div class="grid size-12 shrink-0 place-items-center border-[3px] text-2xl font-black" :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'">
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">{{ isCorrect ? '正解！' : '不正解' }}</p>
                <p v-if="!isCorrect" class="m-0 text-sm text-slate-700">
                  <template v-if="!formCorrect">複数形の綴りを確認しよう。</template>
                  <template v-else>複数形は合っている。アクセント位置を確認しよう。</template>
                </p>
              </div>
            </div>

            <div class="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="mb-1 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">Correct Answer</p>
                  <p class="m-0 text-3xl font-bold text-slate-950" style="font-family: 'PT Serif', Georgia, serif">
                    {{ currentQuestion.stressedLemma }} → {{ currentQuestion.stressedPlural }}
                  </p>
                </div>
                <button
                  type="button"
                  class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-lg transition hover:bg-sky-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  @click="speak(currentQuestion.stressedPlural)"
                >🔊</button>
              </div>
            </div>

            <div class="mb-7 rounded-2xl border border-slate-200 bg-white p-4">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.rule }}</p>
            </div>

            <button type="button" class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Section IV Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            複数形の綴りとアクセントをセットで覚える。要復習・新規を優先して10問ずつ回そう。
          </p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800" @click="restart">
            次の10問をやる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
