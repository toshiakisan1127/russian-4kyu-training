<script setup lang="ts">
const githubFeatureUrl = 'https://github.com/toshiakisan1127/russian-4kyu-training/issues/new?template=feature_request.yml'
const githubBugUrl = 'https://github.com/toshiakisan1127/russian-4kyu-training/issues/new?template=bug_report.yml'
const xProfileUrl = 'https://x.com/toshiakisan1127'

useHead({
  title: '要望・不具合報告 | ロシア語4級トレーニング',
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-4xl">
      <header class="mb-8">
        <p class="mb-2 text-xs font-black tracking-[0.16em] text-indigo-600 uppercase">Feedback</p>
        <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-5xl">要望・不具合報告</h1>
        <p class="m-0 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          「こんな機能が欲しい」「ここが使いづらい」「動きがおかしい」など、気づいたことがあればぜひ教えてください。
        </p>
      </header>

      <div class="grid gap-5 lg:grid-cols-2">
        <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div class="mb-4 flex items-start gap-4">
            <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-2xl" aria-hidden="true">⌘</span>
            <div>
              <p class="mb-1 text-xs font-black tracking-[0.14em] text-slate-500 uppercase">GitHub</p>
              <h2 class="m-0 text-xl font-black sm:text-2xl">GitHub Issueから送る</h2>
            </div>
          </div>

          <p class="mb-5 leading-7 text-slate-600">
            GitHubアカウントがある方は、Issueから送ってもらえるとそのまま開発タスクとして確認できます。投稿内容は公開されます。
          </p>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              :href="githubFeatureUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
            >
              <span aria-hidden="true">✨</span>
              機能要望を送る ↗
            </a>
            <a
              :href="githubBugUrl"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-800 transition hover:border-rose-400 hover:bg-rose-100"
            >
              <span aria-hidden="true">🐛</span>
              不具合を報告する ↗
            </a>
          </div>
        </article>

        <article class="rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-7">
          <div class="mb-4 flex items-start gap-4">
            <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-xl font-black" aria-hidden="true">𝕏</span>
            <div>
              <p class="mb-1 text-xs font-black tracking-[0.14em] text-sky-700 uppercase">X / Twitter</p>
              <h2 class="m-0 text-xl font-black sm:text-2xl">Xから送る</h2>
            </div>
          </div>

          <p class="mb-5 leading-7 text-slate-700">
            GitHubを使わない方は、Xで <strong>@toshiakisan1127</strong> までメンションやリプライで送ってください。内容を確認して、必要に応じて開発用Issueに整理します。
          </p>

          <a
            :href="xProfileUrl"
            target="_blank"
            rel="noreferrer"
            class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            𝕏 @toshiakisan1127 を開く ↗
          </a>
        </article>
      </div>

      <section class="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
        <h2 class="mb-3 text-lg font-black">送るときのお願い</h2>
        <ul class="m-0 space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
          <li>不具合の場合は、どのページで何をしたときに起きたかを書いてもらえると助かります。</li>
          <li>スクリーンショットを添付する場合は、氏名・メールアドレスなどの個人情報が写り込んでいないか確認してください。</li>
          <li>すべての要望を実装できるとは限りませんが、改善の参考にします。</li>
        </ul>
      </section>

      <div class="mt-8">
        <NuxtLink
          to="/about"
          class="inline-flex items-center gap-2 font-black text-indigo-700 underline decoration-indigo-300 underline-offset-4 transition hover:text-indigo-900"
        >
          ← このサイトについて戻る
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
