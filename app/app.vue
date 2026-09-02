<script setup lang="ts">
import { computed, ref } from 'vue'
import { questions } from './data/questions'

const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value])
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.answer)

const selectAnswer = (value: string) => {
  if (answered.value) return

  selectedAnswer.value = value
  answered.value = true

  if (value === currentQuestion.value.answer) {
    correctCount.value += 1
  }
}

const goNext = () => {
  if (!answered.value) return

  if (currentIndex.value === questions.length - 1) {
    completed.value = true
    return
  }

  currentIndex.value += 1
  selectedAnswer.value = null
  answered.value = false
}

const restart = () => {
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  correctCount.value = 0
  completed.value = false
}
</script>

<template>
  <main class="page-shell">
    <section class="app-card">
      <header class="app-header">
        <div>
          <p class="eyebrow">ロシア語能力検定4級</p>
          <h1>前置詞ミニトレーニング</h1>
        </div>
        <span class="progress">{{ Math.min(currentIndex + 1, questions.length) }} / {{ questions.length }}</span>
      </header>

      <div v-if="!completed" class="quiz-area">
        <div class="question-block">
          <p class="category">前置詞</p>
          <p class="question">{{ currentQuestion.prompt }}</p>
        </div>

        <div class="choices">
          <button
            v-for="choice in currentQuestion.choices"
            :key="choice.value"
            type="button"
            class="choice-button"
            :class="{
              correct: answered && choice.value === currentQuestion.answer,
              wrong: answered && selectedAnswer === choice.value && choice.value !== currentQuestion.answer,
            }"
            :disabled="answered"
            @click="selectAnswer(choice.value)"
          >
            {{ choice.value }}
          </button>
        </div>

        <section v-if="answered" class="explanation-panel">
          <p class="result" :class="isCorrect ? 'result-correct' : 'result-wrong'">
            {{ isCorrect ? '正解！' : `不正解。正解は「${currentQuestion.answer}」` }}
          </p>

          <div class="main-explanation">
            <h2>なぜ？</h2>
            <p>{{ currentQuestion.correctExplanation }}</p>
          </div>

          <div class="choice-explanations">
            <h2>他の選択肢も確認</h2>
            <article
              v-for="choice in currentQuestion.choices"
              :key="`explanation-${choice.value}`"
              class="choice-explanation"
            >
              <strong>{{ choice.value }}</strong>
              <span v-if="choice.value === currentQuestion.answer" class="answer-label">正解</span>
              <p>{{ choice.explanation }}</p>
            </article>
          </div>

          <button type="button" class="next-button" @click="goNext">
            {{ currentIndex === questions.length - 1 ? '結果を見る' : '次の問題へ' }}
          </button>
        </section>
      </div>

      <section v-else class="result-screen">
        <p class="eyebrow">RESULT</p>
        <h2>{{ correctCount }} / {{ questions.length }} 問正解</h2>
        <p>まずはこの5問をテンポよく回せればOK。解説の読みやすさを見ながら問題を増やしていく。</p>
        <button type="button" class="next-button" @click="restart">もう一度やる</button>
      </section>
    </section>
  </main>
</template>

<style>
:root {
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f4f1;
  color: #20211f;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button {
  font: inherit;
}

.page-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
}

.app-card {
  width: min(720px, 100%);
  background: #ffffff;
  border: 1px solid #deded8;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 16px 40px rgb(0 0 0 / 8%);
}

.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.eyebrow,
.category {
  margin: 0 0 6px;
  color: #66675f;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.progress {
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f0f0eb;
  font-size: 0.9rem;
  font-weight: 700;
}

.question-block {
  margin-bottom: 24px;
}

.question {
  margin-bottom: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.8rem, 6vw, 2.7rem);
  line-height: 1.35;
}

.choices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.choice-button,
.next-button {
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}

.choice-button {
  min-height: 58px;
  border: 1px solid #d5d5cf;
  background: #fafaf8;
  font-size: 1.15rem;
  font-weight: 700;
}

.choice-button:not(:disabled):hover {
  transform: translateY(-1px);
  background: #f1f1ec;
}

.choice-button:disabled {
  cursor: default;
}

.choice-button.correct {
  border-color: #4c8a5c;
  background: #e8f4eb;
}

.choice-button.wrong {
  border-color: #b45b55;
  background: #fbeaea;
}

.explanation-panel {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e6e6e0;
}

.result {
  margin-bottom: 18px;
  font-size: 1.05rem;
  font-weight: 800;
}

.result-correct {
  color: #357847;
}

.result-wrong {
  color: #a84640;
}

.main-explanation,
.choice-explanations {
  margin-bottom: 22px;
}

.main-explanation h2,
.choice-explanations h2 {
  margin-bottom: 10px;
  font-size: 1rem;
}

.main-explanation p,
.choice-explanation p,
.result-screen p {
  line-height: 1.7;
}

.choice-explanation {
  position: relative;
  padding: 14px 0;
  border-top: 1px solid #ecece6;
}

.choice-explanation strong {
  display: inline-block;
  min-width: 28px;
  font-size: 1.05rem;
}

.choice-explanation p {
  margin: 6px 0 0;
  color: #454641;
}

.answer-label {
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #e8f4eb;
  color: #357847;
  font-size: 0.72rem;
  font-weight: 800;
}

.next-button {
  width: 100%;
  min-height: 52px;
  padding: 12px 18px;
  background: #20211f;
  color: #ffffff;
  font-weight: 800;
}

.next-button:hover {
  transform: translateY(-1px);
  background: #343531;
}

.result-screen {
  padding: 40px 0 12px;
  text-align: center;
}

.result-screen h2 {
  margin-bottom: 14px;
  font-size: clamp(2rem, 8vw, 3.2rem);
}

.result-screen .next-button {
  margin-top: 18px;
}

@media (max-width: 540px) {
  .app-card {
    padding: 22px 18px;
    border-radius: 16px;
  }

  .app-header {
    margin-bottom: 26px;
  }

  .choices {
    grid-template-columns: 1fr;
  }
}
</style>
