<script setup lang="ts">
import { computed, ref } from 'vue'
import { questions } from './data/questions'

const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const completed = ref(false)

const currentQuestion = computed(() => questions[currentIndex.value]!)
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
            <span class="choice-value">{{ choice.value }}</span>
            <span
              v-if="answered && choice.value === currentQuestion.answer"
              class="choice-status choice-status-correct"
            >
              正解
            </span>
            <span
              v-else-if="answered && selectedAnswer === choice.value"
              class="choice-status choice-status-wrong"
            >
              あなたの回答
            </span>
          </button>
        </div>

        <section v-if="answered" class="explanation-panel">
          <div class="feedback-card" :class="isCorrect ? 'feedback-correct' : 'feedback-wrong'">
            <div class="feedback-icon" aria-hidden="true">{{ isCorrect ? '○' : '×' }}</div>
            <div>
              <p class="feedback-title">{{ isCorrect ? '正解！' : '不正解' }}</p>
              <p v-if="!isCorrect" class="correct-answer">
                正解は <strong>「{{ currentQuestion.answer }}」</strong>
              </p>
              <p v-else class="feedback-subtext">その調子！</p>
            </div>
          </div>

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
@import url('https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap');

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
  font-family: "PT Serif", Georgia, serif;
  font-size: clamp(1.8rem, 6vw, 2.7rem);
  line-height: 1.45;
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
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
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
  opacity: 1;
}

.choice-button.correct {
  border: 2px solid #3f8a54;
  background: #e8f4eb;
  color: #256238;
}

.choice-button.wrong {
  border: 2px solid #b64e49;
  background: #fbe8e7;
  color: #8d312d;
}

.choice-value {
  font-size: 1.18rem;
}

.choice-status {
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}

.choice-status-correct {
  background: #cfe9d5;
  color: #256238;
}

.choice-status-wrong {
  background: #f3c9c7;
  color: #8d312d;
}

.explanation-panel {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e6e6e0;
}

.feedback-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 18px;
  border-radius: 16px;
  border: 2px solid;
}

.feedback-correct {
  border-color: #62a875;
  background: #edf8f0;
  color: #235f35;
}

.feedback-wrong {
  border-color: #c76059;
  background: #fff0ef;
  color: #8c2e29;
}

.feedback-icon {
  flex: 0 0 auto;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 3px solid currentColor;
  border-radius: 50%;
  font-size: 2.1rem;
  font-weight: 800;
  line-height: 1;
}

.feedback-wrong .feedback-icon {
  border-radius: 14px;
}

.feedback-title {
  margin-bottom: 4px;
  font-size: 1.35rem;
  font-weight: 900;
}

.correct-answer,
.feedback-subtext {
  margin-bottom: 0;
  line-height: 1.5;
}

.correct-answer strong {
  font-size: 1.22rem;
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

  .feedback-card {
    padding: 16px;
  }

  .feedback-icon {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
}
</style>
