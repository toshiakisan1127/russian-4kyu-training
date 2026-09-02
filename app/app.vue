<script setup lang="ts">
import { computed, ref } from 'vue'
import { questions } from './data/questions'

const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value]!)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.answer)

const selectAnswer = (value: string) => {
  if (answered.value) return

  selectedAnswer.value = value
  answered.value = true

  if (value === currentQuestion.value.answer) {
    correctCount.value += 1
  }
}

const goNext = () => {
  if (!answered.value) return

  if (currentIndex.value === questions.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  selectedAnswer.value = null
  answered.value = false
}

const restart = () => {
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  correctCount.value = 0
  completed.value = false
}

const choiceClasses = (value: string) => {
  const base = 'flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-lg font-bold transition'

  if (!answered.value) {
    return `${base} border-stone-300 bg-white text-zinc-950 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-stone-50`
  }

  if (value === currentQuestion.value.answer) {
    return `${base} border-[3px] border-solid border-zinc-950 bg-white text-zinc-950 shadow-[inset_6px_0_0_#18181b]`
  }

  if (selectedAnswer.value === value) {
    return `${base} border-[3px] border-dashed border-zinc-950 bg-stone-100 text-zinc-950`
  }

  return `${base} border-stone-200 bg-stone-50 text-zinc-400 opacity-55`
}
</script>

<template>
  <main class="min-h-screen bg-stone-100 px-4 py-8 text-zinc-950 sm:py-12">
    <section class="mx-auto w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-5 shadow-xl shadow-stone-300/30 sm:p-8">
      <header class="mb-8 flex items-start justify-between gap-4">
        <div>
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-zinc-500 uppercase">ロシア語能力検定4級</p>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">前置詞ミニトレーニング</h1>
        </div>
        <span class="shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-sm font-black text-white">
          {{ Math.min(currentIndex + 1, questions.length) }} / {{ questions.length }}
        </span>
      </header>

      <div v-if="!completed">
        <div class="mb-6">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-zinc-500 uppercase">前置詞</p>
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
              class="shrink-0 rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-black text-white"
            >
              ✓ 正解
            </span>
            <span
              v-else-if="answered && selectedAnswer === choice.value"
              class="shrink-0 rounded-full border-2 border-dashed border-zinc-950 bg-white px-2.5 py-1 text-xs font-black text-zinc-950"
            >
              × あなたの回答
            </span>
          </button>
        </div>

        <section v-if="answered" class="mt-7 border-t border-stone-200 pt-6" aria-live="polite">
          <div
            class="mb-7 flex items-center gap-4 rounded-2xl border-[3px] border-zinc-950 p-4 sm:p-5"
            :class="isCorrect ? 'border-solid bg-white' : 'border-dashed bg-stone-100'"
          >
            <div
              class="grid size-14 shrink-0 place-items-center border-[3px] border-zinc-950 text-3xl font-black leading-none"
              :class="isCorrect ? 'rounded-full' : 'rounded-xl'"
              aria-hidden="true"
            >
              {{ isCorrect ? '○' : '×' }}
            </div>
            <div>
              <p class="mb-1 text-xl font-black">{{ isCorrect ? '正解！' : '不正解' }}</p>
              <p v-if="!isCorrect" class="m-0 text-base">
                正解は <strong class="text-xl">「{{ currentQuestion.answer }}」</strong>
              </p>
              <p v-else class="m-0 text-sm text-zinc-600">その調子！</p>
            </div>
          </div>

          <div class="mb-7">
            <h2 class="mb-2 text-base font-black">なぜ？</h2>
            <p class="m-0 leading-7 text-zinc-700">{{ currentQuestion.correctExplanation }}</p>
          </div>

          <div class="mb-7">
            <h2 class="mb-2 text-base font-black">他の選択肢も確認</h2>
            <article
              v-for="choice in currentQuestion.choices"
              :key="`explanation-${choice.value}`"
              class="border-t border-stone-200 py-4"
            >
              <div class="flex items-center gap-2">
                <strong class="text-lg">{{ choice.value }}</strong>
                <span
                  v-if="choice.value === currentQuestion.answer"
                  class="rounded-full bg-zinc-950 px-2 py-0.5 text-[11px] font-black text-white"
                >
                  ✓ 正解
                </span>
              </div>
              <p class="mt-1.5 mb-0 leading-7 text-zinc-700">{{ choice.explanation }}</p>
            </article>
          </div>

          <button
            type="button"
            class="min-h-13 w-full rounded-2xl bg-zinc-950 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
            @click="goNext"
          >
            {{ currentIndex === questions.length - 1 ? '結果を見る' : '次の問題へ' }}
          </button>
        </section>
      </div>

      <section v-else class="py-10 text-center">
        <p class="mb-2 text-xs font-black tracking-[0.14em] text-zinc-500 uppercase">Result</p>
        <h2 class="mb-3 text-4xl font-black sm:text-5xl">{{ correctCount }} / {{ questions.length }}</h2>
        <p class="mx-auto mb-0 max-w-md leading-7 text-zinc-600">
          まずはこの5問をテンポよく回せればOK。解説を確認しながら、前置詞の使い分けを固めていこう。
        </p>
        <button
          type="button"
          class="mt-7 min-h-13 w-full rounded-2xl bg-zinc-950 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
          @click="restart"
        >
          もう一度やる
        </button>
      </section>
    </section>
  </main>
</template>
