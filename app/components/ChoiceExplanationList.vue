<script setup lang="ts">
import { computed } from 'vue'
import { verbGovernmentByWord } from '~/data/verbGovernment'
import { getVocabularyExamTips } from '~/data/vocabularyExamTips'

type ChoiceDetail = {
  value: string
  explanation: string
  isCorrect?: boolean
}

const props = withDefaults(defineProps<{
  choices: readonly ChoiceDetail[]
  title?: string
}>(), {
  title: '他の選択肢も確認',
})

const stripStress = (text: string) => text
  .normalize('NFD')
  .replace(/\u0301/g, '')
  .normalize('NFC')

const correctVocabularyChoice = computed(() => {
  if (props.title !== '意味の選択肢を確認') return null
  return props.choices.find((choice) => choice.isCorrect) ?? null
})

const vocabularyWord = computed(() => {
  const match = correctVocabularyChoice.value?.explanation.match(/^(.+?)は「/u)
  return match?.[1] ? stripStress(match[1]) : null
})

const vocabularyPartOfSpeech = computed(() => {
  const match = correctVocabularyChoice.value?.explanation.match(/という意味の(.+?)です。/u)
  return match?.[1] ?? null
})

const examTips = computed(() => {
  const word = vocabularyWord.value
  return word ? getVocabularyExamTips(word, vocabularyPartOfSpeech.value) : []
})

const verbGovernment = computed(() => {
  const word = vocabularyWord.value
  return word ? verbGovernmentByWord[word] : undefined
})
</script>

<template>
  <details v-if="choices.length > 0" class="group mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-black transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
      <span>{{ title === '意味の選択肢を確認' ? '他の選択肢も確認' : title }}</span>
      <span class="text-lg transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
    </summary>
    <div class="border-t border-slate-200 px-4">
      <article
        v-for="choice in choices"
        :key="choice.value"
        class="border-t border-slate-200 py-4 first:border-t-0"
      >
        <div class="flex items-start gap-2">
          <strong class="min-w-0 flex-1 text-lg leading-7" style="font-family: 'PT Serif', Georgia, serif">{{ choice.value }}</strong>
          <span v-if="choice.isCorrect" class="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-black text-white">✓ 正解</span>
        </div>
        <p class="mt-1.5 mb-0 leading-7 text-slate-700">{{ choice.explanation }}</p>
      </article>
    </div>
  </details>

  <section v-if="examTips.length > 0" class="mb-5 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
    <div class="flex items-start gap-3 border-b border-amber-200 bg-amber-100/70 px-4 py-3">
      <span class="grid size-8 shrink-0 place-items-center rounded-full bg-amber-500 text-base" aria-hidden="true">🎯</span>
      <div>
        <p class="m-0 text-sm font-black text-amber-950">4級ポイント</p>
        <p class="mt-1 mb-0 text-xs font-bold text-amber-800">この単語と一緒に押さえたい、試験で狙われやすいポイント</p>
      </div>
    </div>
    <ul class="m-0 grid gap-2 px-4 py-4 pl-9 text-sm leading-6 text-slate-800">
      <li v-for="tip in examTips" :key="tip" class="pl-1">{{ tip }}</li>
    </ul>
  </section>

  <section v-if="verbGovernment" class="mb-5 overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50">
    <div class="border-b border-indigo-200 bg-indigo-100/70 px-4 py-3">
      <p class="m-0 text-sm font-black text-indigo-950">語法・格支配</p>
      <p class="mt-1 mb-0 font-mono text-sm font-bold text-indigo-800">{{ verbGovernment.pattern }}</p>
    </div>

    <div class="divide-y divide-indigo-100 bg-white">
      <div v-for="role in verbGovernment.roles" :key="`${role.label}-${role.caseLabel}`" class="grid grid-cols-[5.5rem_1fr] gap-3 px-4 py-3">
        <span class="h-fit rounded-full bg-indigo-100 px-2 py-1 text-center text-xs font-black text-indigo-800">{{ role.caseLabel }}</span>
        <div>
          <p class="m-0 text-sm font-black text-slate-900">{{ role.label }}</p>
          <p v-if="role.question" class="mt-1 mb-0 font-mono text-xs font-bold text-slate-500">{{ role.question }}</p>
        </div>
      </div>
    </div>

    <div class="border-t border-indigo-200 px-4 py-4">
      <p v-if="verbGovernment.note" class="mt-0 mb-3 rounded-xl bg-white px-3 py-2 text-sm leading-6 text-slate-700">💡 {{ verbGovernment.note }}</p>
      <p class="m-0 text-lg font-bold leading-7" style="font-family: 'PT Serif', Georgia, serif">{{ verbGovernment.example.sentence }}</p>
      <p class="mt-1 mb-0 text-sm leading-6 text-slate-700">{{ verbGovernment.example.translation }}</p>
    </div>
  </section>
</template>