<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { questions } from '~/data/questions'
import { section1Questions } from '~/data/section1'
import { generatedSection1Questions } from '~/data/section1Extra'
import {
  getQuestionStatusCounts,
  questionStatusLabel,
  type QuestionStatus,
} from '~/utils/questionProgress'

const trainingItems = [
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
    description: '4級で押さえたい基本単語をテンポよく確認。',
    status: 'coming-soon',
  },
  {
    title: '総合',
    description: '分野を混ぜて、知識が定着しているか確認。',
    status: 'coming-soon',
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

const prepositionProgress = computed(() => {
  progressVersion.value
  const counts = getQuestionStatusCounts(questions.map((question) => question.id))
  return { counts, total: questions.length }
})

const section1Progress = computed(() => {
  progressVersion.value
  const counts = getQuestionStatusCounts(allSection1Questions.map((question) => question.id))
  return { counts, total: allSection1Questions.length }
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
          苦手分野をピンポイントで練習して、最後は本番形式へ。まずは分野別トレーニングから進めよう。
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

                  <div v-if="item.progressKey === 'prepositions'" class="mt-5 border-t border-indigo-100 pt-4">
                    <div class="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-600">
                      <span>学習状況</span>
                      <span>{{ prepositionProgress.total }}問</span>
                    </div>
                    <div
                      class="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
                      role="img"
                      :aria-label="`前置詞の学習状況。新規${prepositionProgress.counts.new}問、要復習${prepositionProgress.counts.review}問、練習中${prepositionProgress.counts.learning}問、定着${prepositionProgress.counts.mastered}問`"
                    >
                      <div
                        v-for="statusItem in statusItems"
                        :key="statusItem.status"
                        :class="statusItem.barClass"
                        :style="{ width: statusWidth(prepositionProgress.counts[statusItem.status], prepositionProgress.total) }"
                      />
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-bold text-slate-600">
                      <div v-for="statusItem in statusItems" :key="`prepositions-${statusItem.status}`" class="flex items-center gap-2">
                        <span class="size-2 shrink-0 rounded-full" :class="statusItem.dotClass" />
                        <span>{{ questionStatusLabel[statusItem.status] }}</span>
                        <strong class="ml-auto text-slate-900">{{ prepositionProgress.counts[statusItem.status] }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-5 text-sm font-black text-indigo-700">はじめる →</div>
              </NuxtLink>

              <article
                v-else
                class="flex min-h-40 flex-col justify-between rounded-3xl border border-slate-200 bg-slate-100/70 p-5 text-slate-500"
              >
                <div>
                  <div class="mb-4 inline-flex rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-black text-slate-500">準備中</div>
                  <h3 class="mb-2 text-xl font-black text-slate-700">{{ item.title }}</h3>
                  <p class="m-0 leading-6">{{ item.description }}</p>
                </div>
              </article>
            </template>
          </div>
        </div>
      </details>

      <section class="mb-8 sm:mb-10">
        <div class="mb-5">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">Exam Sections</p>
          <h2 class="m-0 text-2xl font-black">大問別問題集</h2>
        </div>

        <NuxtLink
          to="/sections/1"
          class="group block rounded-3xl border border-sky-200 bg-sky-50 p-6 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100 sm:p-7"
        >
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 flex-1">
              <div class="mb-3 inline-flex rounded-full bg-sky-700 px-2.5 py-1 text-xs font-black text-white">学習可能</div>
              <h3 class="mb-2 text-xl font-black text-slate-900">第I問・発音</h3>
              <p class="m-0 max-w-2xl leading-7 text-slate-600">
                下線部の発音が他の3語と異なる単語を選ぶ4択問題。100問プールから習熟度を考慮して10問を出題する。
              </p>

              <div class="mt-5 max-w-2xl border-t border-sky-200 pt-4">
                <div class="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-600">
                  <span>学習状況</span>
                  <span>{{ section1Progress.total }}問</span>
                </div>
                <div
                  class="flex h-3 w-full overflow-hidden rounded-full bg-white"
                  role="img"
                  :aria-label="`第I問・発音の学習状況。新規${section1Progress.counts.new}問、要復習${section1Progress.counts.review}問、練習中${section1Progress.counts.learning}問、定着${section1Progress.counts.mastered}問`"
                >
                  <div
                    v-for="statusItem in statusItems"
                    :key="statusItem.status"
                    :class="statusItem.barClass"
                    :style="{ width: statusWidth(section1Progress.counts[statusItem.status], section1Progress.total) }"
                  />
                </div>
                <div class="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-xs font-bold text-slate-600 sm:grid-cols-4">
                  <div v-for="statusItem in statusItems" :key="`section1-${statusItem.status}`" class="flex items-center gap-2">
                    <span class="size-2 shrink-0 rounded-full" :class="statusItem.dotClass" />
                    <span>{{ questionStatusLabel[statusItem.status] }}</span>
                    <strong class="ml-auto text-slate-900">{{ section1Progress.counts[statusItem.status] }}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="shrink-0 rounded-2xl border border-sky-300 bg-white px-4 py-3 text-sm font-black text-sky-800 transition group-hover:bg-sky-700 group-hover:text-white">10問 はじめる →</div>
          </div>
        </NuxtLink>
      </section>

      <section>
        <div class="mb-5">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">Mock Exam</p>
          <h2 class="m-0 text-2xl font-black">模擬試験</h2>
        </div>

        <article class="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-7">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="mb-3 inline-flex rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-black text-amber-800">準備中</div>
              <h3 class="mb-2 text-xl font-black text-slate-900">最後は通しで実力チェック</h3>
              <p class="m-0 max-w-2xl leading-7 text-slate-600">
                複数分野をまとめて解く本番想定モード。大問別問題集に慣れてから挑戦する仕上げ用。
              </p>
            </div>
            <div class="shrink-0 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-black text-amber-900">COMING SOON</div>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>
