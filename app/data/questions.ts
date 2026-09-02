import type { MultipleChoiceQuestion } from '../types/question'

export const questions: MultipleChoiceQuestion[] = [
  {
    id: 'prep-001',
    category: 'preposition',
    prompt: 'Я живу ___ Москве.',
    answer: 'в',
    correctExplanation: '`в + 前置格` で、都市など「〜に／〜で」を表します。Москва は前置格で Москве になります。',
    choices: [
      { value: 'в', explanation: '都市・国・建物の中などの場所を表すときに使います。例: в Москве（モスクワで）' },
      { value: 'на', explanation: '特定の場所・活動の場などで使います。例: на работе（職場で）, на стадионе（スタジアムで）' },
      { value: 'из', explanation: '「〜から／〜の中から」。後ろは生格です。例: из Москвы（モスクワから）' },
      { value: 'к', explanation: '「〜のところへ／〜に向かって」。後ろは与格です。例: к врачу（医者のところへ）' },
    ],
  },
  {
    id: 'prep-002',
    category: 'preposition',
    prompt: 'Я иду ___ врачу.',
    answer: 'к',
    correctExplanation: '`к + 与格` で、人や物の「ところへ／方向へ」を表します。врач は与格で врачу になります。',
    choices: [
      { value: 'к', explanation: '人・物への方向を表します。例: к врачу（医者のところへ）, к другу（友人のところへ）' },
      { value: 'у', explanation: '「〜のそばに」「〜のところに」「〜が持っている」。後ろは生格です。例: у врача（医者のところで）' },
      { value: 'из', explanation: '「〜から／〜の中から」。後ろは生格です。例: из школы（学校から）' },
      { value: 'с', explanation: '「〜から／〜の上から」。後ろは生格です。例: с работы（仕事から）, со стола（机の上から）' },
    ],
  },
  {
    id: 'prep-003',
    category: 'preposition',
    prompt: 'Мы приехали ___ Японии.',
    answer: 'из',
    correctExplanation: '`из + 生格` で、国・都市・建物などの「中から／〜から」を表します。Япония は生格で Японии になります。',
    choices: [
      { value: 'из', explanation: '「〜から／〜の中から」。例: из Японии（日本から）, из дома（家から）' },
      { value: 'в', explanation: '方向なら `в + 対格`、場所なら `в + 前置格`。例: в Японию（日本へ）, в Японии（日本で）' },
      { value: 'на', explanation: '方向なら `на + 対格`、場所なら `на + 前置格`。例: на работу（職場へ）, на работе（職場で）' },
      { value: 'к', explanation: '人・物への方向を表し、後ろは与格です。例: к преподавателю（先生のところへ）' },
    ],
  },
  {
    id: 'prep-004',
    category: 'preposition',
    prompt: 'Книга лежит ___ столе.',
    answer: 'на',
    correctExplanation: '`на + 前置格` で「〜の上にある」を表します。стол は前置格で столе になります。',
    choices: [
      { value: 'на', explanation: '物理的な「〜の上に」や一部の場所を表します。例: на столе（机の上に）' },
      { value: 'в', explanation: '「〜の中に」。例: в столе（机の中に）。この文では本が机の上にあるので意味が変わります。' },
      { value: 'из', explanation: '「〜の中から」。後ろは生格です。例: из стола（机の中から）' },
      { value: 'к', explanation: '「〜のところへ／〜に向かって」。後ろは与格です。例: к столу（机のところへ）' },
    ],
  },
  {
    id: 'prep-005',
    category: 'preposition',
    prompt: 'Я вернулся ___ работы.',
    answer: 'с',
    correctExplanation: '`с + 生格` で、`на` と組み合わせて使う場所から「〜から戻る」を表します。`на работу ↔ с работы` の組み合わせです。',
    choices: [
      { value: 'с', explanation: '`на` を使う場所から離れるときによく使います。例: с работы（職場から）, со стадиона（スタジアムから）' },
      { value: 'из', explanation: '`в` を使う場所の中から出るときによく使います。例: из школы（学校から）, из Москвы（モスクワから）' },
      { value: 'на', explanation: '方向なら `на + 対格`。例: на работу（職場へ）。ここでは「戻ってきた」ので方向が逆です。' },
      { value: 'к', explanation: '人・物への方向を表します。例: к другу（友人のところへ）。出発点を表す前置詞ではありません。' },
    ],
  },
]
