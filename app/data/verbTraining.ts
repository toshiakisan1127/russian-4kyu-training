import { section7Questions } from '~/data/section7'
import { section8Questions } from '~/data/section8'

export type VerbTrainingCategory = 'present' | 'past' | 'future' | 'motion' | 'aspect'

export type VerbTrainingQuestion = {
  id: string
  category: VerbTrainingCategory
  infinitive: string
  meaning: string
  prompt: string
  correctAnswer: string
  choices: string[]
  answerSentence: string
  answerTranslation?: string
  explanation: string
}

const presentQuestions: VerbTrainingQuestion[] = section7Questions.map((question) => ({
  id: `verb-${question.id}`,
  category: 'present',
  infinitive: question.infinitive,
  meaning: question.meaning,
  prompt: question.question,
  correctAnswer: question.correctAnswer,
  choices: question.choices,
  answerSentence: question.question.replace('___', question.correctAnswer),
  answerTranslation: question.translation,
  explanation: `${question.infinitive}（${question.meaning}）は ${question.conjugation}。主語 ${question.subject} に合う形は「${question.correctAnswer}」。`,
}))

const tenseQuestions: VerbTrainingQuestion[] = section8Questions.map((question) => ({
  id: `verb-${question.id}`,
  category: question.tense,
  infinitive: question.infinitive,
  meaning: question.meaning,
  prompt: question.prompt,
  correctAnswer: question.correctAnswer,
  choices: question.choices,
  answerSentence: question.fullAnswer,
  answerTranslation: question.translation,
  explanation: question.explanation,
}))

type ExtraQuestion = Omit<VerbTrainingQuestion, 'id' | 'category'>

