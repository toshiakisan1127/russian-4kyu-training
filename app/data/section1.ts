export type PronunciationChoice = {
  word: string
  stressedWord: string
  prefix: string
  target: string
  suffix: string
  meaning: string
  ipa: string
  targetSound: string
  explanation: string
}

export type PronunciationQuestion = {
  id: string
  answer: number
  rule: string
  choices: PronunciationChoice[]
}

export const section1Questions: PronunciationQuestion[] = [
  {
    id: 'pron-001',
    answer: 3,
    rule: '語末の有声子音は無声化します。',
    choices: [
      { word: 'год', stressedWord: 'го́д', prefix: '', target: 'г', suffix: 'од', meaning: '年', ipa: '/ɡot/', targetSound: '[ɡ]', explanation: '語頭の г は通常どおり [ɡ]。' },
      { word: 'газ', stressedWord: 'га́з', prefix: '', target: 'г', suffix: 'аз', meaning: 'ガス', ipa: '/ɡas/', targetSound: '[ɡ]', explanation: '語頭の г は [ɡ]。' },
      { word: 'нога', stressedWord: 'нога́', prefix: 'но', target: 'г', suffix: 'а', meaning: '脚', ipa: '/nɐˈɡa/', targetSound: '[ɡ]', explanation: '母音にはさまれた г は [ɡ]。' },
      { word: 'друг', stressedWord: 'дру́г', prefix: 'дру', target: 'г', suffix: '', meaning: '友人', ipa: '/druk/', targetSound: '[k]', explanation: '語末の г は無声化して [k] になります。' },
    ],
  },
  {
    id: 'pron-002',
    answer: 3,
    rule: '語末の б は無声化して [p] になります。',
    choices: [
      { word: 'брат', stressedWord: 'бра́т', prefix: '', target: 'б', suffix: 'рат', meaning: '兄弟', ipa: '/brat/', targetSound: '[b]', explanation: '語頭の б は [b]。' },
      { word: 'бабушка', stressedWord: 'ба́бушка', prefix: '', target: 'б', suffix: 'абушка', meaning: '祖母', ipa: '/ˈbabʊʂkə/', targetSound: '[b]', explanation: '語頭の б は [b]。' },
      { word: 'работа', stressedWord: 'рабо́та', prefix: 'ра', target: 'б', suffix: 'ота', meaning: '仕事', ipa: '/rɐˈbotə/', targetSound: '[b]', explanation: '母音にはさまれた б は [b]。' },
      { word: 'хлеб', stressedWord: 'хле́б', prefix: 'хле', target: 'б', suffix: '', meaning: 'パン', ipa: '/xlʲep/', targetSound: '[p]', explanation: '語末なので б が無声化して [p]。' },
    ],
  },
  {
    id: 'pron-003',
    answer: 3,
    rule: '語末の д は無声化して [t] になります。',
    choices: [
      { word: 'дом', stressedWord: 'до́м', prefix: '', target: 'д', suffix: 'ом', meaning: '家', ipa: '/dom/', targetSound: '[d]', explanation: '語頭の д は [d]。' },
      { word: 'вода', stressedWord: 'вода́', prefix: 'во', target: 'д', suffix: 'а', meaning: '水', ipa: '/vɐˈda/', targetSound: '[d]', explanation: '母音にはさまれた д は [d]。' },
      { word: 'подарок', stressedWord: 'пода́рок', prefix: 'по', target: 'д', suffix: 'арок', meaning: '贈り物', ipa: '/pɐˈdarək/', targetSound: '[d]', explanation: '語中の д は [d]。' },
      { word: 'сад', stressedWord: 'са́д', prefix: 'са', target: 'д', suffix: '', meaning: '庭', ipa: '/sat/', targetSound: '[t]', explanation: '語末なので д が無声化して [t]。' },
    ],
  },
  {
    id: 'pron-004',
    answer: 3,
    rule: '語末の з は無声化して [s] になります。',
    choices: [
      { word: 'завод', stressedWord: 'заво́д', prefix: '', target: 'з', suffix: 'авод', meaning: '工場', ipa: '/zɐˈvot/', targetSound: '[z]', explanation: '語頭の з は [z]。' },
      { word: 'зонт', stressedWord: 'зо́нт', prefix: '', target: 'з', suffix: 'онт', meaning: '傘', ipa: '/zont/', targetSound: '[z]', explanation: '語頭の з は [z]。' },
      { word: 'музыка', stressedWord: 'му́зыка', prefix: 'му', target: 'з', suffix: 'ыка', meaning: '音楽', ipa: '/ˈmuzɨkə/', targetSound: '[z]', explanation: '語中の з は [z]。' },
      { word: 'глаз', stressedWord: 'гла́з', prefix: 'гла', target: 'з', suffix: '', meaning: '目', ipa: '/ɡlas/', targetSound: '[s]', explanation: '語末なので з が無声化して [s]。' },
    ],
  },
  {
    id: 'pron-005',
    answer: 3,
    rule: '語末の в も無声化します。',
    choices: [
      { word: 'вода', stressedWord: 'вода́', prefix: '', target: 'в', suffix: 'ода', meaning: '水', ipa: '/vɐˈda/', targetSound: '[v]', explanation: '語頭の в は [v]。' },
      { word: 'ваза', stressedWord: 'ва́за', prefix: '', target: 'в', suffix: 'аза', meaning: '花瓶', ipa: '/ˈvazə/', targetSound: '[v]', explanation: '語頭の в は [v]。' },
      { word: 'новый', stressedWord: 'но́вый', prefix: 'но', target: 'в', suffix: 'ый', meaning: '新しい', ipa: '/ˈnovɨj/', targetSound: '[v]', explanation: '語中の в は [v]。' },
      { word: 'любовь', stressedWord: 'любо́вь', prefix: 'любо', target: 'в', suffix: 'ь', meaning: '愛', ipa: '/lʲʊˈbofʲ/', targetSound: '[fʲ]', explanation: '語末の в は無声化し、ь の影響で軟音の [fʲ]。' },
    ],
  },
  {
    id: 'pron-006',
    answer: 3,
    rule: 'アクセントのない о は弱化して、[o] とは異なる音になります。',
    choices: [
      { word: 'дом', stressedWord: 'до́м', prefix: 'д', target: 'о', suffix: 'м', meaning: '家', ipa: '/dom/', targetSound: '[o]', explanation: 'о にアクセントがあり [o]。' },
      { word: 'кот', stressedWord: 'ко́т', prefix: 'к', target: 'о', suffix: 'т', meaning: '猫', ipa: '/kot/', targetSound: '[o]', explanation: 'о にアクセントがあり [o]。' },
      { word: 'стол', stressedWord: 'сто́л', prefix: 'ст', target: 'о', suffix: 'л', meaning: '机', ipa: '/stol/', targetSound: '[o]', explanation: 'о にアクセントがあり [o]。' },
      { word: 'вода', stressedWord: 'вода́', prefix: 'в', target: 'о', suffix: 'да', meaning: '水', ipa: '/vɐˈda/', targetSound: '[ɐ]', explanation: '最初の о は無アクセントなので弱化して [ɐ] に近い音。' },
    ],
  },
  {
    id: 'pron-007',
    answer: 3,
    rule: 'что の ч は例外的に [ʂ]（ш の音）で発音します。',
    choices: [
      { word: 'чай', stressedWord: 'ча́й', prefix: '', target: 'ч', suffix: 'ай', meaning: 'お茶', ipa: '/tɕaj/', targetSound: '[tɕ]', explanation: 'ч は通常の [tɕ]。' },
      { word: 'час', stressedWord: 'ча́с', prefix: '', target: 'ч', suffix: 'ас', meaning: '時間・1時', ipa: '/tɕas/', targetSound: '[tɕ]', explanation: 'ч は通常の [tɕ]。' },
      { word: 'врач', stressedWord: 'вра́ч', prefix: 'вра', target: 'ч', suffix: '', meaning: '医者', ipa: '/vratɕ/', targetSound: '[tɕ]', explanation: '語末でも ч は [tɕ]。' },
      { word: 'что', stressedWord: 'что́', prefix: '', target: 'ч', suffix: 'то', meaning: '何', ipa: '/ʂto/', targetSound: '[ʂ]', explanation: 'что は綴り ч でも [ʂ] と発音する重要な例外。' },
    ],
  },
  {
    id: 'pron-008',
    answer: 3,
    rule: 'его́ などの -его́ の г は [v] と発音されます。',
    choices: [
      { word: 'гора', stressedWord: 'гора́', prefix: '', target: 'г', suffix: 'ора', meaning: '山', ipa: '/ɡɐˈra/', targetSound: '[ɡ]', explanation: '通常の г で [ɡ]。' },
      { word: 'газета', stressedWord: 'газе́та', prefix: '', target: 'г', suffix: 'азета', meaning: '新聞', ipa: '/ɡɐˈzʲetə/', targetSound: '[ɡ]', explanation: '通常の г で [ɡ]。' },
      { word: 'магазин', stressedWord: 'магази́н', prefix: 'ма', target: 'г', suffix: 'азин', meaning: '店', ipa: '/məɡɐˈzʲin/', targetSound: '[ɡ]', explanation: '語中の г は [ɡ]。' },
      { word: 'его', stressedWord: 'его́', prefix: 'е', target: 'г', suffix: 'о', meaning: '彼の・彼を', ipa: '/jɪˈvo/', targetSound: '[v]', explanation: 'его́ の г は綴りと異なり [v] と発音します。' },
    ],
  },
  {
    id: 'pron-009',
    answer: 3,
    rule: '無声子音は後ろの有声子音に影響されて有声化することがあります。',
    choices: [
      { word: 'сок', stressedWord: 'со́к', prefix: '', target: 'с', suffix: 'ок', meaning: 'ジュース', ipa: '/sok/', targetSound: '[s]', explanation: '語頭の с は [s]。' },
      { word: 'суп', stressedWord: 'су́п', prefix: '', target: 'с', suffix: 'уп', meaning: 'スープ', ipa: '/sup/', targetSound: '[s]', explanation: '語頭の с は [s]。' },
      { word: 'сын', stressedWord: 'сы́н', prefix: '', target: 'с', suffix: 'ын', meaning: '息子', ipa: '/sɨn/', targetSound: '[s]', explanation: '語頭の с は [s]。' },
      { word: 'сдать', stressedWord: 'сда́ть', prefix: '', target: 'с', suffix: 'дать', meaning: '提出する・試験に受かる', ipa: '/zdatʲ/', targetSound: '[z]', explanation: '後ろの有声子音 д に同化して с が [z] になります。' },
    ],
  },
  {
    id: 'pron-010',
    answer: 3,
    rule: '子音結合では、後ろの有声子音に合わせて前の子音が有声化する場合があります。',
    choices: [
      { word: 'кот', stressedWord: 'ко́т', prefix: '', target: 'к', suffix: 'от', meaning: '猫', ipa: '/kot/', targetSound: '[k]', explanation: '語頭の к は [k]。' },
      { word: 'книга', stressedWord: 'кни́га', prefix: '', target: 'к', suffix: 'нига', meaning: '本', ipa: '/ˈknʲiɡə/', targetSound: '[k]', explanation: 'кн- の к は [k]。' },
      { word: 'окно', stressedWord: 'окно́', prefix: 'о', target: 'к', suffix: 'но', meaning: '窓', ipa: '/ɐkˈno/', targetSound: '[k]', explanation: 'кн- の к は [k]。' },
      { word: 'вокзал', stressedWord: 'вокза́л', prefix: 'во', target: 'к', suffix: 'зал', meaning: '駅', ipa: '/vɐɡˈzal/', targetSound: '[ɡ]', explanation: '後ろの有声子音 з に同化して к が [ɡ] になります。' },
    ],
  },
]
