import { expect, test } from '@playwright/test'
import { mockExam2 } from '../app/data/mockExam2'
import { mockExam3 } from '../app/data/mockExam3'
import { mockExams } from '../app/data/mockExams'

const expectedQuestionCounts = [7, 7, 8, 5, 10, 5, 8, 4, 1, 5]
const stripStress = (text: string) => text.normalize('NFD').replace(/\u0301/g, '').normalize('NFC')

for (const exam of mockExams) {
  test.describe(`${exam.title} data structure`, () => {
    test('keeps the expected number of questions in every section', () => {
      expect(exam.sections.map((section) => section.questions.length)).toEqual(expectedQuestionCounts)
    })

    test('does not reveal accents in section II choices', () => {
      const accentSection = exam.sections[1]

      for (const question of accentSection.questions) {
        expect(question.kind).toBe('choice')
        if (question.kind !== 'choice') continue

        for (const choice of question.choices) {
          expect(choice.normalize('NFD')).not.toContain('\u0301')
        }
      }
    })

    test('underlines exactly one target in every section I choice', () => {
      const pronunciationSection = exam.sections[0]

      for (const question of pronunciationSection.questions) {
        expect(question.kind).toBe('choice')
        if (question.kind !== 'choice') continue

        for (const choice of question.choices) {
          expect((choice.match(/\u0332/g) ?? []).length).toBe(1)
        }
      }
    })

    test('has unique question ids and valid choice answer indexes', () => {
      const questions = exam.sections.flatMap((section) => section.questions)
      const ids = questions.map((question) => question.id)

      expect(new Set(ids).size).toBe(ids.length)

      for (const question of questions) {
        if (question.kind !== 'choice') continue
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.answer).toBeLessThan(question.choices.length)
      }
    })
  })
}

for (const exam of [mockExam2, mockExam3]) {
  test.describe(`${exam.title} modernized data quality`, () => {
    test('keeps the Russian-to-Japanese passage close to 100 words', () => {
      const translationSection = exam.sections[8]
      const question = translationSection.questions[0]

      expect(question.kind).toBe('input')
      if (question.kind !== 'input') return

      const wordCount = question.prompt.trim().split(/\s+/).length
      expect(wordCount).toBeGreaterThanOrEqual(90)
      expect(wordCount).toBeLessThanOrEqual(110)
    })

    test('keeps translation prompt and speech text identical except for stress marks', () => {
      const question = exam.sections[8].questions[0]

      expect(question.kind).toBe('input')
      if (question.kind !== 'input') return

      expect(question.speechText).toBeTruthy()
      expect(stripStress(question.speechText ?? '')).toBe(question.prompt)
    })

    test('derives totals from the actual question data', () => {
      const totalQuestionCards = exam.sections.reduce((sum, section) => sum + section.questions.length, 0)
      const totalAnswerFields = exam.sections.reduce(
        (sum, section) =>
          sum +
          section.questions.reduce(
            (questionSum, question) => questionSum + (question.kind === 'input' ? question.fields.length : 1),
            0,
          ),
        0,
      )

      expect(exam.totalQuestionCards).toBe(totalQuestionCards)
      expect(exam.totalAnswerFields).toBe(totalAnswerFields)
    })
  })
}

test.describe('mock exam 3 content balance', () => {
  test('does not put every section VI answer in the same choice position', () => {
    const answerIndexes = mockExam3.sections[5].questions.map((question) => {
      expect(question.kind).toBe('choice')
      return question.kind === 'choice' ? question.answer : -1
    })

    expect(new Set(answerIndexes).size).toBeGreaterThan(1)
  })
})
