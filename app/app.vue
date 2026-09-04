<script setup lang="ts">
import { onMounted } from 'vue'

const STORAGE_KEY = 'russian-speech-rate'
const THEME_KEY = 'russian-theme'

const clampSpeechRate = (value: number) => Math.min(1, Math.max(0.1, value))

const applySavedSpeechRate = () => {
  const input = document.getElementById('global-speech-rate') as HTMLInputElement | null
  const output = document.getElementById('global-speech-rate-value')
  if (!input || !output) return

  const savedRate = Number(window.localStorage.getItem(STORAGE_KEY))
  const rate = Number.isFinite(savedRate) ? clampSpeechRate(savedRate) : 0.4
  input.value = String(rate)
  output.textContent = rate.toFixed(1)
}

const updateThemeButton = (isDark: boolean) => {
  const button = document.getElementById('theme-toggle')
  if (!button) return

  button.textContent = isDark ? '☀️' : '🌙'
  button.setAttribute('aria-label', isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え')
  button.setAttribute('title', isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え')
}

const applySavedTheme = () => {
  const savedTheme = window.localStorage.getItem(THEME_KEY)
  const isDark = savedTheme === 'dark'
    || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
  updateThemeButton(isDark)
}

onMounted(() => {
  applySavedSpeechRate()
  applySavedTheme()

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/russian-4kyu-training/sw.js', {
      scope: '/russian-4kyu-training/',
    }).catch(() => {
      // PWA登録に失敗してもアプリ本体は通常どおり利用できる。
    })
  }
})

const updateSpeechRate = (event: Event) => {
  const value = clampSpeechRate(Number((event.target as HTMLInputElement).value))
  window.localStorage.setItem(STORAGE_KEY, String(value))

  const output = document.getElementById('global-speech-rate-value')
  if (output) output.textContent = value.toFixed(1)
}

const toggleTheme = () => {
  const isDark = !document.documentElement.classList.contains('dark')
  document.documentElement.classList.toggle('dark', isDark)
  window.localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  updateThemeButton(isDark)
}
</script>

<template>
  <NuxtPage />

  <div class="fixed top-3 right-3 z-50 flex items-start gap-2">
    <button
      id="theme-toggle"
      type="button"
      class="grid size-10 place-items-center rounded-full border border-slate-200 bg-white/95 text-lg shadow-lg shadow-slate-900/10 backdrop-blur transition hover:scale-105 hover:bg-indigo-50"
      aria-label="ダークモードに切り替え"
      title="ダークモードに切り替え"
      @click="toggleTheme"
    >
      🌙
    </button>

    <details>
      <summary
        class="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-slate-200 bg-white/95 text-lg shadow-lg shadow-slate-900/10 backdrop-blur transition hover:scale-105 hover:bg-indigo-50 [&::-webkit-details-marker]:hidden"
        aria-label="読み上げ速度を調整"
        title="読み上げ速度を調整"
      >
        🔊
      </summary>

      <div class="absolute top-12 right-0 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/15">
        <div class="mb-1 flex items-center justify-between gap-3">
          <label for="global-speech-rate" class="text-xs font-black tracking-[0.08em] text-slate-700 uppercase">
            読み上げ速度
          </label>
          <output id="global-speech-rate-value" for="global-speech-rate" class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-800">
            0.4
          </output>
        </div>
        <input
          id="global-speech-rate"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value="0.4"
          class="h-2 w-full cursor-pointer accent-indigo-600"
          aria-label="読み上げ速度"
          @input="updateSpeechRate"
        >
        <div class="mt-1 flex justify-between text-[10px] font-bold text-slate-500">
          <span>ゆっくり</span>
          <span>標準</span>
        </div>
      </div>
    </details>
  </div>
</template>
