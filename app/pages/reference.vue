<script setup lang="ts">
import { onMounted, ref } from 'vue'

const speechSupported = ref(false)

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

const stripStress = (text: string) => text.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')

const speak = (text: string) => {
  if (!speechSupported.value) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(stripStress(text))
  utterance.lang = 'ru-RU'
  utterance.rate = Number(window.localStorage.getItem('russian-speech-rate') ?? '0.4')

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}

useHead({
  title: '4級重要表現まとめ | ロシア語4級トレーニング',
})

const numberWords = [
  { number: 1, word: 'оди́н' },
  { number: 2, word: 'два́' },
  { number: 3, word: 'три́' },
  { number: 4, word: 'четы́ре' },
  { number: 5, word: 'пя́ть' },
  { number: 6, word: 'ше́сть' },
  { number: 7, word: 'се́мь' },
  { number: 8, word: 'во́семь' },
  { number: 9, word: 'де́вять' },
  { number: 10, word: 'де́сять' },
  { number: 11, word: 'оди́ннадцать' },
  { number: 12, word: 'двена́дцать' },
  { number: 13, word: 'трина́дцать' },
  { number: 14, word: 'четы́рнадцать' },
  { number: 15, word: 'пятна́дцать' },
  { number: 16, word: 'шестна́дцать' },
  { number: 17, word: 'семна́дцать' },
  { number: 18, word: 'восемна́дцать' },
  { number: 19, word: 'девятна́дцать' },
  { number: 20, word: 'два́дцать' },
  { number: 21, word: 'два́дцать оди́н' },
  { number: 22, word: 'два́дцать два́' },
  { number: 23, word: 'два́дцать три́' },
  { number: 24, word: 'два́дцать четы́ре' },
  { number: 25, word: 'два́дцать пя́ть' },
  { number: 26, word: 'два́дцать ше́сть' },
  { number: 27, word: 'два́дцать се́мь' },
  { number: 28, word: 'два́дцать во́семь' },
  { number: 29, word: 'два́дцать де́вять' },
  { number: 30, word: 'три́дцать' },
  { number: 31, word: 'три́дцать оди́н' },
  { number: 32, word: 'три́дцать два́' },
  { number: 33, word: 'три́дцать три́' },
  { number: 34, word: 'три́дцать четы́ре' },
  { number: 35, word: 'три́дцать пя́ть' },
  { number: 36, word: 'три́дцать ше́сть' },
  { number: 37, word: 'три́дцать се́мь' },
  { number: 38, word: 'три́дцать во́семь' },
  { number: 39, word: 'три́дцать де́вять' },
  { number: 40, word: 'со́рок' },
  { number: 41, word: 'со́рок оди́н' },
  { number: 42, word: 'со́рок два́' },
  { number: 43, word: 'со́рок три́' },
  { number: 44, word: 'со́рок четы́ре' },
  { number: 45, word: 'со́рок пя́ть' },
  { number: 46, word: 'со́рок ше́сть' },
  { number: 47, word: 'со́рок се́мь' },
  { number: 48, word: 'со́рок во́семь' },
  { number: 49, word: 'со́рок де́вять' },
  { number: 50, word: 'пятьдеся́т' },
  { number: 51, word: 'пятьдеся́т оди́н' },
  { number: 52, word: 'пятьдеся́т два́' },
  { number: 53, word: 'пятьдеся́т три́' },
  { number: 54, word: 'пятьдеся́т четы́ре' },
  { number: 55, word: 'пятьдеся́т пя́ть' },
  { number: 56, word: 'пятьдеся́т ше́сть' },
  { number: 57, word: 'пятьдеся́т се́мь' },
  { number: 58, word: 'пятьдеся́т во́семь' },
  { number: 59, word: 'пятьдеся́т де́вять' },
  { number: 60, word: 'шестьдеся́т' },
  { number: 61, word: 'шестьдеся́т оди́н' },
  { number: 62, word: 'шестьдеся́т два́' },
  { number: 63, word: 'шестьдеся́т три́' },
  { number: 64, word: 'шестьдеся́т четы́ре' },
  { number: 65, word: 'шестьдеся́т пя́ть' },
  { number: 66, word: 'шестьдеся́т ше́сть' },
  { number: 67, word: 'шестьдеся́т се́мь' },
  { number: 68, word: 'шестьдеся́т во́семь' },
  { number: 69, word: 'шестьдеся́т де́вять' },
  { number: 70, word: 'се́мьдесят' },
  { number: 71, word: 'се́мьдесят оди́н' },
  { number: 72, word: 'се́мьдесят два́' },
  { number: 73, word: 'се́мьдесят три́' },
  { number: 74, word: 'се́мьдесят четы́ре' },
  { number: 75, word: 'се́мьдесят пя́ть' },
  { number: 76, word: 'се́мьдесят ше́сть' },
  { number: 77, word: 'се́мьдесят се́мь' },
  { number: 78, word: 'се́мьдесят во́семь' },
  { number: 79, word: 'се́мьдесят де́вять' },
  { number: 80, word: 'во́семьдесят' },
  { number: 81, word: 'во́семьдесят оди́н' },
  { number: 82, word: 'во́семьдесят два́' },
  { number: 83, word: 'во́семьдесят три́' },
  { number: 84, word: 'во́семьдесят четы́ре' },
  { number: 85, word: 'во́семьдесят пя́ть' },
  { number: 86, word: 'во́семьдесят ше́сть' },
  { number: 87, word: 'во́семьдесят се́мь' },
  { number: 88, word: 'во́семьдесят во́семь' },
  { number: 89, word: 'во́семьдесят де́вять' },
  { number: 90, word: 'девяно́сто' },
  { number: 91, word: 'девяно́сто оди́н' },
  { number: 92, word: 'девяно́сто два́' },
  { number: 93, word: 'девяно́сто три́' },
  { number: 94, word: 'девяно́сто четы́ре' },
  { number: 95, word: 'девяно́сто пя́ть' },
  { number: 96, word: 'девяно́сто ше́сть' },
  { number: 97, word: 'девяно́сто се́мь' },
  { number: 98, word: 'девяно́сто во́семь' },
  { number: 99, word: 'девяно́сто де́вять' },
  { number: 100, word: 'сто' },
]

