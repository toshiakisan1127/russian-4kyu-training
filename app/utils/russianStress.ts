const ACUTE = '\u0301'
const VOWEL_RE = /[аеёиоуыэюя]/iu

export const stripStress = (text: string) => text
  .normalize('NFD')
  .replace(/\u0301/gu, '')
  .normalize('NFC')

const vowelIndexes = (text: string) => Array.from(text)
  .map((char, index) => VOWEL_RE.test(char) ? index : -1)
  .filter((index) => index >= 0)

const explicitStressVowelOrdinal = (stressedText: string) => {
  const chars = Array.from(stressedText.normalize('NFC'))
  let vowelOrdinal = 0

  for (const char of chars) {
    if (VOWEL_RE.test(char)) vowelOrdinal += 1
    if (char === ACUTE || char.toLowerCase() === 'ё') return Math.max(1, vowelOrdinal)
  }

  return null
}

const addStressAtCharIndex = (text: string, charIndex: number) => {
  const chars = Array.from(stripStress(text))
  const char = chars[charIndex]
  if (!char || char.toLowerCase() === 'ё') return chars.join('')
  chars[charIndex] = `${char}${ACUTE}`
  return chars.join('')
}

const stressVowelOrdinal = (text: string, ordinal: number) => {
  const plain = stripStress(text)
  const indexes = vowelIndexes(plain)
  if (indexes.length <= 1) return plain
  const target = indexes[Math.min(Math.max(ordinal - 1, 0), indexes.length - 1)]
  return target === undefined ? plain : addStressAtCharIndex(plain, target)
}

const stressFirstVowel = (text: string) => stressVowelOrdinal(text, 1)
const stressLastVowel = (text: string) => {
  const plain = stripStress(text)
  const indexes = vowelIndexes(plain)
  if (indexes.length <= 1) return plain
  const target = indexes.at(-1)
  return target === undefined ? plain : addStressAtCharIndex(plain, target)
}

export const stressLikeLemma = (form: string, stressedLemma: string) => {
  const plain = stripStress(form)
  if (/[ёЁ]/u.test(plain)) return plain
  const ordinal = explicitStressVowelOrdinal(stressedLemma)
  if (ordinal === null) return plain
  return stressVowelOrdinal(plain, ordinal)
}

/**
 * Accent a noun form using russian-nouns-js's stress dictionary result.
 * `endingStress` is true for ending stress and false for stem stress.
 */
export const stressNounForm = (
  form: string,
  stressedLemma: string,
  endingStress?: boolean,
) => {
  const plain = stripStress(form)
  if (/[ёЁ]/u.test(plain) || vowelIndexes(plain).length <= 1) return plain

  if (endingStress === true) return stressLastVowel(plain)

  if (endingStress === false) {
    const lemmaOrdinal = explicitStressVowelOrdinal(stressedLemma)
    const lemmaVowels = vowelIndexes(stripStress(stressedLemma)).length

    // Mobile-stress nouns such as рука́/голова́ move from a stressed
    // nominative ending back onto the stem in some forms (ру́ку/го́лову).
    if (lemmaOrdinal !== null && lemmaOrdinal === lemmaVowels) return stressFirstVowel(plain)

    return lemmaOrdinal === null ? plain : stressVowelOrdinal(plain, lemmaOrdinal)
  }

  return stressLikeLemma(plain, stressedLemma)
}

