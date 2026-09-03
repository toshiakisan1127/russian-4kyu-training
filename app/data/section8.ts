export type Section8Question = {
  id: string
  tense: 'past' | 'future'
  infinitive: string
  meaning: string
  sourceSentence: string
  prompt: string
  correctAnswer: string
  fullAnswer: string
  choices: string[]
  explanation: string
  translation: string
}

type VerbSeed = {
  infinitive: string
  meaning: string
  complement: string
  present: readonly [string, string, string, string, string, string]
  past: readonly [string, string, string, string]
}

const subjects = ['я', 'ты', 'он', 'мы', 'вы', 'они'] as const
const futureAux = ['бу́ду', 'бу́дешь', 'бу́дет', 'бу́дем', 'бу́дете', 'бу́дут'] as const

const verbs: readonly VerbSeed[] = [
  { infinitive: 'чита́ть', meaning: '読む', complement: 'кни́гу.', present: ['чита́ю', 'чита́ешь', 'чита́ет', 'чита́ем', 'чита́ете', 'чита́ют'], past: ['чита́л', 'чита́ла', 'чита́ло', 'чита́ли'] },
  { infinitive: 'писа́ть', meaning: '書く', complement: 'письмо́.', present: ['пишу́', 'пи́шешь', 'пи́шет', 'пи́шем', 'пи́шете', 'пи́шут'], past: ['писа́л', 'писа́ла', 'писа́ло', 'писа́ли'] },
  { infinitive: 'говори́ть', meaning: '話す', complement: 'по-ру́сски.', present: ['говорю́', 'говори́шь', 'говори́т', 'говори́м', 'говори́те', 'говоря́т'], past: ['говори́л', 'говори́ла', 'говори́ло', 'говори́ли'] },
  { infinitive: 'де́лать', meaning: 'する・作る', complement: 'дома́шнее зада́ние.', present: ['де́лаю', 'де́лаешь', 'де́лает', 'де́лаем', 'де́лаете', 'де́лают'], past: ['де́лал', 'де́лала', 'де́лало', 'де́лали'] },
  { infinitive: 'рабо́тать', meaning: '働く', complement: 'до́ма.', present: ['рабо́таю', 'рабо́таешь', 'рабо́тает', 'рабо́таем', 'рабо́таете', 'рабо́тают'], past: ['рабо́тал', 'рабо́тала', 'рабо́тало', 'рабо́тали'] },
  { infinitive: 'учи́ться', meaning: '学ぶ', complement: 'в университе́те.', present: ['учу́сь', 'у́чишься', 'у́чится', 'у́чимся', 'у́читесь', 'у́чатся'], past: ['учи́лся', 'учи́лась', 'учи́лось', 'учи́лись'] },
  { infinitive: 'смотре́ть', meaning: '見る', complement: 'фи́льм.', present: ['смотрю́', 'смо́тришь', 'смо́трит', 'смо́трим', 'смо́трите', 'смо́трят'], past: ['смотре́л', 'смотре́ла', 'смотре́ло', 'смотре́ли'] },
  { infinitive: 'слу́шать', meaning: '聞く', complement: 'му́зыку.', present: ['слу́шаю', 'слу́шаешь', 'слу́шает', 'слу́шаем', 'слу́шаете', 'слу́шают'], past: ['слу́шал', 'слу́шала', 'слу́шало', 'слу́шали'] },
  { infinitive: 'понима́ть', meaning: '理解する', complement: 'э́тот вопро́с.', present: ['понима́ю', 'понима́ешь', 'понима́ет', 'понима́ем', 'понима́ете', 'понима́ют'], past: ['понима́л', 'понима́ла', 'понима́ло', 'понима́ли'] },
  { infinitive: 'люби́ть', meaning: '好きである・愛する', complement: 'му́зыку.', present: ['люблю́', 'лю́бишь', 'лю́бит', 'лю́бим', 'лю́бите', 'лю́бят'], past: ['люби́л', 'люби́ла', 'люби́ло', 'люби́ли'] },
  { infinitive: 'гото́вить', meaning: '料理する・準備する', complement: 'у́жин.', present: ['гото́влю', 'гото́вишь', 'гото́вит', 'гото́вим', 'гото́вите', 'гото́вят'], past: ['гото́вил', 'гото́вила', 'гото́вило', 'гото́вили'] },
  { infinitive: 'игра́ть', meaning: '遊ぶ・演奏する', complement: 'в футбо́л.', present: ['игра́ю', 'игра́ешь', 'игра́ет', 'игра́ем', 'игра́ете', 'игра́ют'], past: ['игра́л', 'игра́ла', 'игра́ло', 'игра́ли'] },
]

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const tenseTranslations: Record<string, { past: string; future: string }> = {
  чита́ть: { past: '本を読みました', future: '本を読むでしょう' },
  писа́ть: { past: '手紙を書きました', future: '手紙を書くでしょう' },
  говори́ть: { past: 'ロシア語を話しました', future: 'ロシア語を話すでしょう' },
  де́лать: { past: '宿題をしました', future: '宿題をするでしょう' },
  рабо́тать: { past: '家で働きました', future: '家で働くでしょう' },
  учи́ться: { past: '大学で学びました', future: '大学で学ぶでしょう' },
  смотре́ть: { past: '映画を見ました', future: '映画を見るでしょう' },
  слу́шать: { past: '音楽を聞きました', future: '音楽を聞くでしょう' },
  понима́ть: { past: 'この質問を理解しました', future: 'この質問を理解するでしょう' },
  люби́ть: { past: '音楽が好きでした', future: '音楽が好きでしょう' },
  гото́вить: { past: '夕食を作りました', future: '夕食を作るでしょう' },
  игра́ть: { past: 'サッカーをしました', future: 'サッカーをするでしょう' },
}

