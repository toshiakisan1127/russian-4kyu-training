<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type AnthemLine = {
  stressed: string
  japanese: string
}

type AnthemPart = {
  label: string
  kind: 'verse' | 'chorus'
  lines: AnthemLine[]
}

type VocabularyItem = {
  word: string
  meaning: string
  note?: string
}

const chorus: AnthemLine[] = [
  { stressed: 'Сла́вься, Оте́чество на́ше свобо́дное,', japanese: '栄えあれ、自由なるわれらの祖国よ、' },
  { stressed: 'Бра́тских наро́дов сою́з веково́й,', japanese: '兄弟なる諸民族の、悠久の連合よ。' },
  { stressed: 'Предка́ми да́нная му́дрость наро́дная!', japanese: '祖先から授かった民の英知よ。' },
  { stressed: 'Сла́вься, страна́! Мы горди́мся тобо́й!', japanese: '栄えあれ、祖国よ！ 私たちはあなたを誇りに思う。' },
]

const anthemParts: AnthemPart[] = [
  {
    label: '1番',
    kind: 'verse',
    lines: [
      { stressed: 'Росси́я — свяще́нная на́ша держа́ва,', japanese: 'ロシア――われらの聖なる大国、' },
      { stressed: 'Росси́я — люби́мая на́ша страна́.', japanese: 'ロシア――われらの愛する国。' },
      { stressed: 'Могу́чая во́ля, вели́кая сла́ва —', japanese: '力強い意志、偉大な栄光――' },
      { stressed: 'Твоё достоя́нье на все времена́!', japanese: 'それはいつの時代も、あなたの財産だ。' },
    ],
  },
  { label: 'サビ', kind: 'chorus', lines: chorus },
  {
    label: '2番',
    kind: 'verse',
    lines: [
      { stressed: 'От ю́жных море́й до поля́рного кра́я', japanese: '南の海から極地の果てまで、' },
      { stressed: 'Раски́нулись на́ши леса́ и поля́.', japanese: '私たちの森と野は広がっている。' },
      { stressed: 'Одна́ ты на све́те! Одна́ ты така́я —', japanese: '世界にただひとつ！ あなただけがそのような国――' },
      { stressed: 'Храни́мая Бо́гом родна́я земля́!', japanese: '神に守られた、ふるさとの大地。' },
    ],
  },
  { label: 'サビ', kind: 'chorus', lines: chorus },
  {
    label: '3番',
    kind: 'verse',
    lines: [
      { stressed: 'Широ́кий просто́р для мечты́ и для жи́зни', japanese: '夢と人生のための広大な空間を、' },
      { stressed: 'Гряду́щие нам открыва́ют года́.', japanese: '来たる年月が私たちに開いてくれる。' },
      { stressed: 'Нам си́лу даёт на́ша ве́рность Отчи́зне.', japanese: '祖国への忠誠が、私たちに力を与える。' },
      { stressed: 'Так бы́ло, так есть и так бу́дет всегда́!', japanese: 'そうだった。そうである。そしてこれからも永遠にそうだ。' },
    ],
  },
  { label: 'サビ', kind: 'chorus', lines: chorus },
]

