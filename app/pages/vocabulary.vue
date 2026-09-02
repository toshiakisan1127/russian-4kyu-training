<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { vocabularyItems, type RussianCase, type VocabularyPartOfSpeech } from '~/data/vocabulary'
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

const caseItems: { key: RussianCase; label: string }[] = [
  { key: 'nominative', label: '主格' },
  { key: 'genitive', label: '生格' },
  { key: 'dative', label: '与格' },
  { key: 'accusative', label: '対格' },
  { key: 'instrumental', label: '造格' },
  { key: 'prepositional', label: '前置格' },
]

const partOfSpeechLabel: Record<VocabularyPartOfSpeech, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
  pronoun: '代名詞',
  preposition: '前置詞',
  conjunction: '接続詞',
  numeral: '数詞',
  particle: '助詞・表現',
}

const genderLabel = {
  masculine: '男性',
  feminine: '女性',
  neuter: '中性',
} as const

const adjectiveFormItems = [
  { key: 'masculine', label: '男性' },
  { key: 'feminine', label: '女性' },
  { key: 'neuter', label: '中性' },
  { key: 'plural', label: '複数' },
] as const

const createQuestionSet = () => {
  const statuses = getQuestionStatuses(vocabularyItems.map((item) => item.id))
  const buckets: Record<QuestionStatus, typeof vocabularyItems> = {
    new: [],
    review: [],
    learning: [],
    mastered: [],
  }

  vocabularyItems.forEach((item) => {
    buckets[statuses[item.id] ?? 'new'].push(item)
  })

  const queues: Record<QuestionStatus, typeof vocabularyItems> = {
    new: shuffle(buckets.new),
    review: shuffle(buckets.review),
    learning: shuffle(buckets.learning),
    mastered: shuffle(buckets.mastered),
  }

  const selected: typeof vocabularyItems = []
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

  return shuffle(selected).map((item) => {
    const samePartOfSpeech = shuffle(vocabularyItems.filter((candidate) =>
      candidate.id !== item.id
      && candidate.partOfSpeech === item.partOfSpeech
      && candidate.meaning !== item.meaning,
    ))

    const meanings = new Set<string>()
    const distractors: string[] = []
    for (const candidate of samePartOfSpeech) {
      if (meanings.has(candidate.meaning)) continue
      meanings.add(candidate.meaning)
      distractors.push(candidate.meaning)
      if (distractors.length === 3) break
    }

    return {
      ...item,
      choices: shuffle([item.meaning, ...distractors]),
    }
  })
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

const speak = (stressedText: string) => {
  if (!speechSupported.value) return

  const text = stressedText
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

  if (russianVoice) utterance.voice = russianVoice
  window.speechSynthesis.speak(utterance)
}

const selectAnswer = (value: string) => {
  if (answered.value) return

  selectedAnswer.value = value
  answered.value = true

  const correct = value === currentQuestion.value.meaning
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
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
        ← トップへ戻る
      </NuxtLink>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/60 sm:p-8">
        <header class="mb-7 flex items-start justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Vocabulary</p>
            <h1 class="text-2xl font-black tracking-tight sm:text-3xl">語彙トレーニング</h1>
            <p class="mt-1 mb-0 text-xs font-bold text-slate-500">550語プールから習熟度優先で10語</p>
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
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
              {{ partOfSpeechLabel[currentQuestion.partOfSpeech] }}
            </span>
          </div>

          <div class="mb-6 text-center">
            <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">この単語の意味は？</p>
            <p class="m-0 text-[clamp(2.4rem,10vw,4rem)] leading-[1.35]" style="font-family: 'PT Serif', Georgia, serif">
              {{ currentQuestion.stressedWord }}
            </p>
            <button
              type="button"
              class="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-black text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              @click="speak(currentQuestion.stressedWord)"
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
              <span v-if="answered && choice === currentQuestion.meaning" class="shrink-0 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-black text-white">✓ 正解</span>
              <span v-else-if="answered && selectedAnswer === choice" class="shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950">× 回答</span>
            </button>
          </div>

          <section v-if="answered" class="mt-7 border-t border-slate-200 pt-6" aria-live="polite">
            <div class="mb-6 flex items-center gap-4 rounded-2xl border-2 p-4" :class="isCorrect ? 'border-solid border-sky-500 bg-sky-50' : 'border-dashed border-amber-500 bg-amber-50'">
              <div class="grid size-12 shrink-0 place-items-center border-[3px] text-2xl font-black" :class="isCorrect ? 'rounded-full border-sky-600 text-sky-700' : 'rounded-xl border-amber-600 text-amber-800'">
                {{ isCorrect ? '○' : '×' }}
              </div>
              <div>
                <p class="mb-1 text-lg font-black" :class="isCorrect ? 'text-sky-800' : 'text-amber-900'">{{ isCorrect ? '正解！' : '不正解' }}</p>
                <p class="m-0 text-sm text-slate-700">{{ currentQuestion.stressedWord }} = <strong>{{ currentQuestion.meaning }}</strong></p>
              </div>
            </div>

            <div class="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4">
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-black text-white">{{ partOfSpeechLabel[currentQuestion.partOfSpeech] }}</span>
                <span v-if="currentQuestion.partOfSpeech === 'noun'" class="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-black text-indigo-800">
                  {{ currentQuestion.plural === '複数形のみ' ? '複数形のみ' : `${genderLabel[currentQuestion.gender]}名詞` }}
                </span>
                <span v-if="currentQuestion.partOfSpeech === 'verb'" class="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-black text-indigo-800">
                  {{ currentQuestion.aspect === 'imperfective' ? '不完了体' : '完了体' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="m-0 text-xl font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.stressedWord }}</p>
                  <p v-if="currentQuestion.ipa" class="mt-1 mb-0 font-mono text-sm text-slate-600">{{ currentQuestion.ipa }}</p>
                </div>
                <button type="button" class="grid size-10 shrink-0 place-items-center rounded-full border border-indigo-200 bg-white text-lg transition hover:bg-indigo-100 disabled:opacity-40" :disabled="!speechSupported" @click="speak(currentQuestion.stressedWord)">🔊</button>
              </div>
            </div>

            <div v-if="currentQuestion.example" class="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p class="mb-2 text-xs font-black tracking-[0.12em] text-slate-500 uppercase">Example</p>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="m-0 text-xl font-bold leading-8" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.example.sentence }}</p>
                  <p class="mt-1 mb-0 leading-6 text-slate-700">{{ currentQuestion.example.translation }}</p>
                  <p v-if="currentQuestion.example.ipa" class="mt-2 mb-0 font-mono text-xs text-slate-500">{{ currentQuestion.example.ipa }}</p>
                </div>
                <button type="button" class="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-lg transition hover:bg-slate-100 disabled:opacity-40" :disabled="!speechSupported" @click="speak(currentQuestion.example.sentence)">🔊</button>
              </div>
            </div>

            <div v-if="currentQuestion.partOfSpeech === 'noun'" class="mb-5 overflow-hidden rounded-2xl border border-slate-200">
              <div class="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p class="m-0 text-sm font-black">名詞の形</p>
              </div>
              <div class="grid grid-cols-[5rem_1fr] items-center gap-3 px-4 py-3">
                <span class="text-sm font-black text-slate-500">複数形</span>
                <strong class="text-lg" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.plural }}</strong>
              </div>
              <template v-if="currentQuestion.declension">
                <div class="border-y border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-500">単数6格</div>
                <div class="divide-y divide-slate-200">
                  <div v-for="caseItem in caseItems" :key="caseItem.key" class="grid grid-cols-[5rem_1fr] items-center gap-3 px-4 py-3">
                    <span class="text-sm font-black text-slate-500">{{ caseItem.label }}</span>
                    <strong class="text-lg" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.declension[caseItem.key] }}</strong>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="currentQuestion.partOfSpeech === 'verb' && currentQuestion.presentConjugation" class="mb-5 overflow-hidden rounded-2xl border border-slate-200">
              <div class="border-b border-slate-200 bg-slate-100 px-4 py-3"><p class="m-0 text-sm font-black">現在形の活用</p></div>
              <div class="grid gap-px bg-slate-200 sm:grid-cols-2">
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.firstSingular }}</strong></div>
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.secondSingular }}</strong></div>
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.thirdSingular }}</strong></div>
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.firstPlural }}</strong></div>
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.secondPlural }}</strong></div>
                <div class="bg-white px-4 py-3"><strong>{{ currentQuestion.presentConjugation.thirdPlural }}</strong></div>
              </div>
            </div>

            <template v-if="currentQuestion.partOfSpeech === 'adjective' && currentQuestion.forms && currentQuestion.declension">
              <div class="mb-5 rounded-2xl border border-slate-200 px-4 py-4">
                <p class="mb-3 text-sm font-black">基本形</p>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div v-for="formItem in adjectiveFormItems" :key="formItem.key" class="rounded-xl bg-slate-100 px-3 py-2">
                    <span class="block text-xs font-black text-slate-500">{{ formItem.label }}</span>
                    <strong class="mt-1 block" style="font-family: 'PT Serif', Georgia, serif">{{ currentQuestion.forms[formItem.key] }}</strong>
                  </div>
                </div>
              </div>

              <div class="mb-5 overflow-x-auto rounded-2xl border border-slate-200">
                <table class="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead class="bg-slate-100">
                    <tr><th class="px-3 py-3 font-black">格</th><th class="px-3 py-3 font-black">男性</th><th class="px-3 py-3 font-black">女性</th><th class="px-3 py-3 font-black">中性</th><th class="px-3 py-3 font-black">複数</th></tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr v-for="caseItem in caseItems" :key="`adjective-${caseItem.key}`">
                      <th class="px-3 py-3 font-black text-slate-500">{{ caseItem.label }}</th>
                      <td class="px-3 py-3 font-bold">{{ currentQuestion.declension[caseItem.key].masculine }}</td>
                      <td class="px-3 py-3 font-bold">{{ currentQuestion.declension[caseItem.key].feminine }}</td>
                      <td class="px-3 py-3 font-bold">{{ currentQuestion.declension[caseItem.key].neuter }}</td>
                      <td class="px-3 py-3 font-bold">{{ currentQuestion.declension[caseItem.key].plural }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>

            <button type="button" class="min-h-13 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-700" @click="goNext">
              {{ currentIndex === questionSet.length - 1 ? '結果を見る' : '次の問題へ' }}
            </button>
          </section>
        </div>

        <section v-else class="py-10 text-center">
          <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Vocabulary Result</p>
          <h2 class="mb-3 text-4xl font-black text-indigo-700 sm:text-5xl">{{ correctCount }} / {{ questionSet.length }}</h2>
          <p class="mx-auto mb-0 max-w-md leading-7 text-slate-600">550語プールから、新規・要復習を優先して10語ずつ進める。</p>
          <button type="button" class="mt-7 min-h-13 w-full rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-indigo-700" @click="restart">もう一度やる</button>
        </section>
      </div>
    </section>
  </main>
</template>
