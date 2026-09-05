<script setup lang="ts">
import { computed } from 'vue'

type BreadcrumbItem = {
  label: string
  to?: string
}

const route = useRoute()

const sectionLabels: Record<string, string> = {
  '1': '第I問・発音',
  '2': '第II問・アクセント',
  '3': '第III問・名詞の性・代名詞',
  '4': '第IV問・名詞の複数形',
  '5': '第V問・格変化',
  '6': '第VI問・疑問文への応答',
  '7': '第VII問・動詞の人称変化',
  '8': '第VIII問・過去形と未来形',
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const home: BreadcrumbItem = { label: 'ホーム', to: '/' }

  if (route.path === '/') return []

  if (route.path === '/about') {
    return [home, { label: 'このサイトについて' }]
  }

  if (route.path === '/reference') {
    return [home, { label: '4級重要表現まとめ' }]
  }

  if (route.path === '/reading') {
    return [home, { label: '朗読対策' }]
  }

  if (route.path === '/mock') {
    return [home, { label: '模擬試験' }]
  }

  if (route.path === '/prepositions') {
    return [home, { label: '分野別トレーニング', to: '/' }, { label: '前置詞トレーニング' }]
  }

  if (route.path === '/cases') {
    return [home, { label: '分野別トレーニング', to: '/' }, { label: '格変化トレーニング' }]
  }

  if (route.path === '/verbs') {
    const isMotion = route.query.filter === 'motion'
    const items: BreadcrumbItem[] = [
      home,
      { label: '分野別トレーニング', to: '/' },
      { label: '動詞トレーニング', to: isMotion ? '/verbs' : undefined },
    ]

    return isMotion
      ? [...items, { label: '行く系動詞トレーニング' }]
      : items
  }

  if (route.path === '/vocabulary') {
    return [home, { label: '分野別トレーニング', to: '/' }, { label: '語彙トレーニング' }]
  }

  if (route.path === '/mixed') {
    return [home, { label: '分野別トレーニング', to: '/' }, { label: '総合トレーニング' }]
  }

  if (route.path === '/translations/ru-ja') {
    return [home, { label: '翻訳トレーニング', to: '/' }, { label: '露文和訳' }]
  }

  if (route.path === '/translations/ja-ru') {
    return [home, { label: '翻訳トレーニング', to: '/' }, { label: '和文露訳' }]
  }

  if (route.path.startsWith('/sections/')) {
    const sectionNumber = route.path.split('/').pop() ?? ''
    const sectionLabel = sectionLabels[sectionNumber]
    if (!sectionLabel) return []

    return [home, { label: '大問別問題集', to: '/' }, { label: sectionLabel }]
  }

  return []
})
</script>

<template>
  <nav
    v-if="breadcrumbs.length"
    aria-label="パンくずリスト"
    class="border-b border-slate-200 bg-slate-50 px-4 pt-3 text-slate-500 sm:pt-4"
  >
    <ol class="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-2 gap-y-1 pb-1 text-xs font-bold sm:pb-2">
      <li v-for="(item, index) in breadcrumbs" :key="item.label" class="flex min-w-0 items-center gap-2">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          custom
          v-slot="{ href, navigate }"
        >
          <a
            :href="href"
            class="truncate text-indigo-700 transition hover:text-indigo-900"
            @click="navigate"
          >
            {{ item.label }}
          </a>
        </NuxtLink>
        <span v-else aria-current="page" class="truncate text-slate-700">
          {{ item.label }}
        </span>
        <span v-if="index < breadcrumbs.length - 1" aria-hidden="true" class="shrink-0 text-slate-400">›</span>
      </li>
    </ol>
  </nav>
</template>
