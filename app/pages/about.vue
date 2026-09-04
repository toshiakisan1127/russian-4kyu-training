<script setup lang="ts">
useHead({
  title: 'このサイトについて | ロシア語4級トレーニング',
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
    <section class="mx-auto w-full max-w-4xl">
      <NuxtLink to="/" class="mb-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
        ← トップへ戻る
      </NuxtLink>

      <header class="mb-8">
        <p class="mb-2 text-xs font-black tracking-[0.16em] text-indigo-600 uppercase">About this site</p>
        <h1 class="mb-3 text-3xl font-black tracking-tight sm:text-5xl">このサイトについて</h1>
        <p class="m-0 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          ロシア語能力検定4級の出題範囲を意識した、復習・反復練習用の個人制作サイトです。
        </p>
      </header>

      <div class="grid gap-5 lg:grid-cols-2">
        <article class="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 sm:p-7">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">About the exam</p>
          <h2 class="mb-3 text-xl font-black sm:text-2xl">ロシア語能力検定4級とは</h2>
          <p class="mb-4 leading-7 text-slate-700">
            ロシア語能力検定試験の4級は、初級段階のロシア語について、文法・読解・作文・朗読の力を確認する試験です。4級は250点満点で、日常的な内容を中心に出題されます。
          </p>
          <ul class="m-0 space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
            <li>文法：文字と発音、アクセント、格変化、動詞の時制、簡単な複文など</li>
            <li>露文和訳：日常的なロシア語の文章を日本語に訳す</li>
            <li>和文露訳：やさしい日常表現をロシア語に訳す</li>
            <li>朗読：ロシア語の文章を声に出して読む</li>
          </ul>
          <a
            href="https://www.tokyorus.ac.jp/kentei/grade.html"
            target="_blank"
            rel="noreferrer"
            class="mt-5 inline-flex font-black text-indigo-700 underline decoration-indigo-300 underline-offset-4 transition hover:text-indigo-900"
          >
            詳しい試験内容は公式案内へ ↗
          </a>
        </article>

        <article class="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
          <p class="mb-1 text-xs font-black tracking-[0.14em] text-amber-700 uppercase">About this site</p>
          <h2 class="mb-3 text-xl font-black sm:text-2xl">このサイトの前提条件</h2>
          <p class="mb-4 leading-7 text-slate-700">
            このサイトは、ロシア語文法を一通り学習した経験があり、忘れた内容を問題演習で復習したい人を主な対象にしています。
          </p>
          <ul class="m-0 space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
            <li>ロシア文字を読め、基本的な文の意味を追えること</li>
            <li>名詞の性・格変化、動詞の人称変化・過去形・未来形などを一度は学習済みであること</li>
            <li>文法をゼロから講義する教材ではなく、4級範囲の確認と反復練習が中心であること</li>
            <li>アクセント記号は発音補助で、音声は端末やブラウザのWeb Speech APIに依存すること</li>
            <li>本試験の完全再現や公式過去問ではなく、出題内容を参考にした個人制作の練習サイトであること</li>
          </ul>
        </article>
      </div>

      <section class="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
        <p class="mb-1 text-xs font-black tracking-[0.14em] text-emerald-700 uppercase">Install as an app</p>
        <h2 class="mb-3 text-xl font-black sm:text-2xl">スマホのホーム画面に追加する</h2>
        <p class="mb-5 leading-7 text-slate-700">
          このサイトはPWAに対応しています。ホーム画面に追加すると、アプリのようにすぐ開けます。問題の進捗はブラウザの保存領域に記録されます。
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-2xl border border-emerald-200 bg-white p-4">
            <h3 class="mb-2 text-base font-black">iPhone・iPad（Safari）</h3>
            <ol class="m-0 space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
              <li>Safariでこのサイトを開く</li>
              <li>画面下部または上部の共有ボタン（□に↑）をタップ</li>
              <li>「ホーム画面に追加」を選び、「追加」をタップ</li>
            </ol>
          </div>

          <div class="rounded-2xl border border-emerald-200 bg-white p-4">
            <h3 class="mb-2 text-base font-black">Android（Chrome）</h3>
            <ol class="m-0 space-y-2 pl-5 text-sm font-bold leading-6 text-slate-700">
              <li>Chromeでこのサイトを開く</li>
              <li>右上の「︙」メニューをタップ</li>
              <li>「ホーム画面に追加」または「アプリをインストール」を選ぶ</li>
            </ol>
          </div>
        </div>

        <p class="mt-4 mb-0 text-xs font-bold leading-5 text-slate-500">
          「ホーム画面に追加」が表示されない場合は、SafariまたはChromeで公開中のサイトを開いているか確認してください。iPhoneではSafariからの追加に対応しています。
        </p>

        <div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <strong>保存データについて：</strong>
          学習進捗や設定は端末内に保存されます。特にiPhone・iPadでは、Safariで開いたサイトとホーム画面に追加したアプリで保存領域が分かれ、進捗が共有されない場合があります。普段使う方を決めて、その方で学習してください。
        </div>
      </section>
    </section>
  </main>
</template>
