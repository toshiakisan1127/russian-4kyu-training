import { expect, test } from '@playwright/test'
import { mockExam2 } from '../app/data/mockExam2'

const expectedQuestionCounts = [7, 7, 8, 5, 10, 5, 8, 4, 1, 5]

test.describe('mock exam 2 data quality', () => {
  test('keeps the expected number of questions in every section', () => {
    expect(mockExam2.sections.map((section) => section.questions.length)).toEqual(expectedQuestionCounts)
  })

  test('does not reveal accents in section II choices', () => {
    const accentSection = mockExam2.sections[1]

    for (const question of accentSection.questions) {
      expect(question.kind).toBe('choice')
      if (question.kind !== 'choice') continue

      for (const choice of question.choices) {
        expect(choice.normalize('NFD')).not.toContain('\u0301')
      }
    }
  })

  test('underlines exactly one target in every section I choice', () => {
    const pronunciationSection = mockExam2.sections[0]

    for (const question of pronunciationSection.questions) {
      expect(question.kind).toBe('choice')
      if (question.kind !== 'choice') continue

      for (const choice of question.choices) {
        expect((choice.match(/\u0332/g) ?? []).length).toBe(1)
      }
    }
  })

  test('keeps the Russian-to-Japanese passage close to 100 words', () => {
    const translationSection = mockExam2.sections[8]
    const question = translationSection.questions[0]

    expect(question.kind).toBe('input')
    const wordCount = question.prompt.trim().split(/\s+/).length
    expect(wordCount).toBeGreaterThanOrEqual(90)
    expect(wordCount).toBeLessThanOrEqual(110)
  })

  test('has unique question ids and valid choice answer indexes', () => {
    const questions = mockExam2.sections.flatMap((section) => section.questions)
    const ids = questions.map((question) => question.id)

    expect(new Set(ids).size).toBe(ids.length)

    for (const question of questions) {
      if (question.kind !== 'choice') continue
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(question.choices.length)
    }
  })
})
