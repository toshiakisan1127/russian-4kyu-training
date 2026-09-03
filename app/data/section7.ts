export type Section7Form = {
  subject: 'я' | 'ты' | 'он/она' | 'мы' | 'вы' | 'они'
  form: string
}

export type Section7Question = {
  id: string
  infinitive: string
  meaning: string
  conjugation: string
  subject: Section7Form['subject']
  question: string
  correctAnswer: string
  choices: string[]
  forms: Section7Form[]
}

type VerbSeed = {
  infinitive: string
  meaning: string
  conjugation: string
  complement: string
  forms: readonly [string, string, string, string, string, string]
}

const subjects = ['я', 'ты', 'он/она', 'мы', 'вы', 'они'] as const

const verbs: readonly VerbSeed[] = [
  { infinitive: 'чита́ть', meaning: '読む', conjugation: '第1変化', complement: 'кни́гу.', forms: ['чита́ю', 'чита́ешь', 'чита́ет', 'чита́ем', 'чита́ете', 'чита́ют'] },
  { infinitive: 'писа́ть', meaning: '書く', conjugation: '第1変化（語幹変化）', complement: 'письмо́.', forms: ['пишу́', 'пи́шешь', 'пи́шет', 'пи́шем', 'пи́шете', 'пи́шут'] },
  { infinitive: 'говори́ть', meaning: '話す', conjugation: '第2変化', complement: 'по-ру́сски.', forms: ['говорю́', 'говори́шь', 'говори́т', 'говори́м', 'говори́те', 'говоря́т'] },
  { infinitive: 'де́лать', meaning: 'する・作る', conjugation: '第1変化', complement: 'дома́шнее зада́ние.', forms: ['де́лаю', 'де́лаешь', 'де́лает', 'де́лаем', 'де́лаете', 'де́лают'] },
  { infinitive: 'рабо́тать', meaning: '働く', conjugation: '第1変化', complement: 'до́ма.', forms: ['рабо́таю', 'рабо́таешь', 'рабо́тает', 'рабо́таем', 'рабо́таете', 'рабо́тают'] },
  { infinitive: 'жить', meaning: '住む・生きる', conjugation: '不規則', complement: 'в Москве́.', forms: ['живу́', 'живёшь', 'живёт', 'живём', 'живёте', 'живу́т'] },
  { infinitive: 'учи́ться', meaning: '学ぶ', conjugation: '第2変化・-ся', complement: 'в университе́те.', forms: ['учу́сь', 'у́чишься', 'у́чится', 'у́чимся', 'у́читесь', 'у́чатся'] },
  { infinitive: 'смотре́ть', meaning: '見る', conjugation: '第2変化', complement: 'фи́льм.', forms: ['смотрю́', 'смо́тришь', 'смо́трит', 'смо́трим', 'смо́трите', 'смо́трят'] },
  { infinitive: 'слу́шать', meaning: '聞く', conjugation: '第1変化', complement: 'му́зыку.', forms: ['слу́шаю', 'слу́шаешь', 'слу́шает', 'слу́шаем', 'слу́шаете', 'слу́шают'] },
  { infinitive: 'знать', meaning: '知っている', conjugation: '第1変化', complement: 'э́тот го́род.', forms: ['зна́ю', 'зна́ешь', 'зна́ет', 'зна́ем', 'зна́ете', 'зна́ют'] },
  { infinitive: 'понима́ть', meaning: '理解する', conjugation: '第1変化', complement: 'э́тот вопро́с.', forms: ['понима́ю', 'понима́ешь', 'понима́ет', 'понима́ем', 'понима́ете', 'понима́ют'] },
  { infinitive: 'люби́ть', meaning: '好きである・愛する', conjugation: '第2変化', complement: 'му́зыку.', forms: ['люблю́', 'лю́бишь', 'лю́бит', 'лю́бим', 'лю́бите', 'лю́бят'] },
  { infinitive: 'хоте́ть', meaning: '〜したい・欲しい', conjugation: '混合変化', complement: 'домо́й.', forms: ['хочу́', 'хо́чешь', 'хо́чет', 'хоти́м', 'хоти́те', 'хотя́т'] },
  { infinitive: 'мочь', meaning: '〜できる', conjugation: '不規則', complement: 'помо́чь.', forms: ['могу́', 'мо́жешь', 'мо́жет', 'мо́жем', 'мо́жете', 'мо́гут'] },
  { infinitive: 'идти́', meaning: '歩いて行く', conjugation: '不規則', complement: 'в шко́лу.', forms: ['иду́', 'идёшь', 'идёт', 'идём', 'идёте', 'иду́т'] },
  { infinitive: 'е́хать', meaning: '乗り物で行く', conjugation: '不規則', complement: 'на рабо́ту.', forms: ['е́ду', 'е́дешь', 'е́дет', 'е́дем', 'е́дете', 'е́дут'] },
  { infinitive: 'есть', meaning: '食べる', conjugation: '不規則', complement: 'суп.', forms: ['ем', 'ешь', 'ест', 'еди́м', 'еди́те', 'едя́т'] },
  { infinitive: 'пить', meaning: '飲む', conjugation: '不規則', complement: 'чай.', forms: ['пью', 'пьёшь', 'пьёт', 'пьём', 'пьёте', 'пьют'] },
  { infinitive: 'брать', meaning: '取る', conjugation: '不規則', complement: 'кни́гу.', forms: ['беру́', 'берёшь', 'берёт', 'берём', 'берёте', 'беру́т'] },
  { infinitive: 'дава́ть', meaning: '与える', conjugation: '不規則', complement: 'сове́т.', forms: ['даю́', 'даёшь', 'даёт', 'даём', 'даёте', 'даю́т'] },
]

const displaySubject = (subject: Section7Form['subject']) => subject === 'он/она' ? 'Он' : subject.charAt(0).toUpperCase() + subject.slice(1)

export const section7Questions: Section7Question[] = verbs.flatMap((verb, verbIndex) => {
  const forms: Section7Form[] = subjects.map((subject, index) => ({ subject, form: verb.forms[index] }))

  return subjects.map((subject, personIndex) => {
    const candidateIndexes = [personIndex, (personIndex + 1) % 6, (personIndex + 2) % 6, (personIndex + 3) % 6]
    const choices = candidateIndexes.map((index) => verb.forms[index])

    return {
      id: `s7-${String(verbIndex + 1).padStart(2, '0')}-${personIndex + 1}`,
      infinitive: verb.infinitive,
      meaning: verb.meaning,
      conjugation: verb.conjugation,
      subject,
      question: `${displaySubject(subject)} ___ ${verb.complement}`,
      correctAnswer: verb.forms[personIndex],
      choices,
      forms,
    }
  })
})