const verbStressOverrides: Record<string, readonly string[]> = {
  'мочь': ['могу́', 'мо́жешь', 'мо́жет', 'мо́жем', 'мо́жете', 'мо́гут'],
  'хотеть': ['хочу́', 'хо́чешь', 'хо́чет', 'хоти́м', 'хоти́те', 'хотя́т'],
  'видеть': ['ви́жу', 'ви́дишь', 'ви́дит', 'ви́дим', 'ви́дите', 'ви́дят'],
  'идти': ['иду́', 'идёшь', 'идёт', 'идём', 'идёте', 'иду́т'],
  'стоять': ['стою́', 'стои́шь', 'стои́т', 'стои́м', 'стои́те', 'стоя́т'],
  'жить': ['живу́', 'живёшь', 'живёт', 'живём', 'живёте', 'живу́т'],
  'смотреть': ['смотрю́', 'смо́тришь', 'смо́трит', 'смо́трим', 'смо́трите', 'смо́трят'],
  'сидеть': ['сижу́', 'сиди́шь', 'сиди́т', 'сиди́м', 'сиди́те', 'сидя́т'],
  'давать': ['даю́', 'даёшь', 'даёт', 'даём', 'даёте', 'даю́т'],
  'любить': ['люблю́', 'лю́бишь', 'лю́бит', 'лю́бим', 'лю́бите', 'лю́бят'],
  'ждать': ['жду́', 'ждёшь', 'ждёт', 'ждём', 'ждёте', 'жду́т'],
  'лежать': ['лежу́', 'лежи́шь', 'лежи́т', 'лежи́м', 'лежи́те', 'лежа́т'],
  'писать': ['пишу́', 'пи́шешь', 'пи́шет', 'пи́шем', 'пи́шете', 'пи́шут'],
  'ходить': ['хожу́', 'хо́дишь', 'хо́дит', 'хо́дим', 'хо́дите', 'хо́дят'],
  'слышать': ['слы́шу', 'слы́шишь', 'слы́шит', 'слы́шим', 'слы́шите', 'слы́шат'],
  'бояться': ['бою́сь', 'бои́шься', 'бои́тся', 'бои́мся', 'бои́тесь', 'боя́тся'],
  'брать': ['беру́', 'берёшь', 'берёт', 'берём', 'берёте', 'беру́т'],
  'вести': ['веду́', 'ведёшь', 'ведёт', 'ведём', 'ведёте', 'веду́т'],
  'выходить': ['выхожу́', 'выхо́дишь', 'выхо́дит', 'выхо́дим', 'выхо́дите', 'выхо́дят'],
  'просить': ['прошу́', 'про́сишь', 'про́сит', 'про́сим', 'про́сите', 'про́сят'],
  'держать': ['держу́', 'де́ржишь', 'де́ржит', 'де́ржим', 'де́ржите', 'де́ржат'],
  'уходить': ['ухожу́', 'ухо́дишь', 'ухо́дит', 'ухо́дим', 'ухо́дите', 'ухо́дят'],
  'находить': ['нахожу́', 'нахо́дишь', 'нахо́дит', 'нахо́дим', 'нахо́дите', 'нахо́дят'],
  'спать': ['сплю́', 'спи́шь', 'спи́т', 'спи́м', 'спи́те', 'спя́т'],
  'молчать': ['молчу́', 'молчи́шь', 'молчи́т', 'молчи́м', 'молчи́те', 'молча́т'],
  'искать': ['ищу́', 'и́щешь', 'и́щет', 'и́щем', 'и́щете', 'и́щут'],
  'звать': ['зову́', 'зовёшь', 'зовёт', 'зовём', 'зовёте', 'зову́т'],
  'смеяться': ['смею́сь', 'смеёшься', 'смеётся', 'смеёмся', 'смеётесь', 'смею́тся'],
  'приносить': ['приношу́', 'прино́сишь', 'прино́сит', 'прино́сим', 'прино́сите', 'прино́сят'],
  'есть': ['ем', 'ешь', 'ест', 'еди́м', 'еди́те', 'едя́т'],
  'готовить': ['гото́влю', 'гото́вишь', 'гото́вит', 'гото́вим', 'гото́вите', 'гото́вят'],
  'учить': ['учу́', 'у́чишь', 'у́чит', 'у́чим', 'у́чите', 'у́чат'],
  'переводить': ['перевожу́', 'перево́дишь', 'перево́дит', 'перево́дим', 'перево́дите', 'перево́дят'],
  'платить': ['плачу́', 'пла́тишь', 'пла́тит', 'пла́тим', 'пла́тите', 'пла́тят'],
  'ездить': ['е́зжу', 'е́здишь', 'е́здит', 'е́здим', 'е́здите', 'е́здят'],
  'ехать': ['е́ду', 'е́дешь', 'е́дет', 'е́дем', 'е́дете', 'е́дут'],
  'бежать': ['бегу́', 'бежи́шь', 'бежи́т', 'бежи́м', 'бежи́те', 'бегу́т'],
  'петь': ['пою́', 'поёшь', 'поёт', 'поём', 'поёте', 'пою́т'],
  'танцевать': ['танцу́ю', 'танцу́ешь', 'танцу́ет', 'танцу́ем', 'танцу́ете', 'танцу́ют'],
  'носить': ['ношу́', 'но́сишь', 'но́сит', 'но́сим', 'но́сите', 'но́сят'],
  'мыть': ['мо́ю', 'мо́ешь', 'мо́ет', 'мо́ем', 'мо́ете', 'мо́ют'],
  'вставать': ['встаю́', 'встаёшь', 'встаёт', 'встаём', 'встаёте', 'встаю́т'],
  'ложить': ['ложу́', 'ло́жишь', 'ло́жит', 'ло́жим', 'ло́жите', 'ло́жат'],
}

const REFLEXIVE_SUFFIX_RE = /(ся|сь)$/u

const baseVerbLemma = (lemma: string) => lemma.replace(REFLEXIVE_SUFFIX_RE, '')
const baseVerbToken = (token: string) => token.replace(REFLEXIVE_SUFFIX_RE, '')

const addReflexiveSuffix = (accentedBase: string, originalToken: string) => {
  const match = originalToken.match(REFLEXIVE_SUFFIX_RE)
  return match ? `${accentedBase}${match[1]}` : accentedBase
}

export const stressVerbForm = (
  displayedForm: string,
  lemma: string,
  stressedLemma: string,
  formIndex: number,
) => {
  const parts = displayedForm.split(' ')
  const token = parts.at(-1)
  if (!token) return displayedForm

  const direct = verbStressOverrides[lemma]?.[formIndex]
  const baseLemma = baseVerbLemma(lemma)
  const baseOverride = verbStressOverrides[baseLemma]?.[formIndex]
  const accentedToken = direct
    ?? (baseOverride ? addReflexiveSuffix(baseOverride, token) : null)
    ?? addReflexiveSuffix(stressLikeLemma(baseVerbToken(token), stressedLemma), token)

  parts[parts.length - 1] = accentedToken
  return parts.join(' ')
}

export const stressAdjectiveForm = (form: string, stressedLemma: string) => {
  const alternatives = form.split(/\s*\/\s*/u)
  return alternatives
    .map((alternative) => {
      const noteMatch = alternative.match(/^(.*?)(（.*）)?$/u)
      const word = noteMatch?.[1]?.trim() ?? alternative
      const note = noteMatch?.[2] ?? ''
      return `${stressLikeLemma(word, stressedLemma)}${note}`
    })
    .join(' / ')
}
