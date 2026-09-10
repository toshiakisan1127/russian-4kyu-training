import { expect, test } from '@playwright/test'
import { getVocabularyExamTips } from '../app/data/vocabularyExamTips'

test.describe('vocabulary exam tips', () => {
  test('keeps curated tips and fills the rest with word-specific data', () => {
    const tips = getVocabularyExamTips('идти')

    expect(tips).toHaveLength(3)
    expect(tips[0]).toContain('ходить')
    expect(tips[1]).toContain('шёл')
    expect(tips[2]).toContain('иду')
  })

  test('shows the actual gender, plural and case forms for nouns', () => {
    const tips = getVocabularyExamTips('книга')

    expect(tips[0]).toContain('女性名詞')
    expect(tips[0]).toContain('книги')
    expect(tips[1]).toContain('кни́ги')
    expect(tips[1]).toContain('кни́гу')
    expect(tips[1]).toContain('кни́ге')
  })

  test('shows the actual aspect and conjugation for verbs', () => {
    const tips = getVocabularyExamTips('читать')

    expect(tips[0]).toContain('不完了体')
    expect(tips[0]).toContain('я чита́ю')
    expect(tips[0]).toContain('ты чита́ешь')
    expect(tips[0]).toContain('они́ чита́ют')
    expect(tips[1]).toContain('буду читать')
  })

  test('shows the actual gender and number forms for adjectives', () => {
    const tips = getVocabularyExamTips('новый')

    expect(tips[0]).toContain('но́вая')
    expect(tips[0]).toContain('но́вое')
    expect(tips[0]).toContain('но́вые')
    expect(tips[1]).toContain('но́вого')
    expect(tips[1]).toContain('но́вом')
  })

  test('does not show an abstract part-of-speech fallback', () => {
    expect(getVocabularyExamTips('и')).toEqual([])
    expect(getVocabularyExamTips('unknown-word')).toEqual([])
  })
})
