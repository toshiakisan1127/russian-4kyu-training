<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { questions } from '~/data/questions'
import { section1Questions } from '~/data/section1'
import { generatedSection1Questions } from '~/data/section1Extra'
import { section2Questions } from '~/data/section2'
import { section3Questions } from '~/data/section3'
import { section4Questions } from '~/data/section4'
import { section5Questions } from '~/data/section5'
import { section6Questions } from '~/data/section6'
import { section7Questions } from '~/data/section7'
import { section8Questions } from '~/data/section8'
import { vocabularyItems } from '~/data/vocabulary'
import {
  getQuestionStatusCounts,
  questionStatusLabel,
  type QuestionStatus,
} from '~/utils/questionProgress'

type TrainingProgressKey = 'prepositions' | 'vocabulary'
type ExamProgressKey = 'section1' | 'section2' | 'section3' | 'section4' | 'section5' | 'section6' | 'section7' | 'section8'

type TrainingItem = {
  title: string
  description: string
  status: 'available' | 'coming-soon'
  to?: string
  progressKey?: TrainingProgressKey
}

type ExamItem = {
  roman: string
  title: string
  description: string
  status: 'available' | 'coming-soon'
  to?: string
  progressKey?: ExamProgressKey
}

type TranslationItem = {
  title: string
  description: string
}

const trainingItems: TrainingItem[] = [
  {
    title: '前置詞',
    description: 'в / на / из / с / к など、場所や方向を表す前置詞を練習。',
    to: '/prepositions',
    status: 'available',
    progressKey: 'prepositions',
  },
  {
    title: '格変化',
    description: '生格・与格・対格・前置格など、語尾変化を重点的に練習。',
    status: 'coming-soon',
  },
  {
    title: '動詞',
    description: '現在形の活用や基本動詞の使い分けを練習。',
    status: 'coming-soon',
  },
  {
    title: '語彙',
    description: '4級向けの基本語彙550語から、習熟度を考慮して毎回10語を出題。',
    to: '/vocabulary',
    status: 'available',
    progressKey: 'vocabulary',
  },
  {
    title: '総合',
    description: '分野を混ぜて、知識が定着しているか確認。',
    status: 'coming-soon',
  },
]

const examItems: ExamItem[] = [
  {
    roman: 'I',
    title: '発音',
    description: '下線部の発音が他の3語と異なる単語を選ぶ。',
    status: 'available',
    to: '/sections/1',
    progressKey: 'section1',
  },
  {
    roman: 'II',
    title: 'アクセント',
    description: 'アクセント位置が他の3語と異なる単語を選ぶ。',
    status: 'available',
    to: '/sections/2',
    progressKey: 'section2',
  },
  {
    roman: 'III',
    title: '名詞の性・代名詞',
    description: '名詞の性・数に合う он / она / оно / они を選ぶ。',
    status: 'available',
    to: '/sections/3',
    progressKey: 'section3',
  },
  {
    roman: 'IV',
    title: '名詞の複数形',
    description: '名詞を主格複数形に直し、アクセントも確認する。',
    status: 'available',
    to: '/sections/4',
    progressKey: 'section4',
  },
  {
    roman: 'V',
    title: '格変化',
    description: '文脈や格支配に合う名詞・形容詞などの格変化を選ぶ。',
    status: 'available',
    to: '/sections/5',
    progressKey: 'section5',
  },
  {
    roman: 'VI',
    title: '疑問文への応答',
    description: '疑問詞と文意に合う自然な応答を選ぶ。',
    status: 'available',
    to: '/sections/6',
    progressKey: 'section6',
  },
  {
    roman: 'VII',
    title: '動詞の人称変化',
    description: '主語に合わせて指定された動詞を正しく人称変化させる。',
    status: 'available',
    to: '/sections/7',
    progressKey: 'section7',
  },
  {
    roman: 'VIII',
    title: '過去形・未来形',
    description: '指定された文を過去形または未来形へ書き換える。',
    status: 'available',
    to: '/sections/8',
    progressKey: 'section8',
  },
]

const translationItems: TranslationItem[] = [
  {
    title: '露文和訳',
    description: '4級レベルの短いロシア語文を読み、日本語に訳す。',
  },
  {
    title: '和文露訳',
    description: '4級の基本語彙・文法を使って、日本語文をロシア語に訳す。',
  },
]

const allSection1Questions = [...section1Questions, ...generatedSection1Questions]
const progressVersion = ref(0)