const vocabulary: VocabularyItem[] = [
  { word: 'свяще́нный', meaning: '神聖な' },
  { word: 'держа́ва', meaning: '大国、国家', note: 'やや格調高い語' },
  { word: 'люби́мый', meaning: '愛する、愛されている' },
  { word: 'могу́чий', meaning: '力強い、強大な' },
  { word: 'во́ля', meaning: '意志、自由' },
  { word: 'вели́кий', meaning: '偉大な' },
  { word: 'сла́ва', meaning: '栄光、名声' },
  { word: 'достоя́ние', meaning: '財産、遺産' },
  { word: 'времена́', meaning: '時代、時々', note: 'вре́мя の複数形' },
  { word: 'сла́виться', meaning: '名高い、称えられる', note: 'Сла́вься! = 「栄えあれ！」' },
  { word: 'Оте́чество', meaning: '祖国' },
  { word: 'свобо́дный', meaning: '自由な' },
  { word: 'бра́тский', meaning: '兄弟の、兄弟的な' },
  { word: 'наро́д', meaning: '民族、国民、人々' },
  { word: 'сою́з', meaning: '連合、同盟' },
  { word: 'веково́й', meaning: '幾世紀にもわたる、悠久の' },
  { word: 'пре́док', meaning: '祖先' },
  { word: 'да́нный', meaning: '与えられた' },
  { word: 'му́дрость', meaning: '知恵、英知' },
  { word: 'горди́ться', meaning: '誇りに思う', note: '+ 造格（кем? чем?）' },
  { word: 'ю́жный', meaning: '南の' },
  { word: 'мо́ре', meaning: '海' },
  { word: 'поля́рный', meaning: '極地の、極の' },
  { word: 'край', meaning: '端、地方、地域' },
  { word: 'раски́нуться', meaning: '広がる、広々と展開する' },
  { word: 'лес', meaning: '森' },
  { word: 'по́ле', meaning: '野原、畑' },
  { word: 'свет', meaning: '世界、世の中', note: 'на све́те = 「世界で」' },
  { word: 'тако́й', meaning: 'そのような' },
  { word: 'храни́ть', meaning: '守る、保管する' },
  { word: 'Бог', meaning: '神' },
  { word: 'родно́й', meaning: '故郷の、親しい、生まれ育った' },
  { word: 'земля́', meaning: '大地、土地、地球' },
  { word: 'широ́кий', meaning: '広い' },
  { word: 'просто́р', meaning: '広々とした空間' },
  { word: 'мечта́', meaning: '夢' },
  { word: 'жизнь', meaning: '人生、生活、生命' },
  { word: 'гряду́щий', meaning: '来たる、未来の' },
  { word: 'открыва́ть', meaning: '開く、開ける' },
  { word: 'си́ла', meaning: '力' },
  { word: 'дава́ть', meaning: '与える' },
  { word: 'ве́рность', meaning: '忠誠、忠実さ' },
  { word: 'Отчи́зна', meaning: '祖国', note: '格調高い語。Оте́чество と近い' },
  { word: 'всегда́', meaning: 'いつも、常に' },
]

const grammarPhrases = [
  { russian: 'на все времена́', japanese: 'いつの時代も／永遠に', point: 'на + 対格' },
  { russian: 'Сла́вься!', japanese: '栄えあれ！', point: 'сла́виться の命令形' },
  { russian: 'горди́ться тобо́й', japanese: 'あなたを誇りに思う', point: 'горди́ться + 造格' },
  { russian: 'от море́й до кра́я', japanese: '海から果てまで', point: 'от + 生格 / до + 生格' },
  { russian: 'для мечты́ и для жи́зни', japanese: '夢と人生のために', point: 'для + 生格' },
  { russian: 'нам си́лу даёт', japanese: '私たちに力を与える', point: 'нам = мы の与格' },
]

const showStress = ref(true)
const showTranslation = ref(true)
const speechSupported = ref(false)

const stripStress = (value: string) => value.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')
const displayedLine = (line: AnthemLine) => showStress.value ? line.stressed : stripStress(line.stressed)
const speechText = computed(() => anthemParts.flatMap((part) => part.lines).map((line) => stripStress(line.stressed)).join(' '))

onMounted(() => {
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
})

onUnmounted(() => {
  window.speechSynthesis?.cancel()
})

const speakAnthem = () => {
  if (!speechSupported.value) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(speechText.value)
  utterance.lang = 'ru-RU'
  utterance.rate = Number(window.localStorage.getItem('russian-speech-rate') ?? '0.4')
  utterance.pitch = 1

  const russianVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith('ru'))
  if (russianVoice) utterance.voice = russianVoice

  window.speechSynthesis.speak(utterance)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <div class="mx-auto w-full max-w-5xl">
      <header class="mb-8 overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-xl shadow-rose-100/60">
        <div class="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div class="p-6 sm:p-9">
            <div class="mb-4 flex flex-wrap gap-2">
              <span class="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800">🎁 BONUS</span>
              <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">4級には出ない。たぶん。</span>
            </div>
            <p class="mb-2 text-xs font-black tracking-[0.16em] text-rose-700 uppercase">Russian Anthem</p>
            <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-5xl">ロシア国歌で遊ぶ</h1>
            <p class="m-0 max-w-2xl leading-7 text-slate-600">
              試験対策ではありません。たぶん。でも、歌詞を読めると知っている単語や文法が意外と見つかる。アクセント・日本語訳・単語集つきで、気楽に眺めよう。
            </p>
          </div>
          <div class="flex min-h-48 items-center justify-center bg-gradient-to-br from-sky-100 via-white to-rose-100 p-8 text-center">
            <div>
              <div class="mb-3 text-6xl" aria-hidden="true">🎤</div>
              <p class="m-0 text-sm font-black leading-6 text-slate-700">カラオケで歌えたら<br>ちょっと勝ち</p>
            </div>
          </div>
        </div>
      </header>

      <section class="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="anthem-heading">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Lyrics</p>
            <h2 id="anthem-heading" class="m-0 text-2xl font-black sm:text-3xl">Государственный гимн Российской Федерации</h2>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100"
              :aria-pressed="showStress"
              @click="showStress = !showStress"
            >
              {{ showStress ? 'アクセントを隠す' : 'アクセントを表示' }}
            </button>
            <button
              type="button"
              class="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-100"
              :aria-pressed="showTranslation"
              @click="showTranslation = !showTranslation"
            >
              {{ showTranslation ? '日本語訳を隠す' : '日本語訳を表示' }}
            </button>
            <button
              type="button"
              class="min-h-11 rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!speechSupported"
              @click="speakAnthem"
            >
              🔊 朗読する
            </button>
          </div>
        </div>

        <div class="space-y-5">
          <article
            v-for="(part, partIndex) in anthemParts"
            :key="`${part.label}-${partIndex}`"
            class="rounded-2xl border p-5 sm:p-6"
            :class="part.kind === 'chorus' ? 'border-rose-200 bg-rose-50' : 'border-sky-100 bg-sky-50/60'"
          >
            <div class="mb-4 flex items-center gap-2">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-black"
                :class="part.kind === 'chorus' ? 'bg-rose-600 text-white' : 'bg-sky-700 text-white'"
              >
                {{ part.label }}
              </span>
              <span v-if="part.kind === 'chorus'" class="text-xs font-black text-rose-700">ここは3回くる</span>
            </div>

            <div class="space-y-4">
              <div v-for="line in part.lines" :key="line.stressed">
                <p class="m-0 text-lg font-black leading-8 text-slate-950 sm:text-xl">{{ displayedLine(line) }}</p>
                <p v-if="showTranslation" class="mt-1 mb-0 text-sm font-medium leading-6 text-slate-600 sm:text-base">{{ line.japanese }}</p>
              </div>
            </div>
          </article>
        </div>

        <p class="mt-5 mb-0 text-xs leading-5 text-slate-500">
          歌詞はロシア連邦の「ロシア連邦国歌に関する連邦憲法法律」付録2の公式テキストに基づいています。日本語訳は学習用の自然な訳です。
        </p>
      </section>

      <section class="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7" aria-labelledby="phrases-heading">
        <div class="mb-5">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-800 uppercase">Grammar Loot</p>
          <h2 id="phrases-heading" class="m-0 text-2xl font-black">国歌から拾える4級っぽい表現</h2>
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <article v-for="phrase in grammarPhrases" :key="phrase.russian" class="rounded-2xl border border-amber-200 bg-white p-4">
            <p class="m-0 text-lg font-black">{{ phrase.russian }}</p>
            <p class="mt-1 mb-2 font-bold text-slate-700">{{ phrase.japanese }}</p>
            <span class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900">{{ phrase.point }}</span>
          </article>
        </div>
      </section>

      <section class="rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="vocabulary-heading">
        <div class="mb-6">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-700 uppercase">Vocabulary</p>
          <h2 id="vocabulary-heading" class="m-0 text-2xl font-black sm:text-3xl">単語集</h2>
          <p class="mt-2 mb-0 text-sm leading-6 text-slate-600">歌詞に出てくる内容語を中心に、辞書形でまとめた。国歌語彙なので、ちょい硬めの単語も混ざる。</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="item in vocabulary" :key="item.word" class="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <p class="m-0 text-lg font-black text-indigo-950">{{ item.word }}</p>
            <p class="mt-1 mb-0 font-bold text-slate-700">{{ item.meaning }}</p>
            <p v-if="item.note" class="mt-2 mb-0 text-xs font-bold leading-5 text-indigo-700">{{ item.note }}</p>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>