const weekdays = [
  { word: 'понеде́льник', on: 'в понеде́льник', translation: '月曜日' },
  { word: 'вто́рник', on: 'во вто́рник', translation: '火曜日' },
  { word: 'среда́', on: 'в сре́ду', translation: '水曜日' },
  { word: 'четве́рг', on: 'в четве́рг', translation: '木曜日' },
  { word: 'пя́тница', on: 'в пя́тницу', translation: '金曜日' },
  { word: 'суббо́та', on: 'в суббо́ту', translation: '土曜日' },
  { word: 'воскресе́нье', on: 'в воскресе́нье', translation: '日曜日' },
]

const dayParts = [
  { word: 'у́тро', form: 'у́тром', translation: '朝に・朝は', example: 'У́тром я пью́ ко́фе.', exampleTranslation: '朝、私はコーヒーを飲みます。' },
  { word: 'де́нь', form: 'днём', translation: '昼に・昼は', example: 'Днём я рабо́таю.', exampleTranslation: '昼、私は働きます。' },
  { word: 'ве́чер', form: 'ве́чером', translation: '夕方・夜に', example: 'Ве́чером мы чита́ем.', exampleTranslation: '夕方、私たちは読書をします。' },
  { word: 'но́чь', form: 'но́чью', translation: '夜に・夜は', example: 'Но́чью я сплю́.', exampleTranslation: '夜、私は寝ます。' },
]