const statusItems: { status: QuestionStatus; barClass: string; dotClass: string }[] = [
  { status: 'new', barClass: 'bg-sky-400', dotClass: 'bg-sky-400' },
  { status: 'review', barClass: 'bg-amber-400', dotClass: 'bg-amber-400' },
  { status: 'learning', barClass: 'bg-violet-500', dotClass: 'bg-violet-500' },
  { status: 'mastered', barClass: 'bg-emerald-500', dotClass: 'bg-emerald-500' },
]

onMounted(() => {
  progressVersion.value += 1
})

const trainingProgress = computed(() => {
  progressVersion.value

  return {
    prepositions: {
      counts: getQuestionStatusCounts(questions.map((question) => question.id)),
      total: questions.length,
    },
    vocabulary: {
      counts: getQuestionStatusCounts(vocabularyItems.map((item) => item.id)),
      total: vocabularyItems.length,
    },
  }
})

const examProgress = computed(() => {
  progressVersion.value

  return {
    section1: {
      counts: getQuestionStatusCounts(allSection1Questions.map((question) => question.id)),
      total: allSection1Questions.length,
    },
    section2: {
      counts: getQuestionStatusCounts(section2Questions.map((question) => question.id)),
      total: section2Questions.length,
    },
    section3: {
      counts: getQuestionStatusCounts(section3Questions.map((question) => question.id)),
      total: section3Questions.length,
    },
    section4: {
      counts: getQuestionStatusCounts(section4Questions.map((question) => question.id)),
      total: section4Questions.length,
    },
    section5: {
      counts: getQuestionStatusCounts(section5Questions.map((question) => question.id)),
      total: section5Questions.length,
    },
    section6: {
      counts: getQuestionStatusCounts(section6Questions.map((question) => question.id)),
      total: section6Questions.length,
    },
    section7: {
      counts: getQuestionStatusCounts(section7Questions.map((question) => question.id)),
      total: section7Questions.length,
    },
    section8: {
      counts: getQuestionStatusCounts(section8Questions.map((question) => question.id)),
      total: section8Questions.length,
    },
  }
})

