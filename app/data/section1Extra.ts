import type { PronunciationChoice, PronunciationQuestion } from './section1'

type PronunciationGroup = 'normal' | 'changed'

type PronunciationWord = PronunciationChoice & {
  group: PronunciationGroup
}

type PronunciationFamily = {
  code: string
  target: string
  normalSound: string
  changedSound: string
  rule: string
  words: PronunciationWord[]
}

const makeWord = (
  word: string,
  stressedWord: string,
  target: string,
  meaning: string,
  ipa: string,
  targetSound: string,
  group: PronunciationGroup,
  explanation?: string,
): PronunciationWord => {
  const targetIndex = word.indexOf(target)

  return {
    word,
    stressedWord,
    prefix: word.slice(0, targetIndex),
    target,
    suffix: word.slice(targetIndex + target.length),
    meaning,
    ipa,
    targetSound,
    group,
    explanation: explanation ?? (group === 'normal'
      ? `この語の ${target} は通常どおり ${targetSound} と発音します。`
      : `この語では ${target} が ${targetSound} と発音されます。`),
  }
}

const families: PronunciationFamily[] = [
  {
    code: 'b',
    target: 'б',
    normalSound: '[b]',
    changedSound: '[p]',
    rule: 'б は通常 [b]。語末では無声化して [p] になります。',
    words: [
      makeWord('брат', 'бра́т', 'б', '兄弟', '/brat/', '[b]', 'normal'),
      makeWord('бабушка', 'ба́бушка', 'б', '祖母', '/ˈbabʊʂkə/', '[b]', 'normal'),
      makeWord('работа', 'рабо́та', 'б', '仕事', '/rɐˈbotə/', '[b]', 'normal'),
      makeWord('рыба', 'ры́ба', 'б', '魚', '/ˈrɨbə/', '[b]', 'normal'),
      makeWord('собака', 'соба́ка', 'б', '犬', '/sɐˈbakə/', '[b]', 'normal'),
      makeWord('суббота', 'суббо́та', 'б', '土曜日', '/sʊˈbotə/', '[b]', 'normal'),
      makeWord('автобус', 'авто́бус', 'б', 'バス', '/ɐfˈtobʊs/', '[b]', 'normal'),
      makeWord('забор', 'забо́р', 'б', '柵', '/zɐˈbor/', '[b]', 'normal'),
      makeWord('хлеб', 'хле́б', 'б', 'パン', '/xlʲep/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('дуб', 'ду́б', 'б', 'オークの木', '/dup/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('зуб', 'зу́б', 'б', '歯', '/zup/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('гриб', 'гри́б', 'б', 'きのこ', '/grʲip/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('клуб', 'клу́б', 'б', 'クラブ', '/klup/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('лоб', 'ло́б', 'б', '額', '/lop/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('столб', 'сто́лб', 'б', '柱', '/stolp/', '[p]', 'changed', '語末の б が無声化して [p] になります。'),
      makeWord('голубь', 'го́лубь', 'б', 'ハト', '/ˈgolʊpʲ/', '[pʲ]', 'changed', '語末の б は無声化し、ь のため軟音の [pʲ] になります。'),
    ],
  },
  {
    code: 'v',
    target: 'в',
    normalSound: '[v]',
    changedSound: '[f]',
    rule: 'в は通常 [v]。語末や無声子音の前では [f] に無声化します。',
    words: [
      makeWord('вода', 'вода́', 'в', '水', '/vɐˈda/', '[v]', 'normal'),
      makeWord('ваза', 'ва́за', 'в', '花瓶', '/ˈvazə/', '[v]', 'normal'),
      makeWord('новый', 'но́вый', 'в', '新しい', '/ˈnovɨj/', '[v]', 'normal'),
      makeWord('слово', 'сло́во', 'в', '単語', '/ˈslovə/', '[v]', 'normal'),
      makeWord('живот', 'живо́т', 'в', 'お腹', '/ʐɨˈvot/', '[v]', 'normal'),
      makeWord('кровать', 'крова́ть', 'в', 'ベッド', '/krɐˈvatʲ/', '[v]', 'normal'),
      makeWord('право', 'пра́во', 'в', '権利・右', '/ˈpravə/', '[v]', 'normal'),
      makeWord('диван', 'дива́н', 'в', 'ソファ', '/dʲɪˈvan/', '[v]', 'normal'),
      makeWord('завод', 'заво́д', 'в', '工場', '/zɐˈvot/', '[v]', 'normal'),
      makeWord('рукав', 'рука́в', 'в', '袖', '/rʊˈkaf/', '[f]', 'changed', '語末の в が無声化して [f] になります。'),
      makeWord('лев', 'ле́в', 'в', 'ライオン', '/lʲef/', '[f]', 'changed', '語末の в が無声化して [f] になります。'),
      makeWord('остров', 'о́стров', 'в', '島', '/ˈostrəf/', '[f]', 'changed', '語末の в が無声化して [f] になります。'),
      makeWord('готов', 'гото́в', 'в', '準備ができた', '/ɡɐˈtof/', '[f]', 'changed', '語末の в が無声化して [f] になります。'),
      makeWord('автобус', 'авто́бус', 'в', 'バス', '/ɐfˈtobʊs/', '[f]', 'changed', 'в の後ろに無声子音 т があるため [f] に無声化します。'),
      makeWord('вторник', 'вто́рник', 'в', '火曜日', '/ˈftornʲɪk/', '[f]', 'changed', 'в の後ろに無声子音 т があるため [f] に無声化します。'),
      makeWord('встреча', 'встре́ча', 'в', '出会い', '/ˈfstrʲetɕə/', '[f]', 'changed', 'в の後ろに無声子音 с があるため [f] に無声化します。'),
      makeWord('вкусный', 'вку́сный', 'в', 'おいしい', '/ˈfkusnɨj/', '[f]', 'changed', 'в の後ろに無声子音 к があるため [f] に無声化します。'),
      makeWord('всё', 'всё', 'в', 'すべて', '/fsʲo/', '[f]', 'changed', 'в の後ろに無声子音 с があるため [f] に無声化します。'),
    ],
  },
  {
    code: 'g',
    target: 'г',
    normalSound: '[ɡ]',
    changedSound: '[k]',
    rule: 'г は通常 [ɡ]。語末では [k] に無声化し、его など一部の基本語では綴りと異なる発音になります。',
    words: [
      makeWord('газ', 'га́з', 'г', 'ガス', '/ɡas/', '[ɡ]', 'normal'),
      makeWord('город', 'го́род', 'г', '都市', '/ˈgorət/', '[ɡ]', 'normal'),
      makeWord('газета', 'газе́та', 'г', '新聞', '/ɡɐˈzʲetə/', '[ɡ]', 'normal'),
      makeWord('магазин', 'магази́н', 'г', '店', '/məɡɐˈzʲin/', '[ɡ]', 'normal'),
      makeWord('нога', 'нога́', 'г', '脚', '/nɐˈɡa/', '[ɡ]', 'normal'),
      makeWord('книга', 'кни́га', 'г', '本', '/ˈknʲiɡə/', '[ɡ]', 'normal'),
      makeWord('дорога', 'доро́га', 'г', '道', '/dɐˈroɡə/', '[ɡ]', 'normal'),
      makeWord('бумага', 'бума́га', 'г', '紙', '/bʊˈmaɡə/', '[ɡ]', 'normal'),
      makeWord('много', 'мно́го', 'г', 'たくさん', '/ˈmnoɡə/', '[ɡ]', 'normal'),
      makeWord('друг', 'дру́г', 'г', '友人', '/druk/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('снег', 'сне́г', 'г', '雪', '/snʲek/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('утюг', 'утю́г', 'г', 'アイロン', '/ʊˈtʲuk/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('берег', 'бе́рег', 'г', '岸', '/ˈbʲerʲɪk/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('враг', 'вра́г', 'г', '敵', '/vrak/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('круг', 'кру́г', 'г', '円・周囲', '/kruk/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('пирог', 'пиро́г', 'г', 'パイ', '/pʲɪˈrok/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('сапог', 'сапо́г', 'г', 'ブーツ', '/sɐˈpok/', '[k]', 'changed', '語末の г が無声化して [k] になります。'),
      makeWord('его', 'его́', 'г', '彼の・彼を', '/jɪˈvo/', '[v]', 'changed', 'его の г は例外的に [v] と発音します。'),
    ],
  },
  {
    code: 'd',
    target: 'д',
    normalSound: '[d]',
    changedSound: '[t]',
    rule: 'д は通常 [d]。語末では無声化して [t] になります。',
    words: [
      makeWord('дом', 'до́м', 'д', '家', '/dom/', '[d]', 'normal'),
      makeWord('вода', 'вода́', 'д', '水', '/vɐˈda/', '[d]', 'normal'),
      makeWord('подарок', 'пода́рок', 'д', '贈り物', '/pɐˈdarək/', '[d]', 'normal'),
      makeWord('еда', 'еда́', 'д', '食べ物', '/jɪˈda/', '[d]', 'normal'),
      makeWord('надо', 'на́до', 'д', '〜する必要がある', '/ˈnadə/', '[d]', 'normal'),
      makeWord('куда', 'куда́', 'д', 'どこへ', '/kʊˈda/', '[d]', 'normal'),
      makeWord('туда', 'туда́', 'д', 'そこへ', '/tʊˈda/', '[d]', 'normal'),
      makeWord('два', 'два́', 'д', '2', '/dva/', '[d]', 'normal'),
      makeWord('сад', 'са́д', 'д', '庭', '/sat/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('год', 'го́д', 'д', '年', '/got/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('город', 'го́род', 'д', '都市', '/ˈgorət/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('холод', 'хо́лод', 'д', '寒さ', '/ˈxolət/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('завод', 'заво́д', 'д', '工場', '/zɐˈvot/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('сосед', 'сосе́д', 'д', '隣人', '/sɐˈsʲet/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('обед', 'обе́д', 'д', '昼食', '/ɐˈbʲet/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
      makeWord('назад', 'наза́д', 'д', '後ろへ', '/nɐˈsat/', '[t]', 'changed', '語末の д が無声化して [t] になります。'),
    ],
  },
  {
    code: 'z',
    target: 'з',
    normalSound: '[z]',
    changedSound: '[s]',
    rule: 'з は通常 [z]。語末や無声子音の前では [s] に無声化します。',
    words: [
      makeWord('зонт', 'зо́нт', 'з', '傘', '/zont/', '[z]', 'normal'),
      makeWord('завод', 'заво́д', 'з', '工場', '/zɐˈvot/', '[z]', 'normal'),
      makeWord('музыка', 'му́зыка', 'з', '音楽', '/ˈmuzɨkə/', '[z]', 'normal'),
      makeWord('язык', 'язы́к', 'з', '言語・舌', '/jɪˈzɨk/', '[z]', 'normal'),
      makeWord('зима', 'зима́', 'з', '冬', '/zʲɪˈma/', '[zʲ]', 'normal'),
      makeWord('газета', 'газе́та', 'з', '新聞', '/ɡɐˈzʲetə/', '[zʲ]', 'normal'),
      makeWord('магазин', 'магази́н', 'з', '店', '/məɡɐˈzʲin/', '[zʲ]', 'normal'),
      makeWord('глаза', 'глаза́', 'з', '目（複数）', '/ɡlɐˈza/', '[z]', 'normal'),
      makeWord('глаз', 'гла́з', 'з', '目', '/ɡlas/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('мороз', 'моро́з', 'з', '霜・寒気', '/mɐˈros/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('рассказ', 'расска́з', 'з', '物語', '/rɐˈskas/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('арбуз', 'арбу́з', 'з', 'スイカ', '/ɐrˈbus/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('вниз', 'вни́з', 'з', '下へ', '/vnʲis/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('через', 'че́рез', 'з', '〜を通って・〜後に', '/ˈtɕerʲɪs/', '[s]', 'changed', '語末の з が無声化して [s] になります。'),
      makeWord('сказка', 'ска́зка', 'з', 'おとぎ話', '/ˈskaskə/', '[s]', 'changed', '後ろの無声子音 к の影響で з が [s] に無声化します。'),
      makeWord('близко', 'бли́зко', 'з', '近くに', '/ˈblʲiskə/', '[s]', 'changed', '後ろの無声子音 к の影響で з が [s] に無声化します。'),
    ],
  },
  {
    code: 'zh',
    target: 'ж',
    normalSound: '[ʐ]',
    changedSound: '[ʂ]',
    rule: 'ж は通常 [ʐ]。語末や無声子音の前では [ʂ] に無声化します。',
    words: [
      makeWord('журнал', 'журна́л', 'ж', '雑誌', '/ʐʊrˈnal/', '[ʐ]', 'normal'),
      makeWord('жена', 'жена́', 'ж', '妻', '/ʐɨˈna/', '[ʐ]', 'normal'),
      makeWord('уже', 'уже́', 'ж', 'もう', '/ʊˈʐɛ/', '[ʐ]', 'normal'),
      makeWord('жёлтый', 'жёлтый', 'ж', '黄色い', '/ˈʐoltɨj/', '[ʐ]', 'normal'),
      makeWord('живот', 'живо́т', 'ж', 'お腹', '/ʐɨˈvot/', '[ʐ]', 'normal'),
      makeWord('пожалуйста', 'пожа́луйста', 'ж', 'どうぞ・お願いします', '/pɐˈʐalʊjstə/', '[ʐ]', 'normal'),
      makeWord('можно', 'мо́жно', 'ж', '〜してよい・可能', '/ˈmoʐnə/', '[ʐ]', 'normal'),
      makeWord('одежда', 'оде́жда', 'ж', '衣服', '/ɐˈdʲeʐdə/', '[ʐ]', 'normal'),
      makeWord('муж', 'му́ж', 'ж', '夫', '/muʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('нож', 'но́ж', 'ж', 'ナイフ', '/noʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('этаж', 'эта́ж', 'ж', '階', '/ɪˈtaʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('гараж', 'гара́ж', 'ж', 'ガレージ', '/ɡɐˈraʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('пляж', 'пля́ж', 'ж', '海岸', '/plʲaʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('багаж', 'бага́ж', 'ж', '荷物', '/bɐˈɡaʂ/', '[ʂ]', 'changed', '語末の ж が無声化して [ʂ] になります。'),
      makeWord('ложка', 'ло́жка', 'ж', 'スプーン', '/ˈloʂkə/', '[ʂ]', 'changed', '後ろの無声子音 к の影響で ж が [ʂ] に無声化します。'),
      makeWord('книжка', 'кни́жка', 'ж', '本（小さい本）', '/ˈknʲiʂkə/', '[ʂ]', 'changed', '後ろの無声子音 к の影響で ж が [ʂ] に無声化します。'),
    ],
  },
]

// 既存10問と内容が重なりすぎる項目や、同じ語を別の文字で繰り返す一部項目を除き、追加分を90問にする。
const excludedGeneratedKeys = new Set([
  'b:хлеб',
  'b:автобус',
  'v:вода',
  'g:друг',
  'g:его',
  'd:вода',
  'd:сад',
  'd:завод',
  'z:глаз',
  'z:завод',
])

const pickDistractors = (
  family: PronunciationFamily,
  core: PronunciationWord,
  coreIndex: number,
): PronunciationWord[] => {
  const contrastSound = core.group === 'normal' ? family.changedSound : family.normalSound
  const contrastPool = family.words.filter((word) => word.targetSound === contrastSound)

  return Array.from({ length: 3 }, (_, offset) => contrastPool[(coreIndex + offset) % contrastPool.length]!)
}

export const generatedSection1Questions: PronunciationQuestion[] = families.flatMap((family) =>
  family.words
    .filter((core) => !excludedGeneratedKeys.has(`${family.code}:${core.word}`))
    .map((core, coreIndex) => ({
      id: `pron-${family.code}-${core.word}`,
      answer: 0,
      rule: family.rule,
      choices: [core, ...pickDistractors(family, core, coreIndex)].map(({ group: _group, ...choice }) => choice),
    })),
)
