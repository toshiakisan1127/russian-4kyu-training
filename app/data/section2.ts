import { vocabularyItems } from '~/data/vocabulary'

export type AccentChoice = {
  sourceId: string
  word: string
  stressedWord: string
  meaning: string
  syllableCount: number
  stressPosition: number
}

export type AccentQuestion = {
  id: string
  choices: AccentChoice[]
  answer: number
  commonStressPosition: number
  oddStressPosition: number
}

const vowels = new Set(Array.from('аеёиоуыэюя'))

const analyzeStress = (stressedWord: string) => {
  let syllableCount = 0
  let stressPosition = 0
  let lastVowelPosition = 0

  for (const char of stressedWord.toLowerCase().normalize('NFC')) {
    if (vowels.has(char)) {
      syllableCount += 1
      lastVowelPosition = syllableCount
      if (char === 'ё') stressPosition = syllableCount
      continue
    }

    if (char === '\u0301' && lastVowelPosition > 0) {
      stressPosition = lastVowelPosition
    }
  }

  if (syllableCount === 1 && stressPosition === 0) {
    stressPosition = 1
  }

  return { syllableCount, stressPosition }
}

const candidates: AccentChoice[] = vocabularyItems
  .filter((item) => /^[а-я]+$/iu.test(item.word) && !item.word.includes('ё'))
  .map((item) => {
    const { syllableCount, stressPosition } = analyzeStress(item.stressedWord)
    return {
      sourceId: item.id,
      word: item.word,
      stressedWord: item.stressedWord,
      meaning: item.meaning,
      syllableCount,
      stressPosition,
    }
  })
  .filter((item) => item.syllableCount >= 2 && item.syllableCount <= 4 && item.stressPosition > 0)

const groups = new Map<number, Map<number, AccentChoice[]>>()

for (const candidate of candidates) {
  const byStress = groups.get(candidate.syllableCount) ?? new Map<number, AccentChoice[]>()
  const bucket = byStress.get(candidate.stressPosition) ?? []
  bucket.push(candidate)
  byStress.set(candidate.stressPosition, bucket)
  groups.set(candidate.syllableCount, byStress)
}

for (const byStress of groups.values()) {
  for (const bucket of byStress.values()) {
    bucket.sort((a, b) => a.sourceId.localeCompare(b.sourceId))
  }
}

type Pattern = {
  commonStressPosition: number
  oddStressPosition: number
  common: AccentChoice[]
  odd: AccentChoice[]
}

const patterns: Pattern[] = []

for (const syllableCount of [...groups.keys()].sort((a, b) => a - b)) {
  const byStress = groups.get(syllableCount)!
  const positions = [...byStress.keys()].sort((a, b) => a - b)

  for (const commonStressPosition of positions) {
    const common = byStress.get(commonStressPosition)!
    if (common.length < 3) continue

    for (const oddStressPosition of positions) {
      if (oddStressPosition === commonStressPosition) continue
      const odd = byStress.get(oddStressPosition)!
      if (odd.length === 0) continue

      patterns.push({ commonStressPosition, oddStressPosition, common, odd })
    }
  }
}

const generated: AccentQuestion[] = []
const signatures = new Set<string>()

for (let round = 0; round < 500 && generated.length < 100; round += 1) {
  patterns.forEach((pattern, patternIndex) => {
    if (generated.length >= 100) return

    const start = (round + patternIndex * 3) % pattern.common.length
    const same = [
      pattern.common[start]!,
      pattern.common[(start + 1) % pattern.common.length]!,
      pattern.common[(start + 2) % pattern.common.length]!,
    ]
    const odd = pattern.odd[(round * 7 + patternIndex) % pattern.odd.length]!
    const choices = [...same, odd]
    const signature = choices.map((choice) => choice.sourceId).sort().join('-')

    if (signatures.has(signature)) return
    signatures.add(signature)

    generated.push({
      id: `section2-${signature.replaceAll('vocab-', '')}`,
      choices,
      answer: 3,
      commonStressPosition: pattern.commonStressPosition,
      oddStressPosition: pattern.oddStressPosition,
    })
  })
}

if (generated.length < 100) {
  throw new Error(`Section II accent pool must contain 100 questions, got ${generated.length}`)
}

export const section2Questions: AccentQuestion[] = generated.slice(0, 100)