const statusWidth = (count: number, total: number) => total > 0 ? `${(count / total) * 100}%` : '0%'
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:py-14">
    <div class="mx-auto w-full max-w-5xl">
      <header class="mb-8 sm:mb-10">
        <p class="mb-2 text-xs font-black tracking-[0.16em] text-indigo-600 uppercase">Russian 4th Grade Training</p>
        <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-5xl">ロシア語4級トレーニング</h1>
        <p class="m-0 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          苦手分野をピンポイントで練習して、最後は本番形式へ。習熟度を見ながら少しずつ定着させよう。
        </p>
      </header>

      <details class="group mb-8 rounded-3xl border border-indigo-200 bg-white shadow-sm shadow-indigo-100 sm:mb-10">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 transition hover:bg-indigo-50 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Training</p>
            <h2 class="mb-1 text-xl font-black sm:text-2xl">分野別トレーニング</h2>
            <p class="m-0 text-sm font-medium text-slate-500">苦手なテーマを選んで個別に練習</p>
          </div>
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-xl font-black text-indigo-700 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
        </summary>

        <div class="border-t border-indigo-100 px-5 pt-5 pb-6 sm:px-6">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <template v-for="item in trainingItems" :key="item.title">
              <NuxtLink
                v-if="item.status === 'available'"
                :to="item.to"
                class="group/item flex min-h-40 flex-col justify-between rounded-3xl border border-indigo-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100"
              >
                <div>
                  <div class="mb-4 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">学習可能</div>
                  <h3 class="mb-2 text-xl font-black">{{ item.title }}</h3>
                  <p class="m-0 leading-6 text-slate-600">{{ item.description }}</p>

                  <div v-if="item.progressKey" class="mt-5 border-t border-indigo-100 pt-4">
                    <div class="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-600">
                      <span>学習状況</span>
                      <span>{{ trainingProgress[item.progressKey].total }}問</span>
                    </div>
                    <div class="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        v-for="statusItem in statusItems"
                        :key="statusItem.status"
                        :class="statusItem.barClass"
                        :style="{ width: statusWidth(trainingProgress[item.progressKey].counts[statusItem.status], trainingProgress[item.progressKey].total) }"
                      />
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-bold text-slate-600">
                      <div v-for="statusItem in statusItems" :key="`${item.progressKey}-${statusItem.status}`" class="flex items-center gap-2">
                        <span class="size-2 shrink-0 rounded-full" :class="statusItem.dotClass" />
                        <span>{{ questionStatusLabel[statusItem.status] }}</span>
                        <strong class="ml-auto text-slate-900">{{ trainingProgress[item.progressKey].counts[statusItem.status] }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 text-sm font-black text-indigo-700">はじめる →</div>
              </NuxtLink>

              <article v-else class="flex min-h-40 flex-col justify-between rounded-3xl border border-slate-200 bg-slate-100/70 p-5 text-slate-500">
                <div>
                  <div class="mb-4 inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-black text-slate-500">COMING SOON</div>
                  <h3 class="mb-2 text-xl font-black text-slate-700">{{ item.title }}</h3>
                  <p class="m-0 leading-6">{{ item.description }}</p>
                </div>
              </article>
            </template>
          </div>
        </div>
      </details>

      <details class="group mb-8 rounded-3xl border border-sky-200 bg-white shadow-sm shadow-sky-100 sm:mb-10">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-5 transition hover:bg-sky-50 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div>
            <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Exam Sections</p>
            <h2 class="mb-1 text-xl font-black sm:text-2xl">大問別問題集</h2>
            <p class="m-0 text-sm font-medium text-slate-500">第I問〜第VIII問と翻訳問題を順番に攻略</p>
          </div>
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-sky-100 text-xl font-black text-sky-800 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
        </summary>

        <div class="border-t border-sky-100 px-5 pt-5 pb-6 sm:px-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <template v-for="item in examItems" :key="item.roman">
              <NuxtLink
                v-if="item.status === 'available' && item.progressKey"
                :to="item.to"
                class="group/item flex flex-col rounded-3xl border border-sky-200 bg-sky-50 p-5 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100"
              >
                <div class="mb-3 flex items-center justify-between gap-3">
                  <span class="rounded-full bg-sky-700 px-2.5 py-1 text-xs font-black text-white">学習可能</span>
                  <span class="text-xs font-black text-sky-800">{{ examProgress[item.progressKey].total }}問</span>
                </div>
                <h3 class="mb-2 text-xl font-black text-slate-900">第{{ item.roman }}問・{{ item.title }}</h3>
                <p class="m-0 leading-6 text-slate-600">{{ item.description }}</p>

                <div class="mt-5 border-t border-sky-200 pt-4">
                  <div class="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-600">
                    <span>学習状況</span>
                    <span>{{ examProgress[item.progressKey].total }}問</span>
                  </div>
                  <div class="flex h-3 w-full overflow-hidden rounded-full bg-white">
                    <div
                      v-for="statusItem in statusItems"
                      :key="statusItem.status"
                      :class="statusItem.barClass"
                      :style="{ width: statusWidth(examProgress[item.progressKey].counts[statusItem.status], examProgress[item.progressKey].total) }"
                    />
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-bold text-slate-600">
                    <div v-for="statusItem in statusItems" :key="`${item.roman}-${statusItem.status}`" class="flex items-center gap-2">
                      <span class="size-2 shrink-0 rounded-full" :class="statusItem.dotClass" />
                      <span>{{ questionStatusLabel[statusItem.status] }}</span>
                      <strong class="ml-auto text-slate-900">{{ examProgress[item.progressKey].counts[statusItem.status] }}</strong>
                    </div>
                  </div>
                </div>

                <div class="mt-5 text-sm font-black text-sky-800">10問 はじめる →</div>
              </NuxtLink>

              <article v-else class="rounded-3xl border border-slate-200 bg-slate-100/70 p-5 text-slate-500">
                <div class="mb-3 inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-black text-slate-500">COMING SOON</div>
                <h3 class="mb-2 text-xl font-black text-slate-700">第{{ item.roman }}問・{{ item.title }}</h3>
                <p class="m-0 leading-6">{{ item.description }}</p>
              </article>
            </template>

            <article
              v-for="item in translationItems"
              :key="item.title"
              class="rounded-3xl border border-slate-200 bg-slate-100/70 p-5 text-slate-500"
            >
              <div class="mb-3 inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-black text-slate-500">COMING SOON</div>
              <h3 class="mb-2 text-xl font-black text-slate-700">{{ item.title }}</h3>
              <p class="m-0 leading-6">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </details>

      <section>
        <div class="mb-5">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">Mock Exam</p>
          <h2 class="m-0 text-2xl font-black">模擬試験</h2>
        </div>

        <article class="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-7">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="mb-3 inline-flex rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-black text-amber-800">COMING SOON</div>
              <h3 class="mb-2 text-xl font-black text-slate-900">最後は通しで実力チェック</h3>
              <p class="m-0 max-w-2xl leading-7 text-slate-600">複数分野をまとめて解く本番想定モード。大問別問題集に慣れてから挑戦する仕上げ用。</p>
            </div>
            <div class="shrink-0 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-black text-amber-900">COMING SOON</div>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>