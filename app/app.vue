<script setup lang="ts">
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'russian-speech-rate'
const speechRate = ref(0.4)
const speedOpen = ref(false)

onMounted(() => {
  const savedRate = Number(window.localStorage.getItem(STORAGE_KEY))
  if (Number.isFinite(savedRate)) {
    speechRate.value = Math.min(1, Math.max(0.1, savedRate))
  }
})

const updateSpeechRate = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  speechRate.value = value
  window.localStorage.setItem(STORAGE_KEY, String(value))
}
</script>

<template>
  <NuxtPage />

  <div class="fixed top-3 right-3 z-50">
    <button
      type="button"
      class="grid size-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-lg shadow-lg shadow-slate-900/10 backdrop-blur transition hover:scale-105 hover:bg-indigo-50"
      :aria-expanded="speedOpen"
      aria-controls="speech-rate-panel"
      aria-label="読み上げ速度を調整"
      title="読み上げ速度を調整"
      @click="speedOpen = !speedOpen"
    >
      🔊
    </button>

    <div
      v-if="speedOpen"
      id="speech-rate-panel"
      class="absolute top-12 right-0 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/15"
    >
      <div class="mb-1 flex items-center justify-between gap-3">
        <label for="global-speech-rate" class="text-xs font-black tracking-[0.08em] text-slate-700 uppercase">
          読み上げ速度
        </label>
        <output for="global-speech-rate" class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-800">
          {{ speechRate.toFixed(1) }}
        </output>
      </div>
      <input
        id="global-speech-rate"
        v-model="speechRate"
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        class="h-2 w-full cursor-pointer accent-indigo-600"
        aria-label="読み上げ速度"
        @input="updateSpeechRate"
      >
      <div class="mt-1 flex justify-between text-[10px] font-bold text-slate-500">
        <span>ゆっくり</span>
        <span>標準</span>
      </div>
    </div>
  </div>
</template>
