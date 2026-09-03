<script setup lang="ts">
type ChoiceDetail = {
  value: string
  explanation: string
  isCorrect?: boolean
}

withDefaults(defineProps<{
  choices: readonly ChoiceDetail[]
  title?: string
}>(), {
  title: '他の選択肢も確認',
})
</script>

<template>
  <details v-if="choices.length > 0" class="group mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-black transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
      <span>{{ title }}</span>
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
</template>
