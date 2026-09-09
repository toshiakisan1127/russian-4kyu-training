import { expect, test } from '@playwright/test'
import { getVocabularyExamTips } from '../app/data/vocabularyExamTips'

test.describe('vocabulary exam tips', () => {
  test('adds word-specific tips and a part-of-speech fallback', () => {
    const tips = getVocabularyExamTips('идти', '動詞')

    expect(tips).toHaveLength(3)
    expect(tips[0]).toContain('ходить')
    expect(tips[1]).toContain('шёл')
    expect(tips[2]).toContain('現在の人称変化')
  })

  test('keeps a useful fallback for words without a dedicated tip', () => {
    expect(getVocabularyExamTips('книга', '名詞')).toEqual([
      '名詞は前置詞や動詞に応じて格変化する。性・単数の主要格・複数形をセットで確認する。',
    ])
  })
})
