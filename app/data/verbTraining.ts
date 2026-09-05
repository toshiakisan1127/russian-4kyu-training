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
  choiceExplanations?: Record<string, string>
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
  choiceExplanations: question.choiceExplanations,
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
  choiceExplanations: question.choiceExplanations,
  answerSentence: question.fullAnswer,
  answerTranslation: question.translation,
  explanation: question.explanation,
}))

type ExtraQuestion = Omit<VerbTrainingQuestion, 'id' | 'category'>

const motionSeeds: ExtraQuestion[] = [
  { infinitive: 'идти́ / ходи́ть', meaning: '今、歩いて学校へ行く', prompt: 'Сейча́с я ___ в шко́лу пешко́м.', correctAnswer: 'иду́', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Сейча́с я иду́ в шко́лу пешко́м.', answerTranslation: '今、私は歩いて学校へ向かっています。', explanation: 'сейча́с「今」+一方向に歩く動作なので、идти́の現在形иду́。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '毎日、歩いて学校へ通う', prompt: 'Я ка́ждый день ___ в шко́лу пешко́м.', correctAnswer: 'хожу́', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я ка́ждый день хожу́ в шко́лу пешко́м.', answerTranslation: '私は毎日、歩いて学校へ通っています。', explanation: 'ка́ждый день「毎日」と習慣的な徒歩移動なので、ходи́тьのя形хожу́。' },
  { infinitive: 'е́хать / е́здить', meaning: '今、電車でモスクワへ向かう', prompt: 'Сейча́с мы ___ в Москву́ на по́езде.', correctAnswer: 'е́дем', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Сейча́с мы е́дем в Москву́ на по́езде.', answerTranslation: '今、私たちは電車でモスクワへ向かっています。', explanation: 'сейча́с「今」+電車で一方向へ移動しているので、е́хатьのмы形е́дем。' },
  { infinitive: 'е́хать / е́здить', meaning: '頻繁に、電車でモスクワへ行く', prompt: 'Мы ча́сто ___ в Москву́ на по́езде.', correctAnswer: 'е́здим', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы ча́сто е́здим в Москву́ на по́езде.', answerTranslation: '私たちはよく電車でモスクワへ行きます。', explanation: 'ча́сто「よく」と反復する乗り物移動なので、е́здитьのмы形е́здим。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '今、歩いてどこへ行くかを尋ねる', prompt: 'Куда́ ты сейча́с ___ пешко́м?', correctAnswer: 'идёшь', choices: ['идёшь', 'хо́дишь', 'е́дешь', 'е́здишь'], answerSentence: 'Куда́ ты сейча́с идёшь пешко́м?', answerTranslation: '今、あなたはどこへ歩いて行きますか。', explanation: 'сейча́с「今」の一方向の徒歩移動を尋ねているので、идти́のты形идёшь。' },
  { infinitive: 'идти́ / ходи́ть', meaning: 'よく、歩いて公園へ行くかを尋ねる', prompt: 'Ты ча́сто ___ в парк пешко́м?', correctAnswer: 'хо́дишь', choices: ['идёшь', 'хо́дишь', 'е́дешь', 'е́здишь'], answerSentence: 'Ты ча́сто хо́дишь в парк пешко́м?', answerTranslation: 'あなたはよく歩いて公園へ行きますか。', explanation: 'ча́сто「よく」と反復する徒歩移動を尋ねているので、ходи́тьのты形хо́дишь。' },
  { infinitive: 'е́хать / е́здить', meaning: '今、バスでどこへ行くかを尋ねる', prompt: 'Куда́ вы сейча́с ___ на авто́бусе?', correctAnswer: 'е́дете', choices: ['идёте', 'хо́дите', 'е́дете', 'е́здите'], answerSentence: 'Куда́ вы сейча́с е́дете на авто́бусе?', answerTranslation: '今、あなたたちはバスでどこへ向かっていますか。', explanation: 'сейча́с「今」の一方向の乗り物移動を尋ねているので、е́хатьのвы形е́дете。' },
  { infinitive: 'е́хать / е́здить', meaning: 'よく、バスでそこへ行くかを尋ねる', prompt: 'Вы ча́сто ___ туда́ на авто́бусе?', correctAnswer: 'е́здите', choices: ['идёте', 'хо́дите', 'е́дете', 'е́здите'], answerSentence: 'Вы ча́сто е́здите туда́ на авто́бусе?', answerTranslation: 'あなたたちはよくバスでそこへ行きますか。', explanation: 'ча́сто「よく」と反復する乗り物移動を尋ねているので、е́здитьのвы形е́здите。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '今、歩いて家へ帰る', prompt: 'Он сейча́с ___ домо́й пешко́м.', correctAnswer: 'идёт', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Он сейча́с идёт домо́й пешко́м.', answerTranslation: '彼は今、歩いて家へ帰っています。', explanation: 'сейча́с「今」の一方向の徒歩移動なので、идти́のон形идёт。' },
  { infinitive: 'идти́ / ходи́ть', meaning: 'ときどき、歩いて仕事へ行く', prompt: 'Он иногда́ ___ на рабо́ту пешко́м.', correctAnswer: 'хо́дит', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Он иногда́ хо́дит на рабо́ту пешко́м.', answerTranslation: '彼はときどき、歩いて仕事へ行きます。', explanation: 'иногда́「ときどき」と反復する徒歩移動なので、ходи́тьのон形хо́дит。' },
  { infinitive: 'е́хать / е́здить', meaning: '今、地下鉄で中心街へ向かう', prompt: 'Она́ сейча́с ___ в це́нтр на метро́.', correctAnswer: 'е́дет', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Она́ сейча́с е́дет в це́нтр на метро́.', answerTranslation: '彼女は今、地下鉄で中心街へ向かっています。', explanation: 'сейча́с「今」の一方向の乗り物移動なので、е́хатьのона́形е́дет。' },
  { infinitive: 'е́хать / е́здить', meaning: '毎週土曜日、バスで祖母のところへ行く', prompt: 'Она́ ка́ждую суббо́ту ___ к ба́бушке на авто́бусе.', correctAnswer: 'е́здит', choices: ['идёт', 'хо́дит', 'е́дет', 'е́здит'], answerSentence: 'Она́ ка́ждую суббо́ту е́здит к ба́бушке на авто́бусе.', answerTranslation: '彼女は毎週土曜日、バスで祖母のところへ行きます。', explanation: 'ка́ждую суббо́ту「毎週土曜日」+на авто́бусе「バスで」と、反復する乗り物移動なので、е́здитьのона́形е́здит。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '今、歩いて店へ行く', prompt: 'Они́ сейча́с ___ в магази́н пешко́м.', correctAnswer: 'иду́т', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ сейча́с иду́т в магази́н пешко́м.', answerTranslation: '彼らは今、歩いて店へ向かっています。', explanation: 'сейча́с「今」の一方向の徒歩移動なので、идти́のони́形иду́т。' },
  { infinitive: 'идти́ / ходи́ть', meaning: 'よく、歩いて映画館へ行く', prompt: 'Они́ ча́сто ___ в кино́.', correctAnswer: 'хо́дят', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ ча́сто хо́дят в кино́.', answerTranslation: '彼らはよく歩いて映画館へ行きます。', explanation: 'ча́сто「よく」と反復する徒歩移動なので、ходи́тьのони́形хо́дят。' },
  { infinitive: 'е́хать / е́здить', meaning: '今、タクシーで駅へ向かう', prompt: 'Они́ сейча́с ___ к вокза́лу на такси́.', correctAnswer: 'е́дут', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ сейча́с е́дут к вокза́лу на такси́.', answerTranslation: '彼らは今、タクシーで駅へ向かっています。', explanation: 'сейча́с「今」の一方向の乗り物移動なので、е́хатьのони́形е́дут。' },
  { infinitive: 'е́хать / е́здить', meaning: '毎年、電車で海へ行く', prompt: 'Они́ ка́ждый год ___ к мо́рю на по́езде.', correctAnswer: 'е́здят', choices: ['иду́т', 'хо́дят', 'е́дут', 'е́здят'], answerSentence: 'Они́ ка́ждый год е́здят к мо́рю на по́езде.', answerTranslation: '彼らは毎年、電車で海へ行きます。', explanation: 'ка́ждый год「毎年」と反復する乗り物移動なので、е́здитьのони́形е́здят。' },
  { infinitive: 'идти́ / ходи́ть', meaning: '今、歩いて博物館へ行く', prompt: 'Мы сейча́с ___ в музе́й пешко́м.', correctAnswer: 'идём', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы сейча́с идём в музе́й пешко́м.', answerTranslation: '私たちは今、歩いて博物館へ向かっています。', explanation: 'сейча́с「今」の一方向の徒歩移動なので、идти́のмы形идём。' },
  { infinitive: 'идти́ / ходи́ть', meaning: 'ときどき、歩いて博物館へ行く', prompt: 'Мы иногда́ ___ в музе́й пешко́м.', correctAnswer: 'хо́дим', choices: ['идём', 'хо́дим', 'е́дем', 'е́здим'], answerSentence: 'Мы иногда́ хо́дим в музе́й пешко́м.', answerTranslation: '私たちはときどき、歩いて博物館へ行きます。', explanation: 'иногда́「ときどき」と反復する徒歩移動なので、ходи́тьのмы形хо́дим。' },
  { infinitive: 'е́хать / е́здить', meaning: '今、タクシーで友人のところへ向かう', prompt: 'Я сейча́с ___ к дру́гу на такси́.', correctAnswer: 'е́ду', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я сейча́с е́ду к дру́гу на такси́.', answerTranslation: '私は今、タクシーで友人のところへ向かっています。', explanation: 'сейча́с「今」の一方向の乗り物移動なので、е́хатьのя形е́ду。' },
  { infinitive: 'е́хать / е́здить', meaning: 'ときどき、タクシーで友人のところへ行く', prompt: 'Я иногда́ ___ к дру́гу на такси́.', correctAnswer: 'е́зжу', choices: ['иду́', 'хожу́', 'е́ду', 'е́зжу'], answerSentence: 'Я иногда́ е́зжу к дру́гу на такси́.', answerTranslation: '私はときどき、タクシーで友人のところへ行きます。', explanation: 'иногда́「ときどき」と反復する乗り物移動なので、е́здитьのя形е́зжу。' },
]

const aspectSeeds: ExtraQuestion[] = [
  { infinitive: 'де́лать / сде́лать', meaning: 'する・やり終える', prompt: 'Я уже́ ___ дома́шнее зада́ние.', correctAnswer: 'сде́лал', choices: ['де́лал', 'сде́лал', 'де́лаю', 'бу́ду де́лать'], answerSentence: 'Я уже́ сде́лал дома́шнее зада́ние.', explanation: 'уже́ と完了した結果を表すので完了体 сде́лать。' },
  { infinitive: 'де́лать / сде́лать', meaning: 'する（継続的に行う）', prompt: 'Вчера́ я два часа́ ___ дома́шнее зада́ние.', correctAnswer: 'де́лал', choices: ['де́лал', 'сде́лал', 'сде́лаю', 'де́лаю'], answerSentence: 'Вчера́ я два часа́ де́лал дома́шнее зада́ние.', explanation: '動作の継続時間に注目しているので不完了体 де́лать。' },
  { infinitive: 'чита́ть / прочита́ть', meaning: '読む（途中・習慣）／読み終える', prompt: 'Я уже́ ___ э́ту кни́гу.', correctAnswer: 'прочита́л', choices: ['чита́л', 'прочита́л', 'чита́ю', 'бу́ду чита́ть'], answerSentence: 'Я уже́ прочита́л э́ту кни́гу.', explanation: '本を最後まで読み終えた結果なので完了体 прочита́ть。' },
  { infinitive: 'чита́ть / прочита́ть', meaning: '読む', prompt: 'Ве́чером я обы́чно ___ кни́ги.', correctAnswer: 'чита́ю', choices: ['чита́ю', 'прочита́ю', 'прочита́л', 'прочита́ть'], answerSentence: 'Ве́чером я обы́чно чита́ю кни́ги.', explanation: 'обы́чно の習慣なので不完了体 чита́ть。' },
  { infinitive: 'писа́ть / написа́ть', meaning: '書く（途中・継続）／書き終える', prompt: 'Она́ уже́ ___ письмо́.', correctAnswer: 'написа́ла', choices: ['писа́ла', 'написа́ла', 'пи́шет', 'бу́дет писа́ть'], answerSentence: 'Она́ уже́ написа́ла письмо́.', explanation: '書き終えた結果なので完了体 написа́ть。' },
  { infinitive: 'писа́ть / написа́ть', meaning: '書く', prompt: 'Она́ сейча́с ___ письмо́.', correctAnswer: 'пи́шет', choices: ['пи́шет', 'напи́шет', 'написа́ла', 'написа́ть'], answerSentence: 'Она́ сейча́с пи́шет письмо́.', explanation: '進行中の動作なので不完了体 писа́ть。' },
  { infinitive: 'покупа́ть / купи́ть', meaning: '買う（購入を完了する）／買う（反復・過程）', prompt: 'Вчера́ мы ___ но́вый стол.', correctAnswer: 'купи́ли', choices: ['покупа́ли', 'купи́ли', 'покупа́ем', 'бу́дем покупа́ть'], answerSentence: 'Вчера́ мы купи́ли но́вый стол.', explanation: '一回の購入が完了したので完了体 купи́ть。' },
  { infinitive: 'покупа́ть / купи́ть', meaning: '買う', prompt: 'Мы ча́сто ___ проду́кты здесь.', correctAnswer: 'покупа́ем', choices: ['покупа́ем', 'ку́пим', 'купи́ли', 'купи́ть'], answerSentence: 'Мы ча́сто покупа́ем проду́кты здесь.', explanation: 'ча́сто の反復なので不完了体 покупа́ть。' },
  { infinitive: 'открыва́ть / откры́ть', meaning: '開ける（開け終える）／開ける（反復・過程）', prompt: 'Он уже́ ___ окно́.', correctAnswer: 'откры́л', choices: ['открыва́л', 'откры́л', 'открыва́ет', 'бу́дет открыва́ть'], answerSentence: 'Он уже́ откры́л окно́.', explanation: '開け終わった結果なので完了体 откры́ть。' },
  { infinitive: 'открыва́ть / откры́ть', meaning: '開ける', prompt: 'Ка́ждое у́тро он ___ окно́.', correctAnswer: 'открыва́ет', choices: ['открыва́ет', 'откро́ет', 'откры́л', 'откры́ть'], answerSentence: 'Ка́ждое у́тро он открыва́ет окно́.', explanation: '毎朝の習慣なので不完了体 открыва́ть。' },
  { infinitive: 'закрыва́ть / закры́ть', meaning: '閉める（閉め終える）／閉める（反復・過程）', prompt: 'Я уже́ ___ дверь.', correctAnswer: 'закры́л', choices: ['закрыва́л', 'закры́л', 'закрыва́ю', 'бу́ду закрыва́ть'], answerSentence: 'Я уже́ закры́л дверь.', explanation: '閉め終えた結果なので完了体 закры́ть。' },
  { infinitive: 'закрыва́ть / закры́ть', meaning: '閉める', prompt: 'Ка́ждый ве́чер я ___ дверь.', correctAnswer: 'закрыва́ю', choices: ['закрыва́ю', 'закро́ю', 'закры́л', 'закры́ть'], answerSentence: 'Ка́ждый ве́чер я закрыва́ю дверь.', explanation: '毎晩の反復なので不完了体 закрыва́ть。' },
  { infinitive: 'гото́вить / пригото́вить', meaning: '料理する・準備する（過程）／料理を作り終える', prompt: 'Ма́ма уже́ ___ у́жин.', correctAnswer: 'пригото́вила', choices: ['гото́вила', 'пригото́вила', 'гото́вит', 'бу́дет гото́вить'], answerSentence: 'Ма́ма уже́ пригото́вила у́жин.', explanation: '夕食が完成した結果なので完了体 пригото́вить。' },
  { infinitive: 'гото́вить / пригото́вить', meaning: '料理する・準備する（継続的に行う）', prompt: 'Ма́ма сейча́с ___ у́жин.', correctAnswer: 'гото́вит', choices: ['гото́вит', 'пригото́вит', 'пригото́вила', 'пригото́вить'], answerSentence: 'Ма́ма сейча́с гото́вит у́жин.', explanation: '今進行中なので不完了体 гото́вить。' },
  { infinitive: 'смотре́ть / посмотре́ть', meaning: '見る（最後まで見終える）／見る（途中・習慣）', prompt: 'Вчера́ мы ___ но́вый фильм до конца́.', correctAnswer: 'посмотре́ли', choices: ['смотре́ли', 'посмотре́ли', 'смо́трим', 'бу́дем смотре́ть'], answerSentence: 'Вчера́ мы посмотре́ли но́вый фильм до конца́.', explanation: '最後まで見終えたので完了体 посмотре́ть。' },
  { infinitive: 'смотре́ть / посмотре́ть', meaning: '見る', prompt: 'Мы ча́сто ___ фи́льмы ве́чером.', correctAnswer: 'смо́трим', choices: ['смо́трим', 'посмо́трим', 'посмотре́ли', 'посмотре́ть'], answerSentence: 'Мы ча́сто смо́трим фи́льмы ве́чером.', explanation: '反復・習慣なので不完了体 смотре́ть。' },
  { infinitive: 'учи́ть / вы́учить', meaning: '学ぶ・覚える（過程）／覚え終える', prompt: 'Я уже́ ___ э́ти слова́.', correctAnswer: 'вы́учил', choices: ['учи́л', 'вы́учил', 'учу́', 'бу́ду учи́ть'], answerSentence: 'Я уже́ вы́учил э́ти слова́.', explanation: '覚え終えた結果なので完了体 вы́учить。' },
  { infinitive: 'учи́ть / вы́учить', meaning: '学ぶ・覚える', prompt: 'Я ка́ждый день ___ но́вые слова́.', correctAnswer: 'учу́', choices: ['учу́', 'вы́учу', 'вы́учил', 'вы́учить'], answerSentence: 'Я ка́ждый день учу́ но́вые слова́.', explanation: '毎日の反復なので不完了体 учи́ть。' },
  { infinitive: 'реша́ть / реши́ть', meaning: '解く・解決する（過程）／解き終える・解決する', prompt: 'Он уже́ ___ зада́чу.', correctAnswer: 'реши́л', choices: ['реша́л', 'реши́л', 'реша́ет', 'бу́дет реша́ть'], answerSentence: 'Он уже́ реши́л зада́чу.', explanation: '問題を解き終えた結果なので完了体 реши́ть。' },
  { infinitive: 'реша́ть / реши́ть', meaning: '解く', prompt: 'Он сейча́с ___ зада́чу.', correctAnswer: 'реша́ет', choices: ['реша́ет', 'реши́т', 'реши́л', 'реши́ть'], answerSentence: 'Он сейча́с реша́ет зада́чу.', explanation: '今進行中なので不完了体 реша́ть。' },
]

const motionChoiceLabels = ['徒歩・一方向', '徒歩・反復', '乗り物・一方向', '乗り物・反復']

const motionQuestions: VerbTrainingQuestion[] = motionSeeds.map((question, index) => ({
  ...question,
  id: `verb-motion-${String(index + 1).padStart(2, '0')}`,
  category: 'motion',
  choiceExplanations: Object.fromEntries(question.choices.map((choice, choiceIndex) => [
    choice,
    choice === question.correctAnswer
      ? `${motionChoiceLabels[choiceIndex]}の現在形。この文の条件に合っている。`
      : `${motionChoiceLabels[choiceIndex]}の現在形。今回の文では${motionChoiceLabels[question.choices.indexOf(question.correctAnswer)]}が必要なので、この形は選ばない。`,
  ])),
}))

const aspectQuestions: VerbTrainingQuestion[] = aspectSeeds.map((question, index) => ({
  ...question,
  id: `verb-aspect-${String(index + 1).padStart(2, '0')}`,
  category: 'aspect',
  choiceExplanations: Object.fromEntries(question.choices.map((choice) => [
    choice,
    choice === question.correctAnswer
      ? `「${choice}」は、この文の時制・体・主語に合う形。`
      : `「${choice}」は別の時制・体・主語で使う活用形で、この文の条件には合わない。`,
  ])),
}))

export const verbTrainingQuestions: VerbTrainingQuestion[] = [
  ...presentQuestions,
  ...tenseQuestions,
  ...motionQuestions,
  ...aspectQuestions,
]
