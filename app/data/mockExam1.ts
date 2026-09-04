export type MockChoiceQuestion = {
  kind: 'choice'
  id: string
  prompt: string
  choices: string[]
  answer: number
  answerText: string
  explanation: string
  translation?: string
  speechText?: string
}

export type MockInputField = {
  id: string
  label: string
  answer: string
  explanation: string
  displayAnswer?: string
  multiline?: boolean
  inputMode?: 'text' | 'number'
}

export type MockInputQuestion = {
  kind: 'input'
  id: string
  prompt: string
  fields: MockInputField[]
  completedSentence?: string
  translation?: string
  speechText?: string
  selfGrade?: boolean
}

export type MockQuestion = MockChoiceQuestion | MockInputQuestion

export type MockSection = {
  id: string
  roman: string
  title: string
  instruction: string
  questions: MockQuestion[]
}

export const mockExam1 = {
  id: 'mock-1',
  title: '模擬試験 第1回',
  durationMinutes: 60,
  totalQuestionCards: 60,
  totalAnswerFields: 71,
  sections: [
    {
      id: 'mock-1-section-1',
      roman: 'I',
      title: '発音',
      instruction: '下線部の発音が他の2つと異なる単語を1つ選びなさい。',
      questions: [
        {
          kind: 'choice',
          id: 'mock-1-s1-01',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['год̲', 'сад̲', 'д̲ом'],
          answer: 2,
          answerText: 'д̲ом',
          explanation: 'год と сад の語末の д は無声化して [т] に近く発音する。дом の д は語頭なので [д] の音になる。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-02',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['хлеб̲', 'дуб̲', 'б̲рат'],
          answer: 2,
          answerText: 'б̲рат',
          explanation: 'хлеб と дуб の語末の б は無声化して [п] に近くなる。брат の б は語頭なので [б] で発音する。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-03',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['ч̲то', 'ч̲ай', 'врач̲'],
          answer: 0,
          answerText: 'ч̲то',
          explanation: 'что の ч は重要な例外で [ш] に近く発音する。чай と врач の ч は通常の [ч]。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-04',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['ег̲о', 'г̲ора', 'г̲азета'],
          answer: 0,
          answerText: 'ег̲о',
          explanation: 'его の г は綴りどおりの [г] ではなく、[в] に近く発音する。гора と газета の г は通常の [г]。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-05',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['во̲да', 'до̲м', 'ко̲т'],
          answer: 0,
          answerText: 'во̲да',
          explanation: 'вода の最初の о は無アクセントで弱化する。дом と кот の о にはアクセントがあり、はっきり [о] と発音する。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-06',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['вок̲зал', 'к̲ошка', 'к̲нига'],
          answer: 0,
          answerText: 'вок̲зал',
          explanation: 'вокзал では к が後ろの有声子音 з の影響で有声化し、[г] に近くなる。кошка と книга の к は [к]。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s1-07',
          prompt: '次の3語のうち、下線部の発音が異なるものはどれか。',
          choices: ['глаз̲', 'раз̲', 'з̲има'],
          answer: 2,
          answerText: 'з̲има',
          explanation: 'глаз と раз の語末の з は無声化して [с] に近くなる。зима の з は語頭なので [з]。',
        },
      ],
    },
    {
      id: 'mock-1-section-2',
      roman: 'II',
      title: 'アクセント',
      instruction: 'アクセントの位置が他の2つと異なる単語を1つ選びなさい。',
      questions: [
        {
          kind: 'choice',
          id: 'mock-1-s2-01',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['дома', 'ручка', 'машина'],
          answer: 2,
          answerText: 'машина',
          explanation: 'дома と ручка は第1音節、машина は第2音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-02',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['работа', 'газета', 'книга'],
          answer: 2,
          answerText: 'книга',
          explanation: 'работа と газета は第2音節、книга は第1音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-03',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['улица', 'письмо', 'город'],
          answer: 1,
          answerText: 'письмо',
          explanation: 'улица と город は第1音節、письмо は第2音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-04',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['озеро', 'театр', 'радио'],
          answer: 1,
          answerText: 'театр',
          explanation: 'озеро と радио は第1音節、театр は第2音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-05',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['собака', 'минута', 'поезд'],
          answer: 2,
          answerText: 'поезд',
          explanation: 'собака と минута は第2音節、поезд は第1音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-06',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['молоко', 'хорошо', 'мороз'],
          answer: 2,
          answerText: 'мороз',
          explanation: 'молоко と хорошо は最後の音節、мороз は第2音節にアクセントがある。',
        },
        {
          kind: 'choice',
          id: 'mock-1-s2-07',
          prompt: 'アクセントの位置が異なる単語はどれか。',
          choices: ['мама', 'папа', 'семья'],
          answer: 2,
          answerText: 'семья',
          explanation: 'мама と папа は第1音節、семья は第2音節にアクセントがある。',
        },
      ],
    },
    {
      id: 'mock-1-section-3',
      roman: 'III',
      title: '名詞の性・数',
      instruction: '文の内容に合う он / она / оно / они を選びなさい。',
      questions: [
        {
          kind: 'choice',
          id: 'mock-1-s3-01',
          prompt: 'Вот дом. ___ большой.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 0,
          answerText: 'он',
          explanation: 'дом は男性名詞なので、代名詞は он。「彼」だけでなく男性名詞を受ける「それ」にも使う。',
          translation: 'これは家です。それは大きいです。',
          speechText: 'Э́то дом. Он большо́й.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-02',
          prompt: 'Вот машина. ___ новая.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 1,
          answerText: 'она',
          explanation: 'машина は -а で終わる女性名詞なので、代名詞は она。',
          translation: 'これは車です。それは新しいです。',
          speechText: 'Э́то маши́на. Она́ но́вая.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-03',
          prompt: 'Вот окно. ___ большое.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 2,
          answerText: 'оно',
          explanation: 'окно は -о で終わる中性名詞なので、代名詞は оно。',
          translation: 'これは窓です。それは大きいです。',
          speechText: 'Э́то окно́. Оно́ большо́е.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-04',
          prompt: 'Вот книги. ___ новые.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 3,
          answerText: 'они',
          explanation: 'книги は複数形なので、代名詞は они。',
          translation: 'これは本です。それらは新しいです。',
          speechText: 'Э́то кни́ги. Они́ но́вые.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-05',
          prompt: 'Вот тетрадь. ___ лежит на столе.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 1,
          answerText: 'она',
          explanation: 'тетрадь は -ь で終わる女性名詞。語尾だけでなく性を覚える必要がある。',
          translation: 'これはノートです。それは机の上にあります。',
          speechText: 'Э́то тетра́дь. Она́ лежи́т на столе́.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-06',
          prompt: 'Вот словарь. ___ лежит в сумке.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 0,
          answerText: 'он',
          explanation: 'словарь は -ь で終わる男性名詞。тетрадь などの女性名詞と区別する。',
          translation: 'これは辞書です。それはかばんの中にあります。',
          speechText: 'Э́то слова́рь. Он лежи́т в су́мке.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-07',
          prompt: 'Вот море. ___ спокойное.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 2,
          answerText: 'оно',
          explanation: 'мо́ре は -е で終わる中性名詞なので、代名詞は оно。',
          translation: 'これは海です。それは穏やかです。',
          speechText: 'Э́то мо́ре. Оно́ споко́йное.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s3-08',
          prompt: 'Вот студенты. ___ читают.',
          choices: ['он', 'она', 'оно', 'они'],
          answer: 3,
          answerText: 'они',
          explanation: 'студенты は複数形なので、代名詞は они。',
          translation: 'これは学生たちです。彼らは読んでいます。',
          speechText: 'Э́то студе́нты. Они́ чита́ют.',
        },
      ],
    },
    {
      id: 'mock-1-section-4',
      roman: 'IV',
      title: '名詞の複数形',
      instruction: '名詞を主格複数形に直し、アクセント位置も答えなさい。',
      questions: [
        {
          kind: 'input',
          id: 'mock-1-s4-01',
          prompt: 'город（町） →',
          fields: [
            { id: 'spelling', label: '複数形の綴り', answer: 'города', displayAnswer: 'города́', explanation: 'город → города́。複数形でアクセントが語末へ移る。' },
            { id: 'stress', label: 'アクセント位置', answer: '3', inputMode: 'number', explanation: 'アクセントは第3音節。' },
          ],
        },
        {
          kind: 'input',
          id: 'mock-1-s4-02',
          prompt: 'друг（友人） →',
          fields: [
            { id: 'spelling', label: '複数形の綴り', answer: 'друзья', displayAnswer: 'друзья́', explanation: 'друг → друзья́ は語幹も変化する不規則な複数形。' },
            { id: 'stress', label: 'アクセント位置', answer: '2', inputMode: 'number', explanation: 'アクセントは第2音節。' },
          ],
        },
        {
          kind: 'input',
          id: 'mock-1-s4-03',
          prompt: 'книга（本） →',
          fields: [
            { id: 'spelling', label: '複数形の綴り', answer: 'книги', displayAnswer: 'кни́ги', explanation: 'книга は複数形 кни́ги。к / г / х の後では ы ではなく и を使う。' },
            { id: 'stress', label: 'アクセント位置', answer: '1', inputMode: 'number', explanation: 'アクセントは第1音節。' },
          ],
        },
        {
          kind: 'input',
          id: 'mock-1-s4-04',
          prompt: 'окно（窓） →',
          fields: [
            { id: 'spelling', label: '複数形の綴り', answer: 'окна', displayAnswer: 'о́кна', explanation: 'окно́ → о́кна。中性名詞の -о が -а になる代表的な形。' },
            { id: 'stress', label: 'アクセント位置', answer: '1', inputMode: 'number', explanation: 'アクセントは第1音節。' },
          ],
        },
        {
          kind: 'input',
          id: 'mock-1-s4-05',
          prompt: 'человек（人） →',
          fields: [
            { id: 'spelling', label: '複数形の綴り', answer: 'люди', displayAnswer: 'лю́ди', explanation: 'челове́к の複数形は лю́ди という不規則形。' },
            { id: 'stress', label: 'アクセント位置', answer: '1', inputMode: 'number', explanation: 'アクセントは第1音節。' },
          ],
        },
      ],
    },
    {
      id: 'mock-1-section-5',
      roman: 'V',
      title: '格変化',
      instruction: '文脈に合う名詞句の形を1つ選びなさい。',
      questions: [
        {
          kind: 'choice',
          id: 'mock-1-s5-01',
          prompt: 'Здесь нет ___（新しい学生）.',
          choices: ['новый студент', 'нового студента', 'новому студенту'],
          answer: 1,
          answerText: 'нового студента',
          explanation: 'нет の後ろは生格。男性単数の形容詞・名詞が нового студента になる。',
          translation: 'ここには新しい学生がいません。',
          speechText: 'Зде́сь нет но́вого студе́нта.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-02',
          prompt: 'Я подошёл к ___（若い女性教師）.',
          choices: ['молодая учительница', 'молодой учительнице', 'молодую учительницу'],
          answer: 1,
          answerText: 'молодой учительнице',
          explanation: 'к は与格支配。女性単数では形容詞と名詞が молодой учительнице になる。',
          translation: '私は若い女性教師のところへ近づきました。',
          speechText: 'Я подошёл к молодо́й учи́тельнице.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-03',
          prompt: 'Я вижу ___（大きな町）.',
          choices: ['большой город', 'большого города', 'большому городу'],
          answer: 0,
          answerText: 'большой город',
          explanation: 'вижу の直接目的語は対格。無生物の男性単数は主格と同じ形なので большой город。',
          translation: '私は大きな町を見ます。',
          speechText: 'Я ви́жу большо́й го́род.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-04',
          prompt: 'Мы говорим о ___（ロシア語）.',
          choices: ['русский язык', 'русского языка', 'русском языке'],
          answer: 2,
          answerText: 'русском языке',
          explanation: 'о は前置格支配。「ロシア語について」は о русском языке となる。',
          translation: '私たちはロシア語について話しています。',
          speechText: 'Мы говори́м о ру́сском языке́.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-05',
          prompt: 'Я стою перед ___（新しい家）.',
          choices: ['нового дома', 'новым домом', 'новом доме'],
          answer: 1,
          answerText: 'новым домом',
          explanation: 'перед は造格支配。「〜の前に」は перед новым домом。',
          translation: '私は新しい家の前に立っています。',
          speechText: 'Я стою́ пе́ред но́вым до́мом.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-06',
          prompt: 'У меня нет ___（小さなアパート）.',
          choices: ['маленькая квартира', 'маленькой квартиры', 'маленькую квартиру'],
          answer: 1,
          answerText: 'маленькой квартиры',
          explanation: 'нет の後ろは生格。女性単数の形容詞・名詞が маленькой квартиры になる。',
          translation: '私は小さなアパートを持っていません。',
          speechText: 'У меня́ нет ма́ленькой кварти́ры.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-07',
          prompt: 'Она помогает ___（弟）.',
          choices: ['младший брат', 'младшему брату', 'младшего брата'],
          answer: 1,
          answerText: 'младшему брату',
          explanation: 'помогать は与格を取る動詞。「弟を助ける」は помогает младшему брату。',
          translation: '彼女は弟を助けています。',
          speechText: 'Она́ помога́ет мла́дшему бра́ту.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-08',
          prompt: 'Мы едем в ___（モスクワ）.',
          choices: ['Москва', 'Москве', 'Москву'],
          answer: 2,
          answerText: 'Москву',
          explanation: '移動の行き先を表す в の後ろは対格。Москва は Москву になる。',
          translation: '私たちはモスクワへ行きます。',
          speechText: 'Мы е́дем в Москву́.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-09',
          prompt: 'Он интересуется ___（ロシアの音楽）.',
          choices: ['русской музыкой', 'русскую музыку', 'русская музыка'],
          answer: 0,
          answerText: 'русской музыкой',
          explanation: 'интересоваться は造格を取る動詞。「ロシアの音楽に興味がある」は русской музыкой。',
          translation: '彼はロシアの音楽に興味があります。',
          speechText: 'Он интересу́ется ру́сской му́зыкой.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s5-10',
          prompt: 'Они говорят о ___（新しい本）.',
          choices: ['новую книгу', 'новой книге', 'новая книга'],
          answer: 1,
          answerText: 'новой книге',
          explanation: 'о の後ろは前置格。女性単数の「新しい本について」は о новой книге。',
          translation: '彼らは新しい本について話しています。',
          speechText: 'Они́ говоря́т о но́вой кни́ге.',
        },
      ],
    },
    {
      id: 'mock-1-section-6',
      roman: 'VI',
      title: '疑問文への応答',
      instruction: '質問に対する自然な応答を1つ選びなさい。',
      questions: [
        {
          kind: 'choice',
          id: 'mock-1-s6-01',
          prompt: 'Где ты живёшь?',
          choices: ['Я живу в Токио.', 'Я иду в Токио.', 'Потому что я в Токио.'],
          answer: 0,
          answerText: 'Я живу́ в То́кио.',
          explanation: 'Где は場所をたずねる。жить「住む」を使い、в + 前置格で現在地を答える。',
          translation: 'どこに住んでいますか。—私は東京に住んでいます。',
          speechText: 'Где́ ты живёшь? Я живу́ в То́кио.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s6-02',
          prompt: 'Куда она идёт?',
          choices: ['Она идёт в аптеку.', 'Она живёт в аптеке.', 'Она была в аптеке.'],
          answer: 0,
          answerText: 'Она́ идёт в апте́ку.',
          explanation: 'Куда は行き先をたずねる。идти́「歩いて行く」と в + 対格で答える。',
          translation: '彼女はどこへ行きますか。—彼女は薬局へ行きます。',
          speechText: 'Куда́ она́ идёт? Она́ идёт в апте́ку.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s6-03',
          prompt: 'Почему ты не работаешь?',
          choices: ['Потому что я болен.', 'Я работаю в офисе.', 'В девять часов.'],
          answer: 0,
          answerText: 'Потому́ что я бо́лен.',
          explanation: 'Почему は理由をたずねる。Потому что「なぜなら〜だから」で理由を答える。',
          translation: 'なぜ働いていないのですか。—病気だからです。',
          speechText: 'Почему́ ты не рабо́таешь? Потому́ что я бо́лен.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s6-04',
          prompt: 'Сколько стоит билет?',
          choices: ['Он стоит тысячу рублей.', 'Он едет в Москву.', 'Он лежит на столе.'],
          answer: 0,
          answerText: 'Он сто́ит ты́сячу рубле́й.',
          explanation: 'Сколько стоит は値段をたずねる表現。стоить「値段がする」を使って金額で答える。',
          translation: '切符はいくらですか。—1000ルーブルです。',
          speechText: 'Ско́лько сто́ит биле́т? Он сто́ит ты́сячу рубле́й.',
        },
        {
          kind: 'choice',
          id: 'mock-1-s6-05',
          prompt: 'Когда начинается урок?',
          choices: ['В девять часов.', 'В школу.', 'Потому что утром.'],
          answer: 0,
          answerText: 'В де́вять ча́сов.',
          explanation: 'Когда は時間をたずねる。時刻を表す в + 数詞句で答える。',
          translation: '授業はいつ始まりますか。—9時に始まります。',
          speechText: 'Когда́ начина́ется уро́к? В де́вять ча́сов.',
        },
      ],
    },
    {
      id: 'mock-1-section-7',
      roman: 'VII',
      title: '動詞の現在形',
      instruction: '文脈に合う動詞の現在形を、各空欄に記入しなさい。',
      questions: [
        {
          kind: 'input',
          id: 'mock-1-s7-01',
          prompt: 'читать（読む）：Я ___ книгу, а они ___ газету.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'читаю', displayAnswer: 'чита́ю', explanation: 'я に対応する читать の現在形は чита́ю。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'читают', displayAnswer: 'чита́ют', explanation: 'они́ に対応する читать の現在形は чита́ют。' },
          ],
          completedSentence: 'Я чита́ю кни́гу, а они́ чита́ют газе́ту.',
          translation: '私は本を読み、彼らは新聞を読みます。',
          speechText: 'Я чита́ю кни́гу, а они́ чита́ют газе́ту.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-02',
          prompt: 'писать（書く）：Ты ___ письмо, а мы ___ упражнение.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'пишешь', displayAnswer: 'пи́шешь', explanation: 'ты に対応する писать は語幹が変化し、пи́шешь になる。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'пишем', displayAnswer: 'пи́шем', explanation: 'мы に対応する писать の現在形は пи́шем。' },
          ],
          completedSentence: 'Ты пи́шешь письмо́, а мы пи́шем упражне́ние.',
          translation: 'あなたは手紙を書き、私たちは練習問題を書きます。',
          speechText: 'Ты пи́шешь письмо́, а мы пи́шем упражне́ние.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-03',
          prompt: 'жить（住む）：Он ___ в Москве, а вы ___ в Токио.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'живёт', displayAnswer: 'живёт', explanation: 'он に対応する жить は живёт。語幹が жив- になる。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'живёте', displayAnswer: 'живёте', explanation: 'вы に対応する жить は живёте。' },
          ],
          completedSentence: 'Он живёт в Москве́, а вы живёте в То́кио.',
          translation: '彼はモスクワに住み、あなたたちは東京に住みます。',
          speechText: 'Он живёт в Москве́, а вы живёте в То́кио.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-04',
          prompt: 'говорить（話す）：Она ___ по-русски, а они ___ по-японски.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'говорит', displayAnswer: 'говори́т', explanation: 'она́ に対応する говорить の現在形は говори́т。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'говорят', displayAnswer: 'говоря́т', explanation: 'они́ に対応する говорить の現在形は говоря́т。' },
          ],
          completedSentence: 'Она́ говори́т по-ру́сски, а они́ говоря́т по-япо́нски.',
          translation: '彼女はロシア語で話し、彼らは日本語で話します。',
          speechText: 'Она́ говори́т по-ру́сски, а они́ говоря́т по-япо́нски.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-05',
          prompt: 'любить（好きである）：Я ___ музыку, а он ___ кино.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'люблю', displayAnswer: 'люблю́', explanation: 'я に対応する любить は люблю́。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'любит', displayAnswer: 'лю́бит', explanation: 'он に対応する любить は лю́бит。' },
          ],
          completedSentence: 'Я люблю́ му́зыку, а он лю́бит кино́.',
          translation: '私は音楽が好きで、彼は映画が好きです。',
          speechText: 'Я люблю́ му́зыку, а он лю́бит кино́.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-06',
          prompt: 'хотеть（〜したい）：Мы ___ пить чай, а ты ___ есть.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'хотим', displayAnswer: 'хоти́м', explanation: 'мы に対応する хотеть は хоти́м。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'хочешь', displayAnswer: 'хо́чешь', explanation: 'ты に対応する хотеть は хо́чешь。' },
          ],
          completedSentence: 'Мы хоти́м пить чай, а ты хо́чешь есть.',
          translation: '私たちはお茶を飲みたくて、あなたは食べたいと思っています。',
          speechText: 'Мы хоти́м пить чай, а ты хо́чешь есть.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-07',
          prompt: 'мочь（〜できる）：Вы ___ помочь, а она ___ подождать.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'можете', displayAnswer: 'мо́жете', explanation: 'вы に対応する мочь は мо́жете。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'может', displayAnswer: 'мо́жет', explanation: 'она́ に対応する мочь は мо́жет。' },
          ],
          completedSentence: 'Вы мо́жете помо́чь, а она́ мо́жет подожда́ть.',
          translation: 'あなたたちは助けることができ、彼女は待つことができます。',
          speechText: 'Вы мо́жете помо́чь, а она́ мо́жет подожда́ть.',
        },
        {
          kind: 'input',
          id: 'mock-1-s7-08',
          prompt: 'идти（歩いて行く）：Я ___ в школу, а дети ___ в парк.',
          fields: [
            { id: 'first-spelling', label: '① 綴り', answer: 'иду', displayAnswer: 'иду́', explanation: 'я に対応する идти́ は不規則形の иду́。' },
            { id: 'second-spelling', label: '② 綴り', answer: 'идут', displayAnswer: 'иду́т', explanation: 'они́ に対応する идти́ は иду́т。' },
          ],
          completedSentence: 'Я иду́ в шко́лу, а де́ти иду́т в па́рк.',
          translation: '私は学校へ歩いて行き、子どもたちは公園へ歩いて行きます。',
          speechText: 'Я иду́ в шко́лу, а де́ти иду́т в па́рк.',
        },
      ],
    },
    {
      id: 'mock-1-section-8',
      roman: 'VIII',
      title: '過去形・未来形',
      instruction: '各文の動詞を、指定された時制の形で記入しなさい。',
      questions: [
        {
          kind: 'input',
          id: 'mock-1-s8-01',
          prompt: 'работать（働く）\n［過去］Вчера Анна ___ дома.\n［未来］Завтра Анна ___ дома.',
          fields: [
            { id: 'past', label: '過去形', answer: 'рабо́тала', explanation: 'А́нна は女性単数なので、過去形は рабо́тала。' },
            { id: 'future', label: '未来形', answer: 'бу́дет рабо́тать', explanation: '不完了体の未来は быть の未来形 + 不定形。А́нна には бу́дет рабо́тать。' },
          ],
          completedSentence: 'Вчера́ А́нна рабо́тала до́ма. За́втра А́нна бу́дет рабо́тать до́ма.',
          translation: '昨日アンナは家で働きました。明日アンナは家で働くでしょう。',
          speechText: 'Вчера́ А́нна рабо́тала до́ма. За́втра А́нна бу́дет рабо́тать до́ма.',
        },
        {
          kind: 'input',
          id: 'mock-1-s8-02',
          prompt: 'читать（読む）\n［過去］Вчера мы ___ книгу.\n［未来］Завтра мы ___ книгу.',
          fields: [
            { id: 'past', label: '過去形', answer: 'чита́ли', explanation: 'мы は複数なので、過去形は чита́ли。' },
            { id: 'future', label: '未来形', answer: 'бу́дем чита́ть', explanation: 'мы に対応する быть の未来形は бу́дем。' },
          ],
          completedSentence: 'Вчера́ мы чита́ли кни́гу. За́втра мы бу́дем чита́ть кни́гу.',
          translation: '昨日私たちは本を読みました。明日私たちは本を読むでしょう。',
          speechText: 'Вчера́ мы чита́ли кни́гу. За́втра мы бу́дем чита́ть кни́гу.',
        },
        {
          kind: 'input',
          id: 'mock-1-s8-03',
          prompt: 'идти（歩いて行く）\n［過去］Вчера вы ___ в школу.\n［未来］Завтра вы ___ в школу.',
          fields: [
            { id: 'past', label: '過去形', answer: 'шли́', explanation: 'вы は複数なので、идти́ の過去形は шли́。' },
            { id: 'future', label: '未来形', answer: 'бу́дете идти́', explanation: 'вы に対応する быть の未来形は бу́дете。' },
          ],
          completedSentence: 'Вчера́ вы шли́ в шко́лу. За́втра вы бу́дете идти́ в шко́лу.',
          translation: '昨日あなたたちは学校へ歩いて行きました。明日あなたたちは学校へ歩いて行くでしょう。',
          speechText: 'Вчера́ вы шли́ в шко́лу. За́втра вы бу́дете идти́ в шко́лу.',
        },
        {
          kind: 'input',
          id: 'mock-1-s8-04',
          prompt: 'учиться（学ぶ）\n［過去］Вчера они ___ в университете.\n［未来］Завтра они ___ в университете.',
          fields: [
            { id: 'past', label: '過去形', answer: 'учи́лись', explanation: 'они́ は複数なので、-ся 動詞の過去形は учи́лись。' },
            { id: 'future', label: '未来形', answer: 'бу́дут учи́ться', explanation: 'они́ に対応する быть の未来形は бу́дут。' },
          ],
          completedSentence: 'Вчера́ они́ учи́лись в университе́те. За́втра они́ бу́дут учи́ться в университе́те.',
          translation: '昨日彼らは大学で学びました。明日彼らは大学で学ぶでしょう。',
          speechText: 'Вчера́ они́ учи́лись в университе́те. За́втра они́ бу́дут учи́ться в университе́те.',
        },
      ],
    },
    {
      id: 'mock-1-section-9',
      roman: 'IX',
      title: '露文和訳',
      instruction: '次のロシア語を日本語に訳しなさい。提出後に模範訳と比べて自己採点してください。',
      questions: [
        {
          kind: 'input',
          id: 'mock-1-s9-01',
          selfGrade: true,
          prompt: 'Меня зовут Ира. Я живу с мамой, папой и братом в новой квартире. У нас есть большая кухня и две маленькие комнаты. Утром я встаю в семь часов и иду в школу. Мой брат ещё маленький. После школы я обедаю дома и читаю книгу. Потом я смотрю телевизор или играю с братом. Вечером папа приходит домой, а мама готовит ужин. Мы ужинаем вместе. По воскресеньям мы ходим в магазин и гуляем в парке.',
          fields: [
            {
              id: 'answer',
              label: '自分の日本語訳',
              answer: '私の名前はイーラです。私は母、父、そして兄（弟）と一緒に新しいアパートに住んでいます。私たちには大きな台所と2つの小さな部屋があります。朝、私は7時に起きて学校へ行きます。弟（兄）はまだ小さいです。学校の後、私は家で昼食を食べて本を読みます。それからテレビを見たり、弟（兄）と遊んだりします。夜、父は家に帰り、母は夕食を作ります。私たちは一緒に夕食を食べます。日曜日には、私たちは店へ行き、公園を散歩します。',
              explanation: 'жить с + 造格は「〜と一緒に住む」。у нас есть は「私たちには〜がある」。после школы は「学校の後」。или は「または・〜たり」。по воскресеньям は「毎週日曜日に」。',
              multiline: true,
            },
          ],
          speechText: 'Меня́ зову́т И́ра. Я живу́ с ма́мой, па́пой и бра́том в но́вой кварти́ре. У нас есть больша́я ку́хня и две ма́ленькие ко́мнаты. У́тром я встаю́ в семь ча́сов и иду́ в шко́лу. Мой брат ещё ма́ленький. По́сле шко́лы я обе́даю до́ма и чита́ю кни́гу. По́том я смотрю́ телеви́зор и́ли игра́ю с бра́том. Ве́чером па́па прихо́дит до́мой, а ма́ма гото́вит у́жин. Мы у́жинаем вме́сте. По воскресе́ньям мы хо́дим в магази́н и гуля́ем в па́рке.',
        },
      ],
    },
  ] as MockSection[],
} satisfies {
  id: string
  title: string
  durationMinutes: number
  totalQuestionCards: number
  totalAnswerFields: number
  sections: MockSection[]
}
