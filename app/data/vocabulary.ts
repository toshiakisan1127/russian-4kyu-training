export type VocabularyItem = {
  id: string
  word: string
  stressedWord: string
  meaning: string
  ipa: string
}

export const vocabularyItems: VocabularyItem[] = [
  { id: 'vocab-001', word: 'книга', stressedWord: 'кни́га', meaning: '本', ipa: '/ˈknʲiɡə/' },
  { id: 'vocab-002', word: 'семья', stressedWord: 'семья́', meaning: '家族', ipa: '/sʲɪˈmʲja/' },
  { id: 'vocab-003', word: 'школа', stressedWord: 'шко́ла', meaning: '学校', ipa: '/ˈʂkolə/' },
  { id: 'vocab-004', word: 'город', stressedWord: 'го́род', meaning: '都市・町', ipa: '/ˈɡorət/' },
  { id: 'vocab-005', word: 'вода', stressedWord: 'вода́', meaning: '水', ipa: '/vɐˈda/' },
]