const relativeDays = [
  { word: 'сего́дня', translation: '今日', example: 'Сего́дня понеде́льник.', exampleTranslation: '今日は月曜日です。' },
  { word: 'вчера́', translation: '昨日', example: 'Вчера́ бы́л дождь.', exampleTranslation: '昨日は雨でした。' },
  { word: 'за́втра', translation: '明日', example: 'За́втра я рабо́таю.', exampleTranslation: '明日、私は働きます。' },
  { word: 'послеза́втра', translation: '明後日', example: 'Послеза́втра мы отдыха́ем.', exampleTranslation: '明後日、私たちは休みます。' },
  { word: 'че́рез два́ дня́', translation: '2日後（明後日）', example: 'Че́рез два́ дня́ бу́дет экза́мен.', exampleTranslation: '2日後に試験があります。' },
  { word: 'че́рез три́ дня́', translation: '3日後（明明後日）', example: 'Че́рез три́ дня́ я уезжа́ю.', exampleTranslation: '3日後、私は出発します。' },
]

const months = [
  { word: 'янва́рь', inMonth: 'в январе́', translation: '1月' },
  { word: 'февра́ль', inMonth: 'в феврале́', translation: '2月' },
  { word: 'март', inMonth: 'в ма́рте', translation: '3月' },
  { word: 'апре́ль', inMonth: 'в апре́ле', translation: '4月' },
  { word: 'ма́й', inMonth: 'в ма́е', translation: '5月' },
  { word: 'ию́нь', inMonth: 'в ию́не', translation: '6月' },
  { word: 'ию́ль', inMonth: 'в ию́ле', translation: '7月' },
  { word: 'а́вгуст', inMonth: 'в а́вгусте', translation: '8月' },
  { word: 'сентя́брь', inMonth: 'в сентябре́', translation: '9月' },
  { word: 'октя́брь', inMonth: 'в октябре́', translation: '10月' },
  { word: 'ноя́брь', inMonth: 'в ноябре́', translation: '11月' },
  { word: 'дека́брь', inMonth: 'в декабре́', translation: '12月' },
]

