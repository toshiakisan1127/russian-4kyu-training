<template>
  <section class="bg-slate-50 px-4 pb-10 text-slate-950 sm:pb-14" aria-labelledby="seo-guide-heading">
    <div class="mx-auto w-full max-w-5xl border-t border-slate-200 pt-8">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p class="mb-2 text-xs font-black tracking-[0.14em] text-indigo-600 uppercase">Russian 4th Grade Study</p>
        <h2 id="seo-guide-heading" class="mb-3 text-2xl font-black tracking-tight sm:text-3xl">
          ロシア語能力検定4級の対策を、問題演習でくり返す
        </h2>
        <p class="m-0 max-w-3xl leading-7 text-slate-600">
          ロシア語能力検定4級の合格を目指す人向けの、無料・登録不要の個人制作学習サイトです。語彙、格変化、前置詞、動詞の現在形・過去形・未来形、発音・アクセント、露文和訳、和文露訳、模擬試験まで、4級で必要になる内容を分野別に練習できます。
        </p>

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article class="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <h3 class="mb-2 text-lg font-black">文法・語彙を固める</h3>
            <p class="mb-4 text-sm font-medium leading-6 text-slate-600">
              単語だけでなく、格変化・前置詞・動詞活用を問題形式で反復。苦手な分野だけ選んで練習できます。
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-indigo-700">
              <NuxtLink to="/vocabulary" class="underline decoration-indigo-300 underline-offset-4">語彙 →</NuxtLink>
              <NuxtLink to="/cases" class="underline decoration-indigo-300 underline-offset-4">格変化 →</NuxtLink>
              <NuxtLink to="/verbs" class="underline decoration-indigo-300 underline-offset-4">動詞 →</NuxtLink>
              <NuxtLink to="/prepositions" class="underline decoration-indigo-300 underline-offset-4">前置詞 →</NuxtLink>
            </div>
          </article>

          <article class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <h3 class="mb-2 text-lg font-black">翻訳・読解を練習する</h3>
            <p class="mb-4 text-sm font-medium leading-6 text-slate-600">
              露文和訳と和文露訳は、模範例と見比べながら自己採点。ロシア語の文章を読む練習もできます。
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-emerald-700">
              <NuxtLink to="/translations/ru-ja" class="underline decoration-emerald-300 underline-offset-4">露文和訳 →</NuxtLink>
              <NuxtLink to="/translations/ja-ru" class="underline decoration-emerald-300 underline-offset-4">和文露訳 →</NuxtLink>
              <NuxtLink to="/reading" class="underline decoration-emerald-300 underline-offset-4">読解 →</NuxtLink>
            </div>
          </article>

          <article class="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <h3 class="mb-2 text-lg font-black">最後は模擬試験で確認</h3>
            <p class="mb-4 text-sm font-medium leading-6 text-slate-600">
              発音・アクセント・文法・動詞・翻訳をまとめて解き、4級本番を意識した形で現在の実力を確認できます。
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-amber-800">
              <NuxtLink to="/mock" class="underline decoration-amber-300 underline-offset-4">模擬試験 →</NuxtLink>
              <NuxtLink to="/reference" class="underline decoration-amber-300 underline-offset-4">重要表現 →</NuxtLink>
            </div>
          </article>
        </div>

        <p class="mt-6 mb-0 text-sm font-medium leading-6 text-slate-500">
          このサイトはロシア語能力検定試験の公式サイト・公式教材ではありません。試験の概要や、このサイトを使った対策方法は
          <NuxtLink to="/about" class="font-black text-indigo-700 underline decoration-indigo-300 underline-offset-4">「ロシア語能力検定4級とは？」</NuxtLink>
          にまとめています。
        </p>
      </div>
    </div>
  </section>
</template>