const motionSeeds: ExtraQuestion[] = [
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Сейча́с я ___ в шко́лу.', correctAnswer: 'иду́', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Сейча́с я иду́ в шко́лу.', explanation: '今まさに一方向へ歩いて移動しているので идти́ を使う。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Я ка́ждый день ___ в шко́лу пешко́м.', correctAnswer: 'хожу́', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я ка́ждый день хожу́ в шко́лу пешко́м.', explanation: '習慣的・反復的に歩いて行くので ходи́ть を使う。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Сейча́с мы ___ в Москву́ на по́езде.', correctAnswer: 'е́дем', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Сейча́с мы е́дем в Москву́ на по́езде.', explanation: '今まさに一方向へ乗り物で移動しているので е́хать。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Мы ча́сто ___ в Москву́ на по́езде.', correctAnswer: 'е́здим', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы ча́сто е́здим в Москву́ на по́езде.', explanation: '繰り返し乗り物で行くので е́здить。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Куда́ ты сейча́с ___?', correctAnswer: 'идёшь', choices: ['идёшь', 'хо́дишь', 'е́дешь', 'е́здишь'], answerSentence: 'Куда́ ты сейча́с идёшь?', explanation: 'сейча́с があり、一方向の現在進行の移動なので идти́。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Ты ча́сто ___ в парк?', correctAnswer: 'хо́дишь', choices: ['идёшь', 'хо́дишь', 'е́дешь', 'е́здишь'], answerSentence: 'Ты ча́сто хо́дишь в парк?', explanation: 'ча́сто による反復なので ходи́ть。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Куда́ вы сейча́с ___?', correctAnswer: 'е́дете', choices: ['идёте', 'хо́дите', 'е́дете', 'е́здите'], answerSentence: 'Куда́ вы сейча́с е́дете?', explanation: '今一方向へ乗り物で移動中なので е́хать。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Вы ча́сто ___ туда́ на авто́бусе?', correctAnswer: 'е́здите', choices: ['идёте', 'хо́дите', 'е́дете', 'е́здите'], answerSentence: 'Вы ча́сто е́здите туда́ на авто́бусе?', explanation: '反復的な乗り物移動なので е́здить。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Он сейча́с ___ домо́й.', correctAnswer: 'идёт', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Он сейча́с идёт домо́й.', explanation: '今一方向へ歩いて帰っているので идти́。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Он иногда́ ___ на рабо́ту пешко́м.', correctAnswer: 'хо́дит', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Он иногда́ хо́дит на рабо́ту пешко́м.', explanation: 'иногда́ による反復なので ходи́ть。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Она́ сейча́с ___ в це́нтр на метро́.', correctAnswer: 'е́дет', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Она́ сейча́с е́дет в це́нтр на метро́.', explanation: '今一方向へ乗り物で移動しているので е́хать。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Она́ ка́ждую суббо́ту ___ к ба́бушке.', correctAnswer: 'е́здит', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Она́ ка́ждую суббо́ту е́здит к ба́бушке.', explanation: '毎週繰り返す乗り物移動なので е́здить。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Они́ сейча́с ___ в магази́н.', correctAnswer: 'иду́т', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ сейча́с иду́т в магази́н.', explanation: '今一方向へ歩いて移動中なので идти́。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Они́ ча́сто ___ в кино́.', correctAnswer: 'хо́дят', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ ча́сто хо́дят в кино́.', explanation: '反復的に歩いて行く意味なので ходи́ть。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Они́ сейча́с ___ на вокза́л.', correctAnswer: 'е́дут', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ сейча́с е́дут на вокза́л.', explanation: '今一方向へ乗り物で移動しているので е́хать。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Они́ ка́ждый год ___ на мо́ре.', correctAnswer: 'е́здят', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ ка́ждый год е́здят на мо́ре.', explanation: '毎年繰り返す乗り物移動なので е́здить。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Мы сейча́с ___ в музе́й.', correctAnswer: 'идём', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы сейча́с идём в музе́й.', explanation: '今一方向へ歩いているので идти́。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '歩いて行く', prompt: 'Мы иногда́ ___ в музе́й пешко́м.', correctAnswer: 'хо́дим', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы иногда́ хо́дим в музе́й пешко́м.', explanation: '反復的な徒歩移動なので ходи́ть。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Я сейча́с ___ к дру́гу на такси́.', correctAnswer: 'е́ду', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я сейча́с е́ду к дру́гу на такси́.', explanation: '今一方向へ乗り物で移動しているので е́хать。' },
  { infinitive: 'е́хать / е́здить', meaning: '乗り物で行く', prompt: 'Я иногда́ ___ к дру́гу на такси́.', correctAnswer: 'е́зжу', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я иногда́ е́зжу к дру́гу на такси́.', explanation: '反復的な乗り物移動なので е́здить。' },
]

const aspectSeeds: ExtraQuestion[] = [
  { infinitive: 'де́лать / сде́лать', meaning: 'する・やり終える', prompt: 'Я уже́ ___ дома́шнее зада́ние.', correctAnswer: 'сде́лал', choices: ['де́лал', 'сде́лал', 'де́лаю', 'бу́ду де́лать'], answerSentence: 'Я уже́ сде́лал дома́шнее зада́ние.', explanation: 'уже́ と完了した結果を表すので完了体 сде́лать。' },
  { infinitive: 'де́лать / сде́лать', meaning: 'する', prompt: 'Вчера́ я два часа́ ___ дома́шнее зада́ние.', correctAnswer: 'де́лал', choices: ['де́лал', 'сде́лал', 'сде́лаю', 'де́лаю'], answerSentence: 'Вчера́ я два часа́ де́лал дома́шнее зада́ние.', explanation: '動作の継続時間に注目しているので不完了体 де́лать。' },
  { infinitive: 'чита́ть / прочита́ть', meaning: '読む・読み終える', prompt: 'Я уже́ ___ э́ту кни́гу.', correctAnswer: 'прочита́л', choices: ['чита́л', 'прочита́л', 'чита́ю', 'бу́ду чита́ть'], answerSentence: 'Я уже́ прочита́л э́ту кни́гу.', explanation: '本を最後まで読み終えた結果なので完了体 прочита́ть。' },
  { infinitive: 'чита́ть / прочита́ть', meaning: '読む', prompt: 'Ве́чером я обы́чно ___ кни́ги.', correctAnswer: 'чита́ю', choices: ['чита́ю', 'прочита́ю', 'прочита́л', 'прочита́ть'], answerSentence: 'Ве́чером я обы́чно чита́ю кни́ги.', explanation: 'обы́чно の習慣なので不完了体 чита́ть。' },
  { infinitive: 'писа́ть / написа́ть', meaning: '書く・書き終える', prompt: 'Она́ уже́ ___ письмо́.', correctAnswer: 'написа́ла', choices: ['писа́ла', 'написа́ла', 'пи́шет', 'бу́дет писа́ть'], answerSentence: 'Она́ уже́ написа́ла письмо́.', explanation: '書き終えた結果なので完了体 написа́ть。' },
  { infinitive: 'писа́ть / написа́ть', meaning: '書く', prompt: 'Она́ сейча́с ___ письмо́.', correctAnswer: 'пи́шет', choices: ['пи́шет', 'напи́шет', 'написа́ла', 'написа́ть'], answerSentence: 'Она́ сейча́с пи́шет письмо́.', explanation: '進行中の動作なので不完了体 писа́ть。' },
  { infinitive: 'покупа́ть / купи́ть', meaning: '買う', prompt: 'Вчера́ мы ___ но́вый стол.', correctAnswer: 'купи́ли', choices: ['покупа́ли', 'купи́ли', 'покупа́ем', 'бу́дем покупа́ть'], answerSentence: 'Вчера́ мы купи́ли но́вый стол.', explanation: '一回の購入が完了したので完了体 купи́ть。' },
  { infinitive: 'покупа́ть / купи́ть', meaning: '買う', prompt: 'Мы ча́сто ___ проду́кты здесь.', correctAnswer: 'покупа́ем', choices: ['покупа́ем', 'ку́пим', 'купи́ли', 'купи́ть'], answerSentence: 'Мы ча́сто покупа́ем проду́кты здесь.', explanation: 'ча́сто の反復なので不完了体 покупа́ть。' },
  { infinitive: 'открыва́ть / откры́ть', meaning: '開ける', prompt: 'Он уже́ ___ окно́.', correctAnswer: 'откры́л', choices: ['открыва́л', 'откры́л', 'открыва́ет', 'бу́дет открыва́ть'], answerSentence: 'Он уже́ откры́л окно́.', explanation: '開け終わった結果なので完了体 откры́ть。' },
  { infinitive: 'открыва́ть / откры́ть', meaning: '開ける', prompt: 'Ка́ждое у́тро он ___ окно́.', correctAnswer: 'открыва́ет', choices: ['открыва́ет', 'откро́ет', 'откры́л', 'откры́ть'], answerSentence: 'Ка́ждое у́тро он открыва́ет окно́.', explanation: '毎朝の習慣なので不完了体 открыва́ть。' },
  { infinitive: 'закрыва́ть / закры́ть', meaning: '閉める', prompt: 'Я уже́ ___ дверь.', correctAnswer: 'закры́л', choices: ['закрыва́л', 'закры́л', 'закрыва́ю', 'бу́ду закрыва́ть'], answerSentence: 'Я уже́ закры́л дверь.', explanation: '閉め終えた結果なので完了体 закры́ть。' },
  { infinitive: 'закрыва́ть / закры́ть', meaning: '閉める', prompt: 'Ка́ждый ве́чер я ___ дверь.', correctAnswer: 'закрыва́ю', choices: ['закрыва́ю', 'закро́ю', 'закры́л', 'закры́ть'], answerSentence: 'Ка́ждый ве́чер я закрыва́ю дверь.', explanation: '毎晩の反復なので不完了体 закрыва́ть。' },
  { infinitive: 'гото́вить / пригото́вить', meaning: '料理する・作り終える', prompt: 'Ма́ма уже́ ___ у́жин.', correctAnswer: 'пригото́вила', choices: ['гото́вила', 'пригото́вила', 'гото́вит', 'бу́дет гото́вить'], answerSentence: 'Ма́ма уже́ пригото́вила у́жин.', explanation: '夕食が完成した結果なので完了体 пригото́вить。' },
  { infinitive: 'гото́вить / пригото́вить', meaning: '料理する', prompt: 'Ма́ма сейча́с ___ у́жин.', correctAnswer: 'гото́вит', choices: ['гото́вит', 'пригото́вит', 'пригото́вила', 'пригото́вить'], answerSentence: 'Ма́ма сейча́с гото́вит у́жин.', explanation: '今進行中なので不完了体 гото́вить。' },
  { infinitive: 'смотре́ть / посмотре́ть', meaning: '見る', prompt: 'Вчера́ мы ___ но́вый фильм до конца́.', correctAnswer: 'посмотре́ли', choices: ['смотре́ли', 'посмотре́ли', 'смо́трим', 'бу́дем смотре́ть'], answerSentence: 'Вчера́ мы посмотре́ли но́вый фильм до конца́.', explanation: '最後まで見終えたので完了体 посмотре́ть。' },
  { infinitive: 'смотре́ть / посмотре́ть', meaning: '見る', prompt: 'Мы ча́сто ___ фи́льмы ве́чером.', correctAnswer: 'смо́трим', choices: ['смо́трим', 'посмо́трим', 'посмотре́ли', 'посмотре́ть'], answerSentence: 'Мы ча́сто смо́трим фи́льмы ве́чером.', explanation: '反復・習慣なので不完了体 смотре́ть。' },
  { infinitive: 'учи́ть / вы́учить', meaning: '覚える・学ぶ', prompt: 'Я уже́ ___ э́ти слова́.', correctAnswer: 'вы́учил', choices: ['учи́л', 'вы́учил', 'учу́', 'бу́ду учи́ть'], answerSentence: 'Я уже́ вы́учил э́ти слова́.', explanation: '覚え終えた結果なので完了体 вы́учить。' },
  { infinitive: 'учи́ть / вы́учить', meaning: '学ぶ・覚える', prompt: 'Я ка́ждый день ___ но́вые слова́.', correctAnswer: 'учу́', choices: ['учу́', 'вы́учу', 'вы́учил', 'вы́учить'], answerSentence: 'Я ка́ждый день учу́ но́вые слова́.', explanation: '毎日の反復なので不完了体 учи́ть。' },
  { infinitive: 'реша́ть / реши́ть', meaning: '解く・解決する', prompt: 'Он уже́ ___ зада́чу.', correctAnswer: 'реши́л', choices: ['реша́л', 'реши́л', 'реша́ет', 'бу́дет реша́ть'], answerSentence: 'Он уже́ реши́л зада́чу.', explanation: '問題を解き終えた結果なので完了体 реши́ть。' },
  { infinitive: 'реша́ть / реши́ть', meaning: '解く', prompt: 'Он сейча́с ___ зада́чу.', correctAnswer: 'реша́ет', choices: ['реша́ет', 'реши́т', 'реши́л', 'реши́ть'], answerSentence: 'Он сейча́с реша́ет зада́чу.', explanation: '今進行中なので不完了体 реша́ть。' },
]

const motionQuestions: VerbTrainingQuestion[] = motionSeeds.map((question, index) => ({
  ...question,
  id: `verb-motion-${String(index + 1).padStart(2, '0')}`,
  category: 'motion',
}))

const aspectQuestions: VerbTrainingQuestion[] = aspectSeeds.map((question, index) => ({
  ...question,
  id: `verb-aspect-${String(index + 1).padStart(2, '0')}`,
  category: 'aspect',
}))

export const verbTrainingQuestions: VerbTrainingQuestion[] = [
  ...presentQuestions,
  ...tenseQuestions,
  ...motionQuestions,
  ...aspectQuestions,
]
