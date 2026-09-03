export type Section6Question = {
  id: string
  keyword: string
  keywordMeaning: string
  question: string
  correctAnswer: string
  choices: string[]
  explanation: string
}

type QuestionGroup = {
  keyword: string
  keywordMeaning: string
  explanation: string
  rows: readonly { question: string; answer: string }[]
}

const groups: QuestionGroup[] = [
  {
    keyword: 'Кто',
    keywordMeaning: '誰',
    explanation: 'кто は人をたずねる疑問詞。答えには人・人物名・職業などが来る。',
    rows: [
      { question: 'Кто это?', answer: 'Это мой брат.' },
      { question: 'Кто работает в школе?', answer: 'Там работает моя мама.' },
      { question: 'Кто говорит по-русски?', answer: 'Анна говорит по-русски.' },
      { question: 'Кто живёт в этом доме?', answer: 'Здесь живёт мой друг.' },
      { question: 'Кто ваш учитель?', answer: 'Наш учитель — Иван Петрович.' },
      { question: 'Кто идёт в парк?', answer: 'Моя сестра идёт в парк.' },
      { question: 'Кто играет в футбол?', answer: 'Мой брат играет в футбол.' },
      { question: 'Кто звонит?', answer: 'Это Ольга.' },
      { question: 'Кто читает книгу?', answer: 'Студент читает книгу.' },
      { question: 'Кто сейчас дома?', answer: 'Папа сейчас дома.' },
    ],
  },
  {
    keyword: 'Что',
    keywordMeaning: '何',
    explanation: 'что は物・内容・行為などを「何」とたずねる疑問詞。',
    rows: [
      { question: 'Что это?', answer: 'Это словарь.' },
      { question: 'Что ты читаешь?', answer: 'Я читаю газету.' },
      { question: 'Что лежит на столе?', answer: 'На столе лежит книга.' },
      { question: 'Что вы пьёте?', answer: 'Я пью чай.' },
      { question: 'Что он покупает?', answer: 'Он покупает билет.' },
      { question: 'Что мы учим?', answer: 'Мы учим русский язык.' },
      { question: 'Что она готовит?', answer: 'Она готовит суп.' },
      { question: 'Что ты пишешь?', answer: 'Я пишу письмо.' },
      { question: 'Что стоит у окна?', answer: 'У окна стоит стол.' },
      { question: 'Что дети смотрят?', answer: 'Они смотрят фильм.' },
    ],
  },
  {
    keyword: 'Где',
    keywordMeaning: 'どこで・どこに',
    explanation: 'где は人や物がいる・ある場所をたずねる。移動先ではなく現在地を答える。',
    rows: [
      { question: 'Где работает Павел?', answer: 'Он работает в банке.' },
      { question: 'Где книга?', answer: 'Она на столе.' },
      { question: 'Где ты живёшь?', answer: 'Я живу в Москве.' },
      { question: 'Где дети?', answer: 'Они в школе.' },
      { question: 'Где мы встречаемся?', answer: 'Мы встречаемся у метро.' },
      { question: 'Где стоит машина?', answer: 'Она стоит перед домом.' },
      { question: 'Где мама?', answer: 'Она на кухне.' },
      { question: 'Где ваш университет?', answer: 'Он в центре города.' },
      { question: 'Где ты занимаешься?', answer: 'Я занимаюсь в библиотеке.' },
      { question: 'Где лежат ключи?', answer: 'Они лежат в сумке.' },
    ],
  },
  {
    keyword: 'Куда',
    keywordMeaning: 'どこへ',
    explanation: 'куда́ は移動の行き先・方向をたずねる。「〜へ行く」に対応する答えを選ぶ。',
    rows: [
      { question: 'Куда ты идёшь?', answer: 'Я иду в школу.' },
      { question: 'Куда едет Анна?', answer: 'Она едет в Москву.' },
      { question: 'Куда вы идёте после работы?', answer: 'Мы идём домой.' },
      { question: 'Куда он несёт книгу?', answer: 'Он несёт её в библиотеку.' },
      { question: 'Куда дети бегут?', answer: 'Они бегут в парк.' },
      { question: 'Куда идёт автобус?', answer: 'Он идёт к вокзалу.' },
      { question: 'Куда вы летите летом?', answer: 'Мы летим в Россию.' },
      { question: 'Куда она пошла?', answer: 'Она пошла в магазин.' },
      { question: 'Куда вы едете утром?', answer: 'Мы едем в университет.' },
      { question: 'Куда ты идёшь сейчас?', answer: 'Я иду к врачу.' },
    ],
  },
  {
    keyword: 'Откуда',
    keywordMeaning: 'どこから',
    explanation: 'отку́да は出発点・出身地・由来を「どこから」とたずねる。',
    rows: [
      { question: 'Откуда вы?', answer: 'Я из Японии.' },
      { question: 'Откуда он приехал?', answer: 'Он приехал из России.' },
      { question: 'Откуда ты идёшь?', answer: 'Я иду из школы.' },
      { question: 'Откуда Анна вернулась?', answer: 'Она вернулась с работы.' },
      { question: 'Откуда этот поезд?', answer: 'Он из Москвы.' },
      { question: 'Откуда у тебя эта книга?', answer: 'Я взял её из библиотеки.' },
      { question: 'Откуда пришла мама?', answer: 'Она пришла из магазина.' },
      { question: 'Откуда вы едете?', answer: 'Мы едем с вокзала.' },
      { question: 'Откуда письмо?', answer: 'Оно из России.' },
      { question: 'Откуда дети возвращаются?', answer: 'Они возвращаются из школы.' },
    ],
  },
  {
    keyword: 'Когда',
    keywordMeaning: 'いつ',
    explanation: 'когда́ は時・曜日・月・時間帯などを「いつ」とたずねる。',
    rows: [
      { question: 'Когда начинается урок?', answer: 'В девять часов.' },
      { question: 'Когда ты работаешь?', answer: 'С понедельника по пятницу.' },
      { question: 'Когда вы едете в Москву?', answer: 'Завтра утром.' },
      { question: 'Когда у тебя экзамен?', answer: 'В пятницу.' },
      { question: 'Когда ты читаешь?', answer: 'Вечером.' },
      { question: 'Когда приходит поезд?', answer: 'В семь часов.' },
      { question: 'Когда день рождения Анны?', answer: 'В мае.' },
      { question: 'Когда вы отдыхаете?', answer: 'Летом.' },
      { question: 'Когда магазин закрывается?', answer: 'В восемь вечера.' },
      { question: 'Когда мы встречаемся?', answer: 'После работы.' },
    ],
  },
  {
    keyword: 'Почему',
    keywordMeaning: 'なぜ',
    explanation: 'почему́ は理由をたずねる。потому́ что ...「なぜなら〜だから」で答える形が基本。',
    rows: [
      { question: 'Почему ты учишь русский?', answer: 'Потому что мне нравится русский язык.' },
      { question: 'Почему он дома?', answer: 'Потому что он сегодня не работает.' },
      { question: 'Почему ты пьёшь воду?', answer: 'Потому что я хочу пить.' },
      { question: 'Почему она идёт в аптеку?', answer: 'Потому что ей нужно лекарство.' },
      { question: 'Почему дети рады?', answer: 'Потому что сегодня праздник.' },
      { question: 'Почему вы едете на автобусе?', answer: 'Потому что метро закрыто.' },
      { question: 'Почему он читает эту книгу?', answer: 'Потому что завтра экзамен.' },
      { question: 'Почему ты открыл окно?', answer: 'Потому что здесь жарко.' },
      { question: 'Почему Анна не пришла?', answer: 'Потому что она больна.' },
      { question: 'Почему вы говорите тихо?', answer: 'Потому что ребёнок спит.' },
    ],
  },
  {
    keyword: 'Как',
    keywordMeaning: 'どのように・どう',
    explanation: 'как は方法・状態・様子を「どう・どのように」とたずねる。',
    rows: [
      { question: 'Как тебя зовут?', answer: 'Меня зовут Таро.' },
      { question: 'Как ты себя чувствуешь?', answer: 'Хорошо, спасибо.' },
      { question: 'Как ты говоришь по-русски?', answer: 'Пока немного.' },
      { question: 'Как вы едете на работу?', answer: 'На поезде.' },
      { question: 'Как он готовит суп?', answer: 'Очень хорошо.' },
      { question: 'Как твои дела?', answer: 'Всё хорошо, спасибо.' },
      { question: 'Как сегодня погода?', answer: 'Сегодня тепло.' },
      { question: 'Как ты учишь слова?', answer: 'Я читаю и повторяю их.' },
      { question: 'Как Анна играет на скрипке?', answer: 'Она играет очень хорошо.' },
      { question: 'Как вы отдыхаете летом?', answer: 'Мы ездим на море.' },
    ],
  },
  {
    keyword: 'Сколько',
    keywordMeaning: 'いくつ・どれくらい',
    explanation: 'ско́лько は数・量・年齢・値段などをたずねる疑問詞。数字や数量で答える。',
    rows: [
      { question: 'Сколько тебе лет?', answer: 'Мне тридцать лет.' },
      { question: 'Сколько стоит билет?', answer: 'Он стоит пятьсот рублей.' },
      { question: 'Сколько книг на столе?', answer: 'На столе три книги.' },
      { question: 'Сколько студентов в группе?', answer: 'В группе десять студентов.' },
      { question: 'Сколько времени?', answer: 'Сейчас два часа.' },
      { question: 'Сколько дней ты работаешь?', answer: 'Пять дней в неделю.' },
      { question: 'Сколько яблок ты купил?', answer: 'Я купил четыре яблока.' },
      { question: 'Сколько комнат в квартире?', answer: 'В квартире две комнаты.' },
      { question: 'Сколько уроков сегодня?', answer: 'Сегодня три урока.' },
      { question: 'Сколько братьев у тебя?', answer: 'У меня один брат.' },
    ],
  },
  {
    keyword: 'Какой',
    keywordMeaning: 'どんな・どの',
    explanation: 'како́й / кака́я / како́е は名詞の性に合わせて「どんな・どの」と性質や種類をたずねる。',
    rows: [
      { question: 'Какой это город?', answer: 'Это большой город.' },
      { question: 'Какая сегодня погода?', answer: 'Сегодня хорошая погода.' },
      { question: 'Какой фильм вы смотрите?', answer: 'Мы смотрим русский фильм.' },
      { question: 'Какая у тебя машина?', answer: 'У меня новая машина.' },
      { question: 'Какое это письмо?', answer: 'Это важное письмо.' },
      { question: 'Какой чай ты любишь?', answer: 'Я люблю чёрный чай.' },
      { question: 'Какая книга на столе?', answer: 'Там новая книга.' },
      { question: 'Какое море вы видели?', answer: 'Мы видели Чёрное море.' },
      { question: 'Какой у вас номер?', answer: 'У нас номер десять.' },
      { question: 'Какой язык ты учишь?', answer: 'Я учу русский язык.' },
    ],
  },
]

export const section6Questions: Section6Question[] = groups.flatMap((group, groupIndex) =>
  group.rows.map((row, rowIndex) => {
    const distractorA = groups[(groupIndex + 1) % groups.length]!.rows[rowIndex]!.answer
    const distractorB = groups[(groupIndex + 3) % groups.length]!.rows[(rowIndex + 1) % 10]!.answer
    const choices = [row.answer, distractorA, distractorB]

    if (new Set(choices).size !== 3) {
      throw new Error(`Section VI needs 3 distinct choices: ${group.keyword}/${rowIndex}`)
    }

    return {
      id: `section6-${String(groupIndex * 10 + rowIndex + 1).padStart(3, '0')}`,
      keyword: group.keyword,
      keywordMeaning: group.keywordMeaning,
      question: row.question,
      correctAnswer: row.answer,
      choices,
      explanation: group.explanation,
    }
  }),
)

if (section6Questions.length !== 100) {
  throw new Error(`Section VI question pool must contain 100 items, got ${section6Questions.length}`)
}