const subjectTranslations: Record<string, string> = {
  я: '私は',
  ты: 'あなたは',
  он: '彼は',
  она: '彼女は',
  мы: '私たちは',
  вы: 'あなたたちは',
  они: '彼らは',
}

const translateTense = (
  tense: 'past' | 'future',
  subject: string,
  infinitive: string,
  time: string,
) => `${time}、${subjectTranslations[subject] ?? subject}${tenseTranslations[infinitive]?.[tense] ?? infinitive}。`

const generatedQuestions: Section8Question[] = verbs.flatMap((verb, verbIndex) => {
  const pastSubjects = [
    { subject: 'он', presentIndex: 2, pastIndex: 0, label: '男性単数' },
    { subject: 'она', presentIndex: 2, pastIndex: 1, label: '女性単数' },
    { subject: 'они', presentIndex: 5, pastIndex: 3, label: '複数' },
  ] as const

  const pastQuestions = pastSubjects.map((item, index): Section8Question => ({
    id: `s8-p-${String(verbIndex + 1).padStart(2, '0')}-${index + 1}`,
    tense: 'past',
    infinitive: verb.infinitive,
    meaning: verb.meaning,
    sourceSentence: `${capitalize(item.subject)} ${verb.present[item.presentIndex]} ${verb.complement}`,
    prompt: `Вчера́ ${item.subject} ___ ${verb.complement}`,
    correctAnswer: verb.past[item.pastIndex],
    fullAnswer: `Вчера́ ${item.subject} ${verb.past[item.pastIndex]} ${verb.complement}`,
    choices: [...verb.past],
    explanation: `過去形は主語の性・数に一致する。この文は${item.label}なので「${verb.past[item.pastIndex]}」。`,
    translation: translateTense('past', item.subject, verb.infinitive, '昨日'),
  }))

  const futureQuestions = subjects.map((subject, personIndex): Section8Question => {
    const correct = `${futureAux[personIndex]} ${verb.infinitive}`
    const candidateIndexes = [personIndex, (personIndex + 1) % 6, (personIndex + 2) % 6, (personIndex + 3) % 6]

    return {
      id: `s8-f-${String(verbIndex + 1).padStart(2, '0')}-${personIndex + 1}`,
      tense: 'future',
      infinitive: verb.infinitive,
      meaning: verb.meaning,
      sourceSentence: `${capitalize(subject)} ${verb.present[personIndex]} ${verb.complement}`,
      prompt: `За́втра ${subject} ___ ${verb.complement}`,
      correctAnswer: correct,
      fullAnswer: `За́втра ${subject} ${correct} ${verb.complement}`,
      choices: candidateIndexes.map((index) => `${futureAux[index]} ${verb.infinitive}`),
      explanation: `不完了体の未来は「быть の未来形 + 不定形」。主語 ${subject} には「${futureAux[personIndex]}」を使う。`,
      translation: translateTense('future', subject, verb.infinitive, '明日'),
    }
  })

  return [...pastQuestions, ...futureQuestions]
})

