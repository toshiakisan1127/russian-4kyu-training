<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { section1Questions } from '~/data/section1'
import { shuffle } from '~/utils/shuffle'

const createQuestionSet = () => shuffle(section1Questions).map((question) => {
  const correctWord = question.choices[question.answer]!.word
  const choices = shuffle(question.choices)

  return {
    ...question,
    choices,
    answer: choices.findIndex((choice) => choice.word === correctWord),
  }
})

const questionSet = ref(createQuestionSet())
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)
const speechSupported = ref(false)

const currentQuestion = computed(() => questionSet.value[currentIndex.value]!)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.answer)

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

const selectAnswer = (index: number) => {
  if (answered.value) return

  selectedAnswer.value = index
  answered.value = true

  if (index === currentQuestion.value.answer) {
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
}

const speak = (stressedWord: string) => {
  if (!speechSupported.value) return

  const text = stressedWord
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
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl">
      <NuxtLink
        to="/"
        class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-sky-700 transition hover:text-sky-900"
      >
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">大問別問題集</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">第I問・発音</h1>
          </div>
          <span class="shrink-0 rounded-full bg-sky-700 px-3 py-1.5 text-sm font-black text-white">
            {{ Math.min(currentIndex + 1, questionSet.length) }} / {{ questionSet.length }}
          </span>
        </header>

        <div v-if="!completed">
          <div class="mb-6 rounded-2xl bg-slate-100 px-4 py-3.5">
            <p class="m-0 text-sm font-bold leading-6 text-slate-700">
              下線部の発音が、他の3つと異なる単語を1つ選びなさい。
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="(choice, index) in currentQuestion.choices"
              :key="choice.word"
              type="button"
              :class="choiceClasses(index)"
              :disabled="answered"
              @click="selectAnswer(index)"
            >
              <span class="grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">
                {{ index + 1 }}
              </span>
              <span class="min-w-0 flex-1">
                <span
                  class="block text-2xl font-bold"
                  style="font-family: 'PT Serif', Georgia, serif"
                >
                  {{ choice.prefix }}<span class="decoration-2 underline underline-offset-4">{{ choice.target }}</span>{{ choice.suffix }}
                </span>
                <span class="mt-0.5 block text-xs font-medium text-slate-500">{{ choice.meaning }}</span>
              </span>
              <span
                v-if="answered && index === currentQuestion.answer"
                class="shrink-0 rounded-full bg-sky-600 px-2 py-1 text-[11px] font-black text-white"
              >
                ✓ 正解
              </span>
              <span
                v-else-if="answered && selectedAnswer === index"
                class="shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-950"
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
                <p v-if="!isCorrect" class="m-0 text-sm text-slate-700">
                  正解は {{ currentQuestion.answer + 1 }}. {{ currentQuestion.choices[currentQuestion.answer]!.stressedWord }}
                </p>
              </div>
            </div>

            <div class="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3.5">
              <p class="mb-1 text-xs font-black tracking-[0.12em] text-sky-700 uppercase">ポイント</p>
              <p class="m-0 font-bold leading-7 text-slate-800">{{ currentQuestion.rule }}</p>
            </div>

            <div class="mb-7">
              <h2 class="mb-2 text-base font-black">4つの発音を確認</h2>
              <article
                v-for="(choice, index) in currentQuestion.choices"
                :key="`detail-${choice.word}`"
                class="border-t border-slate-200 py-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <strong
                        class="text-xl"
                        style="font-family: 'PT Serif', Georgia, serif"
                      >
                        {{ index + 1 }}. {{ choice.stressedWord }}
                      </strong>
                      <span class="font-mono text-sm text-slate-600">{{ choice.ipa }}</span>
                      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-700">下線部 {{ choice.targetSound }}</span>
                    </div>
                    <p class="mt-1 text-xs font-medium text-slate-500">{{ choice.meaning }}</p>
                  </div>
                  <button
                    type="button"
                    class="grid size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-sky-50 text-lg transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="!speechSupported"
                    :aria-label="`${choice.word} を読み上げる`"
                    @click="speak(choice.stressedWord)"
                  >
                    🔊
                  </button>
                </div>
                <p class="mt-2 mb-0 leading-7 text-slate-700">{{ choice.explanation }}</p>
              </article>
            </div>

            <button
              type="button"
              class="min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
              @click="goNext"
            >
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Section I Result</p>
          <h2 class="mb-3 text-4xl font-black text-sky-800 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">
            第I問は、無声化・有声化・母音の弱化・例外的な発音を見抜けるかがポイント。
          </p>
          <button
            type="button"
            class="mt-7 min-h-13 w-full rounded-2xl bg-sky-700 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-800"
            @click="restart"
          >
            もう一度やる
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
