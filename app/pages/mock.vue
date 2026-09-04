<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { mockExam1, type MockInputField, type MockQuestion, type MockSection } from '~/data/mockExam1'

type Phase = 'intro' | 'exam' | 'result'

type AnswerEntry = {
  key: string
  question: MockQuestion
  field?: MockInputField
}

const phase = ref<Phase>('intro')
const currentSectionIndex = ref(0)
const answers = ref<Record<string, string | number>>({})
const timeLeft = ref(mockExam1.durationMinutes * 60)
const speechSupported = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const currentSection = computed(() => mockExam1.sections[currentSectionIndex.value]!)
const currentSectionQuestions = computed(() => currentSection.value.questions)

const answerKey = (question: MockQuestion, fieldId = 'choice') => question.id + ':' + fieldId

const answerEntries = computed<AnswerEntry[]>(() =>
  mockExam1.sections.flatMap((section) =>
    section.questions.flatMap((question) => {
      if (question.kind === 'choice') {
        return [{ key: answerKey(question), question }]
      }

      return question.fields.map((field) => ({
        key: answerKey(question, field.id),
        question,
        field,
      }))
    }),
  ),
)

const answeredCount = computed(() =>
  answerEntries.value.filter((entry) => {
    const value = answers.value[entry.key]
    return entry.field
      ? typeof value === 'string' && value.trim().length > 0
      : typeof value === 'number'
  }).length,
)

const totalCorrect = computed(() =>
  answerEntries.value.filter((entry) => isEntryCorrect(entry)).length,
)

const scorePercentage = computed(() =>
  Math.round((totalCorrect.value / mockExam1.totalAnswerFields) * 100),
)

const sectionAnsweredCount = (section: MockSection) =>
  answerEntries.value.filter((entry) => {
    if (!section.questions.includes(entry.question)) return false
    const value = answers.value[entry.key]
    return entry.field
      ? typeof value === 'string' && value.trim().length > 0
      : typeof value === 'number'
  }).length

const sectionTotalAnswerFields = (section: MockSection) =>
  answerEntries.value.filter((entry) => section.questions.includes(entry.question)).length

const sectionCorrectCount = (section: MockSection) =>
  answerEntries.value.filter((entry) =>
    section.questions.includes(entry.question) && isEntryCorrect(entry),
  ).length

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remaining = (seconds % 60).toString().padStart(2, '0')
  return minutes + ':' + remaining
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(() => {
    if (timeLeft.value <= 0) {
      submitExam()
      return
    }

    timeLeft.value -= 1
  }, 1000)
}

const startExam = () => {
  phase.value = 'exam'
  currentSectionIndex.value = 0
  answers.value = {}
  timeLeft.value = mockExam1.durationMinutes * 60
  startTimer()
}

