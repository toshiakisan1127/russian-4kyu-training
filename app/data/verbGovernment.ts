export type VerbGovernmentRole = {
  label: string
  caseLabel: string
  question?: string
}

export type VerbGovernment = {
  pattern: string
  roles: readonly VerbGovernmentRole[]
  note?: string
  example: {
    sentence: string
    translation: string
  }
}

export const verbGovernmentByWord: Record<string, VerbGovernment> = {
  говорить: {
    pattern: 'говорить кому? / с кем? / о чём?',
    roles: [
      { label: '話す相手・伝える相手', caseLabel: '与格', question: 'кому?' },
      { label: '会話の相手（с と一緒）', caseLabel: '造格', question: 'с кем?' },
      { label: '話題（о と一緒）', caseLabel: '前置格', question: 'о чём?' },
    ],
    example: { sentence: 'Я говорю́ с дру́гом о рабо́те.', translation: '私は友人と仕事について話しています。' },
  },
  думать: {
    pattern: 'думать о ком? / о чём?',
    roles: [
      { label: '考える対象（о と一緒）', caseLabel: '前置格', question: 'о ком? / о чём?' },
    ],
    example: { sentence: 'Я ду́маю о семье́.', translation: '私は家族のことを考えています。' },
  },
  давать: {
    pattern: 'давать кому? что?',
    roles: [
      { label: '受け取る人', caseLabel: '与格', question: 'кому?' },
      { label: '与えるもの', caseLabel: '対格', question: 'что?' },
    ],
    example: { sentence: 'Я даю́ дру́гу кни́гу.', translation: '私は友人に本を渡します。' },
  },
  писать: {
    pattern: 'писать кому? что?',
    roles: [
      { label: '書き送る相手', caseLabel: '与格', question: 'кому?' },
      { label: '書くもの', caseLabel: '対格', question: 'что?' },
    ],
    example: { sentence: 'Я пишу́ ма́ме письмо́.', translation: '私は母に手紙を書いています。' },
  },
  слушать: {
    pattern: 'слушать кого? / что?',
    roles: [
      { label: '聞く人・もの', caseLabel: '対格', question: 'кого? / что?' },
    ],
    note: '「聞こえる」の слышать とは違い、意識して「聞く」動詞です。',
    example: { sentence: 'Я слу́шаю му́зыку.', translation: '私は音楽を聞いています。' },
  },
  бояться: {
    pattern: 'бояться кого? / чего?',
    roles: [
      { label: '恐れる人・もの', caseLabel: '生格', question: 'кого? / чего?' },
    ],
    note: '日本語では目的語に見えますが、対格ではなく生格を取る代表的な動詞です。',
    example: { sentence: 'Ребёнок бои́тся соба́к.', translation: 'その子どもは犬を怖がります。' },
  },
  просить: {
    pattern: 'просить кого? о чём?',
    roles: [
      { label: '頼む相手', caseLabel: '対格', question: 'кого?' },
      { label: '頼む内容（о と一緒）', caseLabel: '前置格', question: 'о чём?' },
    ],
    example: { sentence: 'Я прошу́ дру́га о по́мощи.', translation: '私は友人に助けを頼みます。' },
  },
  показывать: {
    pattern: 'показывать кому? что?',
    roles: [
      { label: '見せる相手', caseLabel: '与格', question: 'кому?' },
      { label: '見せるもの', caseLabel: '対格', question: 'что?' },
    ],
    example: { sentence: 'Она́ пока́зывает мне фотогра́фию.', translation: '彼女は私に写真を見せます。' },
  },
  называть: {
    pattern: 'называть кого? кем? / чем?',
    roles: [
      { label: '呼ばれる人・もの', caseLabel: '対格', question: 'кого? / что?' },
      { label: '呼び名・評価', caseLabel: '造格', question: 'кем? / чем?' },
    ],
    example: { sentence: 'Его́ называ́ют хоро́шим вра́чом.', translation: '彼はよい医者だと呼ばれています。' },
  },
  спрашивать: {
    pattern: 'спрашивать кого? о чём?',
    roles: [
      { label: '質問する相手', caseLabel: '対格', question: 'кого?' },
      { label: '質問する話題（о と一緒）', caseLabel: '前置格', question: 'о чём?' },
    ],
    note: 'у + 生格で「〜のところに尋ねる」という形もよく使います。',
    example: { sentence: 'Я спра́шиваю учи́теля об экза́мене.', translation: '私は先生に試験について尋ねます。' },
  },
  играть: {
    pattern: 'играть во что? / на чём?',
    roles: [
      { label: 'スポーツ・ゲーム（в と一緒）', caseLabel: '対格', question: 'во что?' },
      { label: '楽器（на と一緒）', caseLabel: '前置格', question: 'на чём?' },
    ],
    example: { sentence: 'Он игра́ет в футбо́л и на скри́пке.', translation: '彼はサッカーをし、バイオリンも弾きます。' },
  },
  следовать: {
    pattern: 'следовать кому? / чему?',
    roles: [
      { label: '従う人・規則', caseLabel: '与格', question: 'кому? / чему?' },
    ],
    example: { sentence: 'Мы сле́дуем пра́вилу.', translation: '私たちは規則に従います。' },
  },
  отвечать: {
    pattern: 'отвечать кому? / на что?',
    roles: [
      { label: '答える相手', caseLabel: '与格', question: 'кому?' },
      { label: '答える質問（на と一緒）', caseLabel: '対格', question: 'на что?' },
    ],
    example: { sentence: 'Я отвеча́ю учи́телю на вопро́с.', translation: '私は先生の質問に答えます。' },
  },
  верить: {
    pattern: 'верить кому? / верить в кого? во что?',
    roles: [
      { label: '人・言葉を信じる', caseLabel: '与格', question: 'кому?' },
      { label: '存在・価値などを信じる（в と一緒）', caseLabel: '対格', question: 'в кого? / во что?' },
    ],
    example: { sentence: 'Я ве́рю дру́гу.', translation: '私は友人を信じています。' },
  },
  звать: {
    pattern: 'кого? зовут + имя',
    roles: [
      { label: '名前を持つ人', caseLabel: '対格', question: 'кого?' },
      { label: '名前', caseLabel: '主格', question: 'кто? / что?' },
    ],
    note: '「Меня зовут ...（私の名前は…です）」では、本人を対格にし、名前は主格の形で置きます。зовут は3人称複数形です。',
    example: { sentence: 'Меня́ зову́т То́си.', translation: '私の名前はトシです。' },
  },
  заниматься: {
    pattern: 'заниматься кем? / чем?',
    roles: [
      { label: '取り組むこと・勉強する科目', caseLabel: '造格', question: 'чем?' },
    ],
    note: '「〜を勉強する」でも対格ではなく造格を取るのが重要です。',
    example: { sentence: 'Я занима́юсь ру́сским языко́м.', translation: '私はロシア語を勉強しています。' },
  },
  нравиться: {
    pattern: 'кому? нравится кто? / что?',
    roles: [
      { label: '好きだと感じる人', caseLabel: '与格', question: 'кому?' },
      { label: '気に入られる人・もの', caseLabel: '主格', question: 'кто? / что?' },
    ],
    note: '日本語の「私は〜が好き」と格の対応が逆に見える代表例です。動詞は主格のものに一致します。',
    example: { sentence: 'Мне нра́вится э́та кни́га.', translation: '私はこの本が好きです。' },
  },
  смеяться: {
    pattern: 'смеяться над кем? / чем?',
    roles: [
      { label: '笑う対象（над と一緒）', caseLabel: '造格', question: 'над кем? / чем?' },
    ],
    example: { sentence: 'Они́ смею́тся над шу́ткой.', translation: '彼らはその冗談を笑っています。' },
  },
  улыбаться: {
    pattern: 'улыбаться кому?',
    roles: [
      { label: '微笑みかける相手', caseLabel: '与格', question: 'кому?' },
    ],
    example: { sentence: 'Она́ улыба́ется ребёнку.', translation: '彼女は子どもに微笑みかけます。' },
  },
  приносить: {
    pattern: 'приносить кому? что?',
    roles: [
      { label: '持って来る相手', caseLabel: '与格', question: 'кому?' },
      { label: '持って来るもの', caseLabel: '対格', question: 'что?' },
    ],
    example: { sentence: 'Он прино́сит мне во́ду.', translation: '彼は私に水を持って来ます。' },
  },
  соглашаться: {
    pattern: 'соглашаться с кем? / чем?',
    roles: [
      { label: '同意する相手・内容（с と一緒）', caseLabel: '造格', question: 'с кем? / чем?' },
    ],
    example: { sentence: 'Я соглаша́юсь с дру́гом.', translation: '私は友人に同意します。' },
  },
  звонить: {
    pattern: 'звонить кому?',
    roles: [
      { label: '電話する相手', caseLabel: '与格', question: 'кому?' },
    ],
    note: '日本語では「〜に電話する」。ロシア語でも相手は与格です。',
    example: { sentence: 'Я звоню́ ма́ме.', translation: '私は母に電話します。' },
  },
  платить: {
    pattern: 'платить кому? / за что?',
    roles: [
      { label: '支払う相手', caseLabel: '与格', question: 'кому?' },
      { label: '代金を払う対象（за と一緒）', caseLabel: '対格', question: 'за что?' },
    ],
    example: { sentence: 'Я плачу́ за биле́т.', translation: '私は切符代を払います。' },
  },
  помогать: {
    pattern: 'помогать кому?',
    roles: [
      { label: '助ける相手', caseLabel: '与格', question: 'кому?' },
    ],
    note: '日本語では目的語に見えますが、「人を助ける」の人は対格ではなく与格です。',
    example: { sentence: 'Я помога́ю дру́гу.', translation: '私は友人を助けます。' },
  },
  встречаться: {
    pattern: 'встречаться с кем?',
    roles: [
      { label: '会う相手（с と一緒）', caseLabel: '造格', question: 'с кем?' },
    ],
    example: { sentence: 'Я встреча́юсь с дру́гом.', translation: '私は友人と会います。' },
  },
  пользоваться: {
    pattern: 'пользоваться кем? / чем?',
    roles: [
      { label: '利用するもの', caseLabel: '造格', question: 'чем?' },
    ],
    note: '「〜を使う」でも対格ではなく造格を取ります。',
    example: { sentence: 'Я по́льзуюсь слова́рём.', translation: '私は辞書を使います。' },
  },
  готовиться: {
    pattern: 'готовиться к кому? / чему?',
    roles: [
      { label: '準備する対象（к と一緒）', caseLabel: '与格', question: 'к чему?' },
    ],
    example: { sentence: 'Я гото́влюсь к экза́мену.', translation: '私は試験の準備をしています。' },
  },
  отправлять: {
    pattern: 'отправлять кому? что?',
    roles: [
      { label: '送る相手', caseLabel: '与格', question: 'кому?' },
      { label: '送るもの', caseLabel: '対格', question: 'что?' },
    ],
    example: { sentence: 'Я отправля́ю дру́гу письмо́.', translation: '私は友人に手紙を送ります。' },
  },
  интересоваться: {
    pattern: 'интересоваться кем? / чем?',
    roles: [
      { label: '興味の対象', caseLabel: '造格', question: 'кем? / чем?' },
    ],
    note: '語彙プールに今後追加した場合にも使えるよう、代表的な格支配として登録しています。',
    example: { sentence: 'Я интересу́юсь му́зыкой.', translation: '私は音楽に興味があります。' },
  },
}
