<template>
  <section class="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="exam-study-heading">
    <p class="mb-2 text-xs font-black tracking-[0.14em] text-violet-600 uppercase">Study Guide</p>
    <h2 id="exam-study-heading" class="mb-3 text-2xl font-black tracking-tight sm:text-3xl">
      ロシア語能力検定4級の対策は、弱点を分けて練習する
    </h2>
    <p class="m-0 leading-7 text-slate-600">
      4級対策では、文法や単語をまとめて眺めるだけでなく、発音・アクセント、格変化、動詞活用、翻訳のように分野を分けて反復し、最後に模擬試験で横断的に確認すると復習しやすくなります。このサイトでは各分野を独立して練習できます。
    </p>

    <ol class="mt-6 grid gap-4 sm:grid-cols-2">
      <li class="rounded-2xl border border-sky-100 bg-sky-50 p-5">
        <p class="mb-1 text-xs font-black text-sky-700">STEP 1</p>
        <h3 class="mb-2 text-lg font-black">語彙と基本文法を確認</h3>
        <p class="mb-3 text-sm font-medium leading-6 text-slate-600">まずは意味が分からない単語を減らし、格変化・前置詞の支配格などを問題で確認します。</p>
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-sky-700">
          <NuxtLink to="/vocabulary" class="underline decoration-sky-300 underline-offset-4">語彙 →</NuxtLink>
          <NuxtLink to="/cases" class="underline decoration-sky-300 underline-offset-4">格変化 →</NuxtLink>
          <NuxtLink to="/prepositions" class="underline decoration-sky-300 underline-offset-4">前置詞 →</NuxtLink>
        </div>
      </li>

      <li class="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p class="mb-1 text-xs font-black text-violet-700">STEP 2</p>
        <h3 class="mb-2 text-lg font-black">動詞活用を反復</h3>
        <p class="mb-3 text-sm font-medium leading-6 text-slate-600">現在形の人称変化、過去形、未来形、移動動詞を分けて練習し、形をすぐ作れる状態を目指します。</p>
        <NuxtLink to="/verbs" class="text-sm font-black text-violet-700 underline decoration-violet-300 underline-offset-4">動詞トレーニング →</NuxtLink>
      </li>

      <li class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <p class="mb-1 text-xs font-black text-emerald-700">STEP 3</p>
        <h3 class="mb-2 text-lg font-black">読解・翻訳で使えるか確認</h3>
        <p class="mb-3 text-sm font-medium leading-6 text-slate-600">覚えた文法と語彙を文章の中で使い、露文和訳・和文露訳で理解の穴を見つけます。</p>
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-emerald-700">
          <NuxtLink to="/translations/ru-ja" class="underline decoration-emerald-300 underline-offset-4">露文和訳 →</NuxtLink>
          <NuxtLink to="/translations/ja-ru" class="underline decoration-emerald-300 underline-offset-4">和文露訳 →</NuxtLink>
        </div>
      </li>

      <li class="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <p class="mb-1 text-xs font-black text-amber-800">STEP 4</p>
        <h3 class="mb-2 text-lg font-black">模擬試験で弱点を戻す</h3>
        <p class="mb-3 text-sm font-medium leading-6 text-slate-600">一通り解いたら模擬試験へ。間違えた分野をもう一度個別トレーニングに戻して反復します。</p>
        <NuxtLink to="/mock" class="text-sm font-black text-amber-800 underline decoration-amber-300 underline-offset-4">4級模擬試験 →</NuxtLink>
      </li>
    </ol>

    <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 class="mb-2 text-lg font-black">試験直前の確認にも</h3>
      <p class="mb-3 text-sm font-medium leading-6 text-slate-600">
        移動動詞や頻度表現など、忘れやすい項目は重要表現ページにまとめています。短時間の見直しに使えます。
      </p>
      <NuxtLink to="/reference" class="text-sm font-black text-indigo-700 underline decoration-indigo-300 underline-offset-4">4級重要表現まとめ →</NuxtLink>
    </div>
  </section>
</template>