const submitExam = () => {
  stopTimer()
  phase.value = 'result'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restart = () => {
  stopTimer()
  phase.value = 'intro'
  currentSectionIndex.value = 0
  answers.value = {}
  timeLeft.value = mockExam1.durationMinutes * 60
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setChoice = (question: MockQuestion, choiceIndex: number) => {
  if (question.kind !== 'choice' || phase.value !== 'exam') return
  answers.value[answerKey(question)] = choiceIndex
}

const inputValue = (question: MockQuestion, field: MockInputField) =>
  String(answers.value[answerKey(question, field.id)] ?? '')

const onTextInput = (question: MockQuestion, field: MockInputField, event: Event) => {
  if (phase.value !== 'exam') return
  const target = event.target as HTMLInputElement
  answers.value[answerKey(question, field.id)] = target.value
}

const normalizeAnswer = (value: string) =>
  value.normalize('NFC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('ru-RU')

const isEntryCorrect = (entry: AnswerEntry) => {
  const value = answers.value[entry.key]

  if (entry.question.kind === 'choice') {
    return typeof value === 'number' && value === entry.question.answer
  }

  return Boolean(
    entry.field &&
    typeof value === 'string' &&
    normalizeAnswer(value) === normalizeAnswer(entry.field.answer),
  )
}

const selectedChoiceText = (question: MockQuestion) => {
  if (question.kind !== 'choice') return '—'
  const value = answers.value[answerKey(question)]
  return typeof value === 'number' ? question.choices[value] ?? '—' : '未回答'
}

const fieldAnswerText = (question: MockQuestion, field: MockInputField) => {
  const value = answers.value[answerKey(question, field.id)]
  return typeof value === 'string' && value.trim() ? value : '未回答'
}

const speak = (text: string) => {
  if (!speechSupported.value) return

  const speechText = text
    .normalize('NFD')
    .replace(/\u0301/gu, '')
    .normalize('NFC')

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

const goToSection = (index: number) => {
  currentSectionIndex.value = index
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goNext = () => {
  if (currentSectionIndex.value < mockExam1.sections.length - 1) {
    goToSection(currentSectionIndex.value + 1)
  } else {
    submitExam()
  }
}

const goPrevious = () => {
  if (currentSectionIndex.value > 0) {
    goToSection(currentSectionIndex.value - 1)
  }
}

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

onBeforeUnmount(() => {
  stopTimer()
  window.speechSynthesis?.cancel()
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-5xl">
      <NuxtLink
        to="/"
        class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-amber-800 transition hover:text-amber-950"
      >
        ← トップへ戻る
      </NuxtLink>

      <div v-if="phase === 'intro'" class="rounded-3xl border border-amber-200 bg-white p-5 shadow-xl shadow-amber-100/60 sm:p-8">
        <header class="mb-8">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">Mock Exam · Grammar</p>
          <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-4xl">模擬試験 第1回</h1>
          <p class="m-0 max-w-3xl leading-7 text-slate-600">
            実際の過去問の出題数と解答形式を参考にした、文法Ⅰ〜Ⅷのオリジナル模試です。
            試験中は正解・解説を表示せず、提出後にまとめて確認します。
          </p>
        </header>

        <div class="mb-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl bg-amber-50 p-4">
            <p class="mb-1 text-xs font-black text-amber-800">問題カード</p>
            <p class="m-0 text-2xl font-black">54問</p>
          </div>
          <div class="rounded-2xl bg-sky-50 p-4">
            <p class="mb-1 text-xs font-black text-sky-800">解答欄</p>
            <p class="m-0 text-2xl font-black">66欄</p>
          </div>
          <div class="rounded-2xl bg-emerald-50 p-4">
            <p class="mb-1 text-xs font-black text-emerald-800">目安時間</p>
            <p class="m-0 text-2xl font-black">45分</p>
          </div>
        </div>

        <section class="mb-8">
          <h2 class="mb-4 text-lg font-black">出題構成</h2>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="section in mockExam1.sections"
              :key="section.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p class="mb-1 text-xs font-black text-slate-500">第{{ section.roman }}問</p>
              <p class="mb-1 font-black">{{ section.title }}</p>
              <p class="m-0 text-sm font-bold text-slate-600">
                {{ section.questions.length }}問
                <span v-if="section.roman === 'VII'">・16欄</span>
                <span v-else-if="section.roman === 'VIII'">・8欄</span>
              </p>
            </div>
          </div>
        </section>

        <div class="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-bold leading-7 text-amber-950">
          第Ⅳ問・第Ⅶ問・第Ⅷ問は記述式です。アクセント記号は、表示された単語の母音にアキュートアクセントを付けて入力してください。
        </div>

        <button
          type="button"
          class="min-h-14 w-full rounded-2xl bg-amber-700 px-5 py-3 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-amber-800"
          @click="startExam"
        >
          模試を開始する
        </button>
      </div>

      <div v-else-if="phase === 'exam'">
        <details data-testid="mock-exam-status" class="sticky top-16 z-10 mb-5 rounded-3xl border border-amber-200 bg-white/95 shadow-lg shadow-amber-100/60 backdrop-blur">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-3xl p-3 font-black outline-none transition hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-500 sm:p-4 [&::-webkit-details-marker]:hidden">
            <div class="min-w-0">
              <p class="mb-1 text-xs tracking-[0.14em] text-amber-700 uppercase">模擬試験 第1回</p>
              <p class="m-0 truncate text-sm text-slate-800 sm:text-base">第{{ currentSection.roman }}問・{{ currentSection.title }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <div
                class="rounded-xl border-2 px-3 py-1.5 text-center font-mono text-xl tabular-nums sm:px-4 sm:py-2 sm:text-2xl"
                :class="timeLeft <= 300 ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-amber-300 bg-amber-50 text-amber-900'"
                aria-live="polite"
              >
                {{ formatTime(timeLeft) }}
              </div>
              <span class="text-xs font-black text-slate-500">展開</span>
            </div>
          </summary>

          <div class="border-t border-amber-100 p-4 sm:p-5">
          <div class="mt-4 flex items-center justify-between gap-3 text-xs font-black text-slate-600">
            <span>解答済み {{ answeredCount }} / {{ mockExam1.totalAnswerFields }}</span>
            <span>{{ Math.round((answeredCount / mockExam1.totalAnswerFields) * 100) }}%</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full bg-amber-500 transition-all"
              :style="{ width: ((answeredCount / mockExam1.totalAnswerFields) * 100) + '%' }"
            />
          </div>

          <nav class="mt-5 grid grid-cols-4 gap-2 lg:grid-cols-8" aria-label="大問を選択">
            <button
              v-for="(section, index) in mockExam1.sections"
              :key="section.id"
              type="button"
              class="rounded-xl border px-2 py-2 text-left transition"
              :class="index === currentSectionIndex ? 'border-amber-600 bg-amber-100 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50'"
              @click="goToSection(index)"
            >
              <span class="block text-xs font-black">第{{ section.roman }}問</span>
              <span class="block text-xs font-bold">{{ sectionAnsweredCount(section) }}/{{ sectionTotalAnswerFields(section) }}欄</span>
            </button>
          </nav>

          </div>
        </details>

        <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
          <header class="mb-7 border-b border-slate-200 pb-6">
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">第{{ currentSection.roman }}問</p>
            <h2 class="mb-3 text-2xl font-black sm:text-3xl">{{ currentSection.title }}</h2>
            <p class="m-0 whitespace-pre-line leading-7 text-slate-600">{{ currentSection.instruction }}</p>
          </header>

          <div class="space-y-5">
            <article
              v-for="(question, questionIndex) in currentSectionQuestions"
              :key="question.id"
              class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
            >
              <div class="mb-4 flex items-start gap-3">
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-black text-amber-900">
                  {{ questionIndex + 1 }}
                </span>
                <p class="m-0 flex-1 whitespace-pre-line text-base font-bold leading-7 text-slate-800">
                  {{ question.prompt }}
                </p>
              </div>

              <div v-if="question.kind === 'choice'" class="grid gap-3 sm:grid-cols-3">
                <button
                  v-for="(choice, choiceIndex) in question.choices"
                  :key="choice"
                  type="button"
                  class="min-h-14 rounded-xl border-2 px-4 py-3 text-left font-bold transition"
                  :class="answers[answerKey(question)] === choiceIndex ? 'border-amber-600 bg-amber-100 text-amber-950' : 'border-slate-300 bg-white hover:border-amber-400 hover:bg-amber-50'"
                  :aria-pressed="answers[answerKey(question)] === choiceIndex"
                  @click="setChoice(question, choiceIndex)"
                >
                  <span class="mr-2 inline-grid size-6 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600">{{ choiceIndex + 1 }}</span>
                  {{ choice }}
                </button>
              </div>

              <div v-else class="grid gap-3 sm:grid-cols-2">
                <label
                  v-for="field in question.fields"
                  :key="field.id"
                  class="rounded-xl border border-slate-200 bg-white p-3"
                >
                  <span class="mb-2 block text-xs font-black text-slate-600">{{ field.label }}</span>
                  <input
                    type="text"
                    autocomplete="off"
                    autocapitalize="none"
                    spellcheck="false"
                    :value="inputValue(question, field)"
                    class="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                    placeholder="入力"
                    @input="onTextInput(question, field, $event)"
                  >
                </label>
              </div>
            </article>
          </div>

          <footer class="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              class="min-h-12 rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:border-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentSectionIndex === 0"
              @click="goPrevious"
            >
              ← 前の大問
            </button>

            <button
              v-if="currentSectionIndex < mockExam1.sections.length - 1"
              type="button"
              class="min-h-12 rounded-xl bg-amber-700 px-6 py-3 font-black text-white transition hover:bg-amber-800"
              @click="goNext"
            >
              次の大問 →
            </button>
            <button
              v-else
              type="button"
              class="min-h-12 rounded-xl bg-rose-700 px-6 py-3 font-black text-white transition hover:bg-rose-800"
              @click="submitExam"
            >
              提出して採点する
            </button>
          </footer>
        </section>
      </div>

      <div v-else class="space-y-5">
        <section class="rounded-3xl border border-emerald-200 bg-white p-5 text-center shadow-xl shadow-emerald-100/60 sm:p-8">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-emerald-700 uppercase">Result · Mock Exam 1</p>
          <h1 class="mb-3 text-2xl font-black sm:text-3xl">採点結果</h1>
          <p class="m-0 text-5xl font-black text-emerald-700">{{ totalCorrect }} / {{ mockExam1.totalAnswerFields }}</p>
          <p class="mt-3 mb-0 font-bold text-slate-600">解答欄ベースの正答率 {{ scorePercentage }}%</p>
          <p class="mt-3 mb-0 text-sm leading-6 text-slate-500">
            第Ⅶ問・第Ⅷ問は、2つの記述欄をそれぞれ採点しています。
          </p>
        </section>

        <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
          <h2 class="mb-4 text-xl font-black">大問別結果</h2>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="section in mockExam1.sections"
              :key="section.id"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="font-black">第{{ section.roman }}問・{{ section.title }}</span>
                <strong class="text-emerald-700">{{ sectionCorrectCount(section) }} / {{ sectionTotalAnswerFields(section) }}</strong>
              </div>
              <p class="mt-2 mb-0 text-xs font-bold text-slate-500">解答済み {{ sectionAnsweredCount(section) }}欄</p>
            </div>
          </div>
        </section>

        <section
          v-for="section in mockExam1.sections"
          :key="section.id + '-review'"
          class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8"
        >
          <h2 class="mb-5 text-xl font-black">第{{ section.roman }}問・{{ section.title }}</h2>

          <div class="space-y-3">
            <details
              v-for="(question, questionIndex) in section.questions"
              :key="question.id + '-detail'"
              class="rounded-2xl border border-slate-200 bg-slate-50"
            >
              <summary class="flex cursor-pointer list-none items-start gap-3 p-4 font-bold [&::-webkit-details-marker]:hidden">
                <span class="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-slate-600">{{ questionIndex + 1 }}</span>
                <span class="flex-1 whitespace-pre-line leading-6">{{ question.prompt }}</span>
                <span
                  v-if="question.kind === 'choice'"
                  class="shrink-0 rounded-full px-2 py-1 text-xs font-black"
                  :class="isEntryCorrect({ key: answerKey(question), question }) ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                >
                  {{ isEntryCorrect({ key: answerKey(question), question }) ? '正解' : '要復習' }}
                </span>
                <span v-else class="shrink-0 rounded-full bg-slate-200 px-2 py-1 text-xs font-black text-slate-700">
                  {{ question.fields.filter((field) => isEntryCorrect({ key: answerKey(question, field.id), question, field })).length }}/{{ question.fields.length }}
                </span>
              </summary>

              <div class="border-t border-slate-200 px-4 pt-4 pb-5">
                <template v-if="question.kind === 'choice'">
                  <div class="grid gap-3 text-sm sm:grid-cols-2">
                    <div class="rounded-xl border border-slate-200 bg-white p-3">
                      <p class="mb-1 text-xs font-black text-slate-500">あなたの回答</p>
                      <p class="m-0 font-bold text-slate-800">{{ selectedChoiceText(question) }}</p>
                    </div>
                    <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                      <p class="mb-1 text-xs font-black text-emerald-800">正解</p>
                      <p class="m-0 font-bold text-slate-800">{{ question.answerText }}</p>
                    </div>
                  </div>
                  <div class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p class="mb-1 text-xs font-black text-amber-800">解説</p>
                    <p class="m-0 whitespace-pre-line leading-7 text-slate-800">{{ question.explanation }}</p>
                  </div>
                  <div v-if="question.translation || question.speechText" class="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="mb-1 text-xs font-black text-sky-800">完成文・日本語訳</p>
                        <p v-if="question.speechText" class="m-0 font-bold leading-7 text-slate-800">{{ question.speechText }}</p>
                        <p v-if="question.translation" class="mt-1 mb-0 text-sm leading-6 text-slate-700">{{ question.translation }}</p>
                      </div>
                      <button
                        v-if="question.speechText"
                        type="button"
                        class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-lg transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="!speechSupported"
                        aria-label="完成文を読み上げる"
                        @click="speak(question.speechText)"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div v-if="question.completedSentence || question.translation" class="rounded-xl border border-sky-200 bg-sky-50 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="mb-1 text-xs font-black text-sky-800">完成文</p>
                        <p v-if="question.completedSentence" class="m-0 whitespace-pre-line font-bold leading-7 text-slate-800">{{ question.completedSentence }}</p>
                        <p v-if="question.translation" class="mt-1 mb-0 text-sm leading-6 text-slate-700">{{ question.translation }}</p>
                      </div>
                      <button
                        v-if="question.speechText"
                        type="button"
                        class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-lg transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="!speechSupported"
                        aria-label="完成文を読み上げる"
                        @click="speak(question.speechText)"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <div
                      v-for="field in question.fields"
                      :key="field.id"
                      class="rounded-xl border p-3"
                      :class="isEntryCorrect({ key: answerKey(question, field.id), question, field }) ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-xs font-black text-slate-600">{{ field.label }}</span>
                        <span class="text-xs font-black" :class="isEntryCorrect({ key: answerKey(question, field.id), question, field }) ? 'text-emerald-800' : 'text-rose-800'">
                          {{ isEntryCorrect({ key: answerKey(question, field.id), question, field }) ? '正解' : '要復習' }}
                        </span>
                      </div>
                      <p class="mt-2 mb-1 font-bold text-slate-800">回答：{{ fieldAnswerText(question, field) }}</p>
                      <p class="m-0 font-bold text-emerald-900">正解：{{ field.answer }}</p>
                      <p class="mt-2 mb-0 leading-6 text-slate-700">{{ field.explanation }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </details>
          </div>
        </section>

        <button
          type="button"
          class="min-h-13 w-full rounded-2xl bg-amber-700 px-5 py-3 font-black text-white transition hover:bg-amber-800"
          @click="restart"
        >
          もう一度、第1回を解く
        </button>
      </div>
    </section>
  </main>
</template>