</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-5xl">
      <NuxtLink to="/" class="mb-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
        ← トップへ戻る
      </NuxtLink>

      <header class="mb-8">
        <p class="mb-2 text-xs font-black tracking-[0.16em] text-indigo-600 uppercase">Reference</p>
        <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-5xl">4級重要表現まとめ</h1>
        <p class="m-0 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          問題演習の途中で確認したくなる表現を、年齢・季節・頻度・重要構文に分けて整理しています。ロシア語文法を一通り学習した人の復習用です。
        </p>
      </header>

      <details class="group mb-5 rounded-3xl border border-sky-200 bg-sky-50">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 text-xl font-black transition hover:bg-sky-100 sm:p-6 [&::-webkit-details-marker]:hidden">
          <span>数字 1〜100</span>
          <span class="grid size-9 place-items-center rounded-full bg-white text-lg text-sky-700 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
        </summary>
        <div class="border-t border-sky-100 px-5 pt-5 pb-6 sm:px-6">
          <div class="mb-4">
            <h3 class="mb-3 text-lg font-black">1〜10</h3>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <div v-for="item in numberWords.slice(0, 10)" :key="item.number" class="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-3 py-2">
                <span class="grid size-7 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-black text-sky-700">{{ item.number }}</span>
                <div class="flex min-w-0 flex-1 items-center justify-between gap-1">
                  <strong class="text-base" style="font-family: 'PT Serif', Georgia, serif">{{ item.word }}</strong>
                  <button
                    type="button"
                    class="grid size-8 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-sm transition hover:bg-sky-100 disabled:opacity-40"
                    :disabled="!speechSupported"
                    :aria-label="item.word + 'を読み上げ'"
                    @click="speak(item.word)"
                  >🔊</button>
                </div>
              </div>
            </div>
          </div>

          <details class="group rounded-2xl border border-sky-200 bg-white">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-black text-sky-800 transition hover:bg-sky-50 [&::-webkit-details-marker]:hidden">
              <span>11〜100を表示</span>
              <span class="text-sm" aria-hidden="true">＋</span>
            </summary>
            <div class="border-t border-sky-100 p-4">
              <div class="grid gap-2">
                <div v-for="item in numberWords.slice(10)" :key="item.number" class="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2">
                  <span class="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xs font-black text-sky-700">{{ item.number }}</span>
                  <strong class="flex-1 text-base" style="font-family: 'PT Serif', Georgia, serif">{{ item.word }}</strong>
                  <button
                    type="button"
                    class="grid size-8 shrink-0 place-items-center rounded-full border border-sky-200 bg-white text-sm transition hover:bg-sky-100 disabled:opacity-40"
                    :disabled="!speechSupported"
                    :aria-label="item.word + 'を読み上げ'"
                    @click="speak(item.word)"
                  >🔊</button>
                </div>
              </div>
            </div>
          </details>

          <p class="mt-4 mb-0 text-sm font-bold leading-6 text-slate-700">
            21以上は「十の位 + 一の位」の順で、間に空白を入れる。年齢では 21歳が два́дцать оди́н год、22歳が два́дцать два́ го́да、25歳が два́дцать пя́ть лет になる。
          </p>
        </div>
      </details>


      <article class="mb-5 rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-7">
        <p class="mb-1 text-xs font-black tracking-[0.14em] text-violet-700 uppercase">Calendar & Time</p>
        <h2 class="mb-4 text-2xl font-black">曜日・時間帯・日付・月</h2>

        <div class="mb-5">
          <h3 class="mb-3 text-lg font-black">曜日</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="day in weekdays" :key="day.word" class="rounded-2xl border border-violet-100 bg-white p-4">
              <div class="flex items-center gap-2">
                <p class="m-0 flex-1 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ day.word }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="day.word + 'を読み上げ'"
                  @click="speak(day.word)"
                >🔊</button>
              </div>
              <div class="mt-1 mb-1 flex items-center gap-2">
                <p class="m-0 text-sm font-bold text-violet-700">{{ day.on }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="day.on + 'を読み上げ'"
                  @click="speak(day.on)"
                >🔊</button>
              </div>
              <p class="m-0 text-sm font-bold text-slate-600">{{ day.translation }}</p>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm font-bold leading-6 text-slate-700">「〜曜日に」は基本的に <span style="font-family: 'PT Serif', Georgia, serif">в + 対格</span>。вто́рник だけは <span style="font-family: 'PT Serif', Georgia, serif">во вто́рник</span> となる。</p>
        </div>

        <div class="mb-5 border-t border-violet-100 pt-5">
          <h3 class="mb-3 text-lg font-black">朝・昼・夕方・夜</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="part in dayParts" :key="part.word" class="rounded-2xl border border-violet-100 bg-white p-4">
              <div class="flex items-center gap-2">
                <p class="m-0 flex-1 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ part.word }} → {{ part.form }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  aria-label="時間帯の表現を読み上げ"
                  @click="speak(part.word + '. ' + part.form)"
                >🔊</button>
              </div>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">{{ part.translation }}</p>
              <div class="flex items-start gap-2">
                <p class="m-0 flex-1 text-sm font-bold leading-6" style="font-family: 'PT Serif', Georgia, serif">{{ part.example }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="part.example + 'を読み上げ'"
                  @click="speak(part.example)"
                >🔊</button>
              </div>
              <p class="mt-1 mb-0 text-xs font-bold leading-5 text-slate-500">{{ part.exampleTranslation }}</p>
            </div>
          </div>
        </div>

        <div class="mb-5 border-t border-violet-100 pt-5">
          <h3 class="mb-3 text-lg font-black">今日・昨日・明日</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="day in relativeDays" :key="day.word" class="rounded-2xl border border-violet-100 bg-white p-4">
              <div class="flex items-center gap-2">
                <p class="m-0 flex-1 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ day.word }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="day.word + 'を読み上げ'"
                  @click="speak(day.word)"
                >🔊</button>
              </div>
              <p class="mt-1 mb-1 text-sm font-bold text-violet-700">{{ day.translation }}</p>
              <div class="flex items-start gap-2">
                <p class="m-0 flex-1 text-sm font-bold leading-6" style="font-family: 'PT Serif', Georgia, serif">{{ day.example }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="day.example + 'を読み上げ'"
                  @click="speak(day.example)"
                >🔊</button>
              </div>
              <p class="mt-1 mb-0 text-xs font-bold leading-5 text-slate-500">{{ day.exampleTranslation }}</p>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm font-bold leading-6 text-slate-700">「明明後日」は日常的には一語で無理に言わず、<span style="font-family: 'PT Serif', Georgia, serif">че́рез три дня</span>（3日後）とするのが自然。</p>
        </div>

        <div class="border-t border-violet-100 pt-5">
          <h3 class="mb-3 text-lg font-black">月</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="month in months" :key="month.word" class="rounded-2xl border border-violet-100 bg-white p-4">
              <div class="flex items-center gap-2">
                <p class="m-0 flex-1 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ month.word }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="month.word + 'を読み上げ'"
                  @click="speak(month.word)"
                >🔊</button>
              </div>
              <p class="mt-1 mb-1 text-sm font-bold text-violet-700">{{ month.translation }}</p>
              <div class="flex items-center gap-2">
                <p class="m-0 flex-1 text-sm font-bold" style="font-family: 'PT Serif', Georgia, serif">{{ month.inMonth }}</p>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-white text-sm transition hover:bg-violet-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  :aria-label="month.inMonth + 'を読み上げ'"
                  @click="speak(month.inMonth)"
                >🔊</button>
              </div>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm font-bold leading-6 text-slate-700"><span style="font-family: 'PT Serif', Georgia, serif">в январе́</span> のように、月に「〜に」を付けるときは <span style="font-family: 'PT Serif', Georgia, serif">в + 前置格</span> を使う。</p>
        </div>
      </article>

      <div class="grid gap-5 lg:grid-cols-2">
        <article class="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 sm:p-7">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Age</p>
          <h2 class="mb-3 text-2xl font-black">年齢の表現</h2>
          <p class="mb-4 leading-7 text-slate-700">
            ロシア語では「私は〜歳です」を、年齢を主語にせず「私には〜年がある」に近い形で表します。
          </p>
          <div class="space-y-3">
            <div class="rounded-2xl border border-indigo-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Ско́лько тебе́ лет?</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">あなたは何歳ですか。</p>
            </div>
            <div class="rounded-2xl border border-indigo-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Мне два́дцать лет.</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">私は20歳です。</p>
            </div>
            <div class="rounded-2xl border border-indigo-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Ему́ два́дцать оди́н год. Ей два́дцать два́ го́да.</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">彼は21歳です。彼女は22歳です。</p>
            </div>
          </div>
          <p class="mt-4 mb-0 text-sm font-bold leading-6 text-slate-700">
            1（ただし11を除く）は год、2〜4（ただし12〜14を除く）は го́да、それ以外は лет。年齢の数字に応じて語尾が変わります。
          </p>
        </article>

        <article class="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-emerald-700 uppercase">Seasons & Time</p>
          <h2 class="mb-3 text-2xl font-black">季節・時期の表現</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-emerald-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">весна́ → весно́й</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">春 → 春に・春は</p>
            </div>
            <div class="rounded-2xl border border-emerald-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">ле́то → ле́том</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">夏 → 夏に・夏は</p>
            </div>
            <div class="rounded-2xl border border-emerald-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">о́сень → о́сенью</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">秋 → 秋に・秋は</p>
            </div>
            <div class="rounded-2xl border border-emerald-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">зима́ → зимо́й</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">冬 → 冬に・冬は</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 text-sm font-bold leading-6 text-slate-700">
            <p class="m-0"><span style="font-family: 'PT Serif', Georgia, serif">в э́том го́ду</span>：今年に・今年は ／ <span style="font-family: 'PT Serif', Georgia, serif">в про́шлом го́ду</span>：去年に・去年は</p>
            <p class="m-0"><span style="font-family: 'PT Serif', Georgia, serif">на э́той неде́ле</span>：今週に・今週は ／ <span style="font-family: 'PT Serif', Georgia, serif">в сле́дующем ме́сяце</span>：来月に・来月は</p>
          </div>
        </article>

        <article class="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">Frequency</p>
          <h2 class="mb-3 text-2xl font-black">頻度を表すことば</h2>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">всегда́</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">いつも・常に</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">обы́чно</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">ふつう・たいてい</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">ча́сто</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">よく・頻繁に</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">иногда́</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">ときどき</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">ре́дко</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">めったに〜ない・まれに</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">никогда́</p>
              <p class="mt-1 mb-0 text-sm font-bold text-slate-600">決して〜ない</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 text-sm font-bold leading-6 text-slate-700">
            <p class="m-0"><span style="font-family: 'PT Serif', Georgia, serif">ка́ждый де́нь</span>：毎日 ／ <span style="font-family: 'PT Serif', Georgia, serif">раз в неде́лю</span>：週に1回</p>
            <p class="m-0"><span style="font-family: 'PT Serif', Georgia, serif">два ра́за в ме́сяц</span>：月に2回 ／ <span style="font-family: 'PT Serif', Georgia, serif">по выходны́м</span>：週末に</p>
          </div>
        </article>

        <article class="rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-7 lg:col-span-2">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-rose-700 uppercase">Important Patterns</p>
          <h2 class="mb-4 text-2xl font-black">重要構文</h2>
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <div class="flex items-start gap-2">
                <div class="flex-1">
                  <p class="m-0 text-lg font-bold leading-7" style="font-family: 'PT Serif', Georgia, serif">Оди́н …, друго́й …</p>
                  <p class="mt-1 mb-1 text-sm font-bold leading-6" style="font-family: 'PT Serif', Georgia, serif">Оди́н студе́нт чита́ет, друго́й пи́шет.</p>
                </div>
                <button
                  type="button"
                  class="grid size-8 shrink-0 place-items-center rounded-full border border-rose-200 bg-white text-sm transition hover:bg-rose-100 disabled:opacity-40"
                  :disabled="!speechSupported"
                  aria-label="例文を読み上げ"
                  @click="speak('Оди́н студе́нт чита́ет, друго́й пи́шет.')"
                >🔊</button>
              </div>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">一方の学生は読んでいて、もう一人は書いています。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">оди́н …, друго́й … は、二つの人・物を対比して「一方は〜、他方は〜」と表す。女性なら одна́ …, друга́я …。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">У меня́ есть кни́га.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私は本を持っています。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">所有・存在。「У + 生格」で「〜のところに」を表す。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">У меня́ нет кни́ги.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私は本を持っていません。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">нет の後ろは生格。есть の否定で形が変わる。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Мне нра́вится ру́сский язы́к.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私はロシア語が好きです。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">「私に好ましい」という形。複数なら нра́вятся。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Мне ну́жно рабо́тать.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私は働く必要があります。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">мне ну́жно / мне на́до + 不定形で「〜する必要がある」。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Я хочу́ чита́ть.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私は読みたいです。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">хоте́ть + 不定形で「〜したい」。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Мне мо́жно войти́?</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">入ってもいいですか。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">мо́жно + 不定形で許可。「Нельзя́」なら禁止。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">У меня́ бо́лит голова́.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">頭が痛いです。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">身体の状態は「У меня́ бо́лит + 部位」で表せる。</p>
            </div>
            <div class="rounded-2xl border border-rose-100 bg-white p-4">
              <p class="m-0 text-lg font-bold" style="font-family: 'PT Serif', Georgia, serif">Я у́чусь, потому́ что хочу́ сда́ть экза́мен.</p>
              <p class="mt-1 mb-1 text-sm font-bold text-slate-600">私は試験に合格したいので、勉強しています。</p>
              <p class="m-0 text-xs font-bold leading-5 text-slate-500">потому́ что + 文で理由。「なぜなら〜だから」。</p>
            </div>
          </div>

        </article>
      </div>
    </section>
  </main>
</template>