const neuterPast: readonly Omit<Section8Question, 'id' | 'tense' | 'translation'>[] = [
  { infinitive: 'рабо́тать', meaning: '働く・作動する', sourceSentence: 'Ра́дио хорошо́ рабо́тает.', prompt: 'Вчера́ ра́дио хорошо́ ___.', correctAnswer: 'рабо́тало', fullAnswer: 'Вчера́ ра́дио хорошо́ рабо́тало.', choices: ['рабо́тал', 'рабо́тала', 'рабо́тало', 'рабо́тали'], explanation: 'ра́дио は中性名詞として扱うので、過去形は中性単数「рабо́тало」。' },
  { infinitive: 'лежа́ть', meaning: '横たわる・置かれている', sourceSentence: 'Письмо́ лежи́т на столе́.', prompt: 'Вчера́ письмо́ ___ на столе́.', correctAnswer: 'лежа́ло', fullAnswer: 'Вчера́ письмо́ лежа́ло на столе́.', choices: ['лежа́л', 'лежа́ла', 'лежа́ло', 'лежа́ли'], explanation: 'письмо́ は中性名詞なので「лежа́ло」。' },
  { infinitive: 'стоя́ть', meaning: '立っている・置かれている', sourceSentence: 'Окно́ стои́т откры́тым.', prompt: 'Вчера́ окно́ ___ откры́тым.', correctAnswer: 'стоя́ло', fullAnswer: 'Вчера́ окно́ стоя́ло откры́тым.', choices: ['стоя́л', 'стоя́ла', 'стоя́ло', 'стоя́ли'], explanation: 'окно́ は中性名詞なので「стоя́ло」。' },
  { infinitive: 'свети́ть', meaning: '光る・照らす', sourceSentence: 'Со́лнце я́рко све́тит.', prompt: 'Вчера́ со́лнце я́рко ___.', correctAnswer: 'свети́ло', fullAnswer: 'Вчера́ со́лнце я́рко свети́ло.', choices: ['свети́л', 'свети́ла', 'свети́ло', 'свети́ли'], explanation: 'со́лнце は中性名詞なので「свети́ло」。' },
  { infinitive: 'боле́ть', meaning: '痛む・病気である', sourceSentence: 'Го́рло боли́т.', prompt: 'Вчера́ го́рло ___.', correctAnswer: 'боле́ло', fullAnswer: 'Вчера́ го́рло боле́ло.', choices: ['боле́л', 'боле́ла', 'боле́ло', 'боле́ли'], explanation: 'го́рло は中性名詞なので「боле́ло」。' },
  { infinitive: 'начина́ться', meaning: '始まる', sourceSentence: 'За́нятие начина́ется в де́вять.', prompt: 'Вчера́ за́нятие ___ в де́вять.', correctAnswer: 'начина́лось', fullAnswer: 'Вчера́ за́нятие начина́лось в де́вять.', choices: ['начина́лся', 'начина́лась', 'начина́лось', 'начина́лись'], explanation: 'за́нятие は中性名詞なので「начина́лось」。' },
  { infinitive: 'зака́нчиваться', meaning: '終わる', sourceSentence: 'Собра́ние зака́нчивается в пять.', prompt: 'Вчера́ собра́ние ___ в пять.', correctAnswer: 'зака́нчивалось', fullAnswer: 'Вчера́ собра́ние зака́нчивалось в пять.', choices: ['зака́нчивался', 'зака́нчивалась', 'зака́нчивалось', 'зака́нчивались'], explanation: 'собра́ние は中性名詞なので「зака́нчивалось」。' },
  { infinitive: 'звуча́ть', meaning: '響く・聞こえる', sourceSentence: 'Сло́во звучи́т стра́нно.', prompt: 'Вчера́ э́то сло́во ___ стра́нно.', correctAnswer: 'звуча́ло', fullAnswer: 'Вчера́ э́то сло́во звуча́ло стра́нно.', choices: ['звуча́л', 'звуча́ла', 'звуча́ло', 'звуча́ли'], explanation: 'сло́во は中性名詞なので「звуча́ло」。' },
  { infinitive: 'идти́', meaning: '進む・行く', sourceSentence: 'Вре́мя идёт бы́стро.', prompt: 'Вчера́ вре́мя ___ бы́стро.', correctAnswer: 'шло', fullAnswer: 'Вчера́ вре́мя шло бы́стро.', choices: ['шёл', 'шла́', 'шло', 'шли'], explanation: 'идти́ の過去形は不規則。вре́мя は中性なので「шло」。' },
  { infinitive: 'помога́ть', meaning: '助ける・効く', sourceSentence: 'Лека́рство помога́ет.', prompt: 'Вчера́ лека́рство ___.', correctAnswer: 'помога́ло', fullAnswer: 'Вчера́ лека́рство помога́ло.', choices: ['помога́л', 'помога́ла', 'помога́ло', 'помога́ли'], explanation: 'лека́рство は中性名詞なので「помога́ло」。' },
  { infinitive: 'вы́глядеть', meaning: '〜に見える', sourceSentence: 'Мо́ре вы́глядит споко́йно.', prompt: 'Вчера́ мо́ре ___ споко́йно.', correctAnswer: 'вы́глядело', fullAnswer: 'Вчера́ мо́ре вы́глядело споко́йно.', choices: ['вы́глядел', 'вы́глядела', 'вы́глядело', 'вы́глядели'], explanation: 'мо́ре は中性名詞なので「вы́глядело」。' },
  { infinitive: 'находи́ться', meaning: '位置している', sourceSentence: 'Кафе́ нахо́дится ря́дом.', prompt: 'Ра́ньше кафе́ ___ ря́дом.', correctAnswer: 'находи́лось', fullAnswer: 'Ра́ньше кафе́ находи́лось ря́дом.', choices: ['находи́лся', 'находи́лась', 'находи́лось', 'находи́лись'], explanation: 'кафе́ は中性名詞として扱うので「находи́лось」。' },
]

const neuterTranslations = [
  '昨日、ラジオはよく動いていました。',
  '昨日、手紙は机の上に置かれていました。',
  '昨日、窓は開いた状態で立っていました。',
  '昨日、太陽は明るく照らしていました。',
  '昨日、喉が痛かったです。',
  '昨日、授業は9時に始まりました。',
  '昨日、会議は5時に終わりました。',
  '昨日、この言葉は変に聞こえました。',
  '昨日、時間は速く進みました。',
  '昨日、薬は効きました。',
  '昨日、海は穏やかに見えました。',
  '以前、カフェは近くにありました。',
] as const

export const section8Questions: Section8Question[] = [
  ...generatedQuestions,
  ...neuterPast.map((question, index) => ({
    ...question,
    id: `s8-n-${String(index + 1).padStart(2, '0')}`,
    tense: 'past' as const,
    translation: neuterTranslations[index]!,
  })),
]
