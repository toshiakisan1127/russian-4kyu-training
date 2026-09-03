import type { MultipleChoiceQuestion, QuestionChoice } from '~/types/question'

const commonChoices: Record<string, QuestionChoice> = {
  в: { value: 'в', explanation: '場所では前置格、方向では対格を取ります。例: в школе́（学校で）, в шко́лу（学校へ）' },
  на: { value: 'на', explanation: '場所では前置格、方向では対格を取ります。例: на рабо́те（職場で）, на рабо́ту（職場へ）' },
  из: { value: 'из', explanation: '「〜の中から／〜から」。後ろは生格です。例: из шко́лы（学校から）' },
  с: { value: 'с', explanation: '「〜から」なら生格、「〜と一緒に」なら造格を取ります。例: с рабо́ты / с дру́гом' },
  к: { value: 'к', explanation: '「〜のところへ／〜に向かって」。後ろは与格です。例: к врачу́' },
  у: { value: 'у', explanation: '「〜のそばに／〜のところに／〜が持っている」。後ろは生格です。例: у окна́, у меня́' },
  от: { value: 'от', explanation: '「〜から離れて／〜からの」。後ろは生格です。例: от до́ма, письмо́ от дру́га' },
  до: { value: 'до', explanation: '「〜まで」。後ろは生格です。例: до ста́нции' },
  для: { value: 'для', explanation: '「〜のために」。後ろは生格です。例: для дру́га' },
  без: { value: 'без', explanation: '「〜なしで」。後ろは生格です。例: без са́хара' },
  после: { value: 'после', explanation: '「〜の後で」。後ろは生格です。例: по́сле рабо́ты' },
  о: { value: 'о', explanation: '「〜について」。後ろは前置格です。母音の前では об を使うことがあります。' },
  об: { value: 'об', explanation: 'о の形の一つで、母音で始まる語の前などで使います。後ろは前置格です。例: об экза́мене' },
  перед: { value: 'перед', explanation: '「〜の前に」。後ろは造格です。例: пе́ред до́мом' },
  под: { value: 'под', explanation: '場所の「〜の下に」は造格、方向の「〜の下へ」は対格を取ります。' },
  над: { value: 'над', explanation: '「〜の上方に」。後ろは造格です。例: над столо́м' },
  между: { value: 'между', explanation: '「〜の間に」。後ろは造格です。例: ме́жду до́мом и шко́лой' },
}

type Seed = {
  prompt: string
  translation: string
  fullSentence: string
  ipa: string
  answer: keyof typeof commonChoices
  distractors: (keyof typeof commonChoices)[]
  explanation: string
}

const seeds: Seed[] = [
  { prompt: 'Она́ учи́тся ___ университе́те.', translation: '彼女は大学で勉強しています。', fullSentence: 'Она́ учи́тся в университе́те.', ipa: '[ɐˈna ˈutɕɪtsə v ʊnʲɪvʲɪrsʲɪˈtʲetʲe]', answer: 'в', distractors: ['на', 'из', 'к'], explanation: '`в + 前置格` で建物・施設の中で行うことを表します。' },
  { prompt: 'Мы идём ___ кино́.', translation: '私たちは映画館へ行きます。', fullSentence: 'Мы идём в кино́.', ipa: '[mɨ ɪˈdʲom f kʲɪˈno]', answer: 'в', distractors: ['на', 'из', 'к'], explanation: '`в + 対格` で「〜へ」を表します。кино́ は不変化名詞です。' },
  { prompt: 'Де́ти игра́ют ___ па́рке.', translation: '子どもたちは公園で遊んでいます。', fullSentence: 'Де́ти игра́ют в па́рке.', ipa: '[ˈdʲetʲɪ ɪˈɡrajʊt f ˈparkʲe]', answer: 'в', distractors: ['на', 'из', 'у'], explanation: '`в + 前置格` で公園という場所の中を表します。' },
  { prompt: 'Оте́ц рабо́тает ___ ба́нке.', translation: '父は銀行で働いています。', fullSentence: 'Оте́ц рабо́тает в ба́нке.', ipa: '[ɐˈtʲets rɐˈbotəjɪt v ˈbankʲe]', answer: 'в', distractors: ['на', 'из', 'с'], explanation: '`в + 前置格` で施設の中での勤務を表します。' },
  { prompt: 'Я кладу́ кни́гу ___ су́мку.', translation: '私は本をかばんの中に入れます。', fullSentence: 'Я кладу́ кни́гу в су́мку.', ipa: '[ja klɐˈdu ˈknʲiɡʊ f ˈsumkʊ]', answer: 'в', distractors: ['на', 'из', 'под'], explanation: '`в + 対格` で「中へ」という方向を表します。' },
  { prompt: 'Мы живём ___ Росси́и.', translation: '私たちはロシアに住んでいます。', fullSentence: 'Мы живём в Росси́и.', ipa: '[mɨ ʐɨˈvʲom v rɐˈsʲiɪ]', answer: 'в', distractors: ['на', 'из', 'с'], explanation: '`в + 前置格` で国・都市など「〜に住む」を表します。' },
  { prompt: 'Авто́бус е́дет ___ це́нтр.', translation: 'バスは中心街へ向かいます。', fullSentence: 'Авто́бус е́дет в це́нтр.', ipa: '[ɐfˈtobʊs ˈjedʲɪt f ˈtsentr]', answer: 'в', distractors: ['на', 'к', 'из'], explanation: '`в + 対格` で目的地への移動を表します。' },
  { prompt: 'Мы встре́тились ___ кафе́.', translation: '私たちはカフェで会いました。', fullSentence: 'Мы встре́тились в кафе́.', ipa: '[mɨ fstrʲeˈtʲilʲɪsʲ f kɐˈfʲe]', answer: 'в', distractors: ['на', 'у', 'из'], explanation: '`в + 前置格`。кафе́ は不変化なので形は変わりません。' },
  { prompt: 'Она́ пошла́ ___ магази́н.', translation: '彼女は店へ行きました。', fullSentence: 'Она́ пошла́ в магази́н.', ipa: '[ɐˈna pɐˈʂla v məɡɐˈzʲin]', answer: 'в', distractors: ['на', 'из', 'от'], explanation: '`в + 対格` で店の中へ向かうことを表します。' },
  { prompt: 'Молоко́ стои́т ___ холоди́льнике.', translation: '牛乳は冷蔵庫の中にあります。', fullSentence: 'Молоко́ стои́т в холоди́льнике.', ipa: '[məlɐˈko stɐˈit f xəlɐˈdʲilʲnʲɪkʲe]', answer: 'в', distractors: ['на', 'под', 'из'], explanation: '`в + 前置格` で物が中にあることを表します。' },

  { prompt: 'Она́ рабо́тает ___ по́чте.', translation: '彼女は郵便局で働いています。', fullSentence: 'Она́ рабо́тает на по́чте.', ipa: '[ɐˈna rɐˈbotəjɪt nə ˈpotɕtʲe]', answer: 'на', distractors: ['в', 'из', 'к'], explanation: '`на + 前置格`。по́чта は慣用的に на по́чте と言います。' },
  { prompt: 'Мы идём ___ рабо́ту.', translation: '私たちは仕事へ行きます。', fullSentence: 'Мы идём на рабо́ту.', ipa: '[mɨ ɪˈdʲom nə rɐˈbotʊ]', answer: 'на', distractors: ['в', 'с', 'из'], explanation: '`на + 対格` で職場・活動への方向を表します。' },
  { prompt: 'Ко́шка лежи́т ___ дива́не.', translation: '猫はソファーの上にいます。', fullSentence: 'Ко́шка лежи́т на дива́не.', ipa: '[ˈkoʂkə lʲɪˈʐɨt nə dʲɪˈvanʲe]', answer: 'на', distractors: ['в', 'под', 'у'], explanation: '`на + 前置格` で物の表面の「〜の上に」を表します。' },
  { prompt: 'Мы е́дем ___ вокза́л.', translation: '私たちは駅へ向かいます。', fullSentence: 'Мы е́дем на вокза́л.', ipa: '[mɨ ˈjedʲɪm nə vɐɡˈzal]', answer: 'на', distractors: ['в', 'из', 'к'], explanation: '`на + 対格`。вокза́л は目的地として на вокза́л がよく使われます。' },
  { prompt: 'Она́ была́ ___ конце́рте.', translation: '彼女はコンサートにいました。', fullSentence: 'Она́ была́ на конце́рте.', ipa: '[ɐˈna bɨˈla nə kɐnˈtsɛrtʲe]', answer: 'на', distractors: ['в', 'из', 'у'], explanation: '`на + 前置格` でイベント・活動の場を表します。' },
  { prompt: 'Я оста́вил телефо́н ___ столе́.', translation: '私は電話を机の上に置きました。', fullSentence: 'Я оста́вил телефо́н на столе́.', ipa: '[ja ɐˈstavʲɪl tʲɪlʲɪˈfon nə stɐˈlʲe]', answer: 'на', distractors: ['в', 'под', 'из'], explanation: '`на + 前置格` で表面上の場所を表します。' },
  { prompt: 'Ле́том мы бы́ли ___ мо́ре.', translation: '夏、私たちは海にいました。', fullSentence: 'Ле́том мы бы́ли на мо́ре.', ipa: '[ˈlʲetəm mɨ ˈbɨlʲɪ nə ˈmorʲe]', answer: 'на', distractors: ['в', 'из', 'с'], explanation: '「海で／海辺で」は慣用的に `на мо́ре` と言います。' },
  { prompt: 'Он игра́ет ___ гита́ре.', translation: '彼はギターを弾きます。', fullSentence: 'Он игра́ет на гита́ре.', ipa: '[on ɪˈɡrajɪt nə ɡʲɪˈtarʲe]', answer: 'на', distractors: ['в', 'с', 'о'], explanation: '楽器は `игра́ть на + 前置格` で表します。' },
  { prompt: 'Я е́ду ___ авто́бусе.', translation: '私はバスで行きます。', fullSentence: 'Я е́ду на авто́бусе.', ipa: '[ja ˈjedʊ nɐ ɐfˈtobʊsʲe]', answer: 'на', distractors: ['в', 'с', 'к'], explanation: '交通手段は `на + 前置格` で表す基本用法があります。' },
  { prompt: 'Они́ гуля́ют ___ пло́щади.', translation: '彼らは広場を散歩しています。', fullSentence: 'Они́ гуля́ют на пло́щади.', ipa: '[ɐˈnʲi ɡʊˈlʲajʊt nə ˈploɕːɪdʲɪ]', answer: 'на', distractors: ['в', 'из', 'у'], explanation: '`на + 前置格` で広場など開けた場所を表します。' },

  { prompt: 'Он вы́шел ___ до́ма.', translation: '彼は家から出ました。', fullSentence: 'Он вы́шел из до́ма.', ipa: '[on ˈvɨʂəl ɪz ˈdomə]', answer: 'из', distractors: ['с', 'в', 'от'], explanation: '`из + 生格` で内部から外へ出ることを表します。' },
  { prompt: 'Мы верну́лись ___ шко́лы.', translation: '私たちは学校から帰りました。', fullSentence: 'Мы верну́лись из шко́лы.', ipa: '[mɨ vʲɪrˈnulʲɪsʲ ɪʂ ˈʂkolɨ]', answer: 'из', distractors: ['с', 'от', 'в'], explanation: '`в шко́ле / в шко́лу` に対応する出発点は `из шко́лы` です。' },
  { prompt: 'Она́ доста́ла ключ ___ су́мки.', translation: '彼女はかばんから鍵を取り出しました。', fullSentence: 'Она́ доста́ла ключ из су́мки.', ipa: '[ɐˈna dɐˈstalə klʲutɕ ɪs ˈsumkʲɪ]', answer: 'из', distractors: ['с', 'от', 'у'], explanation: '`из + 生格` で容器の中から取り出す意味です。' },
  { prompt: 'Э́то студе́нт ___ Ки́тая.', translation: 'これは中国出身の学生です。', fullSentence: 'Э́то студе́нт из Ки́тая.', ipa: '[ˈɛtə stʊˈdʲent ɪs ˈkʲitəjə]', answer: 'из', distractors: ['с', 'от', 'в'], explanation: '`из + 生格` で出身地を表します。' },
  { prompt: 'Мы прие́хали ___ Петербу́рга.', translation: '私たちはサンクトペテルブルクから来ました。', fullSentence: 'Мы прие́хали из Петербу́рга.', ipa: '[mɨ prʲɪˈjexəlʲɪ ɪs pʲɪtʲɪrˈburɡə]', answer: 'из', distractors: ['с', 'от', 'к'], explanation: '`из + 生格` で都市からの移動を表します。' },
  { prompt: 'Он доста́л де́ньги ___ карма́на.', translation: '彼はポケットからお金を出しました。', fullSentence: 'Он доста́л де́ньги из карма́на.', ipa: '[on dɐˈstal ˈdʲenʲɡʲɪ ɪs kɐrˈmanə]', answer: 'из', distractors: ['с', 'от', 'у'], explanation: '中から取り出すので `из + 生格` です。' },
  { prompt: 'Письмо́ пришло́ ___ Москвы́.', translation: '手紙はモスクワから届きました。', fullSentence: 'Письмо́ пришло́ из Москвы́.', ipa: '[pʲɪsʲˈmo prʲɪʂˈlo ɪz mɐskˈvɨ]', answer: 'из', distractors: ['с', 'от', 'в'], explanation: '都市という起点は `из + 生格` で表します。' },
  { prompt: 'Они́ вы́шли ___ музе́я.', translation: '彼らは博物館から出ました。', fullSentence: 'Они́ вы́шли из музе́я.', ipa: '[ɐˈnʲi ˈvɨʂlʲɪ ɪz mʊˈzʲejə]', answer: 'из', distractors: ['с', 'от', 'на'], explanation: '建物の内部から外へ出るので `из + 生格` です。' },

  { prompt: 'Мы пришли́ ___ конце́рта.', translation: '私たちはコンサートから帰ってきました。', fullSentence: 'Мы пришли́ с конце́рта.', ipa: '[mɨ prʲɪʂˈlʲi s kɐnˈtsɛrtə]', answer: 'с', distractors: ['из', 'от', 'на'], explanation: '`на конце́рт / на конце́рте` に対応する出発点は `с конце́рта` です。' },
  { prompt: 'Он снял кни́гу ___ по́лки.', translation: '彼は棚から本を取りました。', fullSentence: 'Он снял кни́гу с по́лки.', ipa: '[on snʲal ˈknʲiɡʊ s ˈpolkʲɪ]', answer: 'с', distractors: ['из', 'от', 'под'], explanation: '表面・上から取るので `с + 生格` です。' },
  { prompt: 'Я верну́лся ___ вокза́ла.', translation: '私は駅から戻りました。', fullSentence: 'Я верну́лся с вокза́ла.', ipa: '[ja vʲɪrˈnulsʲə z vɐɡˈzalə]', answer: 'с', distractors: ['из', 'от', 'к'], explanation: '`на вокза́л / на вокза́ле` に対応して `с вокза́ла` を使います。' },
  { prompt: 'Она́ пришла́ ___ по́чты.', translation: '彼女は郵便局から来ました。', fullSentence: 'Она́ пришла́ с по́чты.', ipa: '[ɐˈna prʲɪʂˈla s ˈpotɕtɨ]', answer: 'с', distractors: ['из', 'от', 'в'], explanation: '`на по́чте` に対応する出発点は `с по́чты` です。' },
  { prompt: 'Мы е́дем ___ мо́ря.', translation: '私たちは海から帰るところです。', fullSentence: 'Мы е́дем с мо́ря.', ipa: '[mɨ ˈjedʲɪm z ˈmorʲə]', answer: 'с', distractors: ['из', 'от', 'на'], explanation: '`на мо́ре` に対応して `с мо́ря` を使います。' },
  { prompt: 'Возьми́ ча́шку ___ стола́.', translation: '机の上からカップを取ってください。', fullSentence: 'Возьми́ ча́шку со стола́.', ipa: '[vɐzʲˈmʲi ˈtɕaʂkʊ sə stɐˈla]', answer: 'с', distractors: ['из', 'от', 'под'], explanation: '表面から離すので `с + 生格`。発音しやすく `со стола́` となります。' },
  { prompt: 'Я говорю́ ___ преподава́телем.', translation: '私は先生と話しています。', fullSentence: 'Я говорю́ с преподава́телем.', ipa: '[ja ɡəvɐˈrʲu s prʲɪpədɐvɐˈtʲelʲɪm]', answer: 'с', distractors: ['к', 'у', 'от'], explanation: '`с + 造格` で「〜と一緒に／〜と」を表します。' },
  { prompt: 'Она́ пьёт чай ___ молоко́м.', translation: '彼女はミルク入りの紅茶を飲みます。', fullSentence: 'Она́ пьёт чай с молоко́м.', ipa: '[ɐˈna pʲjot tɕaj z məlɐˈkom]', answer: 'с', distractors: ['без', 'из', 'для'], explanation: '`с + 造格` で「〜入り／〜を添えて」を表します。' },
  { prompt: 'Мы гуля́ем ___ друзья́ми.', translation: '私たちは友人たちと散歩しています。', fullSentence: 'Мы гуля́ем с друзья́ми.', ipa: '[mɨ ɡʊˈlʲajɪm z drʊˈzʲjamʲɪ]', answer: 'с', distractors: ['к', 'у', 'от'], explanation: '`с + 造格` で同行者を表します。' },
  { prompt: 'Хлеб ___ сы́ром о́чень вку́сный.', translation: 'チーズ入りのパンはとてもおいしいです。', fullSentence: 'Хлеб с сы́ром о́чень вку́сный.', ipa: '[xlʲep s ˈsɨrəm ˈotɕɪnʲ ˈfkusnɨj]', answer: 'с', distractors: ['без', 'из', 'для'], explanation: '`с + 造格` で付加物を表します。' },

  { prompt: 'Мы подошли́ ___ до́му.', translation: '私たちは家のところまで近づきました。', fullSentence: 'Мы подошли́ к до́му.', ipa: '[mɨ pədɐʂˈlʲi k ˈdomʊ]', answer: 'к', distractors: ['в', 'у', 'от'], explanation: '`к + 与格` で対象への接近を表します。' },
  { prompt: 'Она́ пое́хала ___ роди́телям.', translation: '彼女は両親のところへ行きました。', fullSentence: 'Она́ пое́хала к роди́телям.', ipa: '[ɐˈna pɐˈjexələ k rɐˈdʲitʲɪlʲəm]', answer: 'к', distractors: ['у', 'от', 'в'], explanation: '人のところへ向かうので `к + 与格` です。' },
  { prompt: 'Иди́ ___ доске́.', translation: '黒板のところへ行きなさい。', fullSentence: 'Иди́ к доске́.', ipa: '[ɪˈdʲi k dɐˈskʲe]', answer: 'к', distractors: ['в', 'на', 'у'], explanation: '物への方向・接近は `к + 与格` です。' },
  { prompt: 'Ве́чером я зайду́ ___ дру́гу.', translation: '夕方、私は友人のところへ寄ります。', fullSentence: 'Ве́чером я зайду́ к дру́гу.', ipa: '[ˈvʲetɕɪrəm ja zɐjˈdu k ˈdruɡʊ]', answer: 'к', distractors: ['у', 'от', 'из'], explanation: '人を訪ねる方向は `к + 与格` です。' },
  { prompt: 'По́езд подъезжа́ет ___ ста́нции.', translation: '列車は駅に近づいています。', fullSentence: 'По́езд подъезжа́ет к ста́нции.', ipa: '[ˈpojest pədjɪzˈʐajɪt k ˈstantsɨɪ]', answer: 'к', distractors: ['до', 'от', 'на'], explanation: '「〜に近づく」は `к + 与格` です。' },
  { prompt: 'Ребёнок бежи́т ___ ма́ме.', translation: '子どもは母親のところへ走っています。', fullSentence: 'Ребёнок бежи́т к ма́ме.', ipa: '[rʲɪˈbʲonək bʲɪˈʐɨt k ˈmamʲe]', answer: 'к', distractors: ['у', 'от', 'с'], explanation: '人への方向を表す `к + 与格` です。' },
  { prompt: 'Я обращу́сь ___ врачу́.', translation: '私は医者に相談します。', fullSentence: 'Я обращу́сь к врачу́.', ipa: '[ja ɐbrɐˈɕːusʲ k vrɐˈtɕu]', answer: 'к', distractors: ['у', 'от', 'с'], explanation: '`обрати́ться к + 与格` で「〜に頼る／相談する」です。' },

  { prompt: '___ меня́ есть сестра́.', translation: '私には姉妹がいます。', fullSentence: 'У меня́ есть сестра́.', ipa: '[u mʲɪˈnʲa jestʲ sʲɪsˈtra]', answer: 'у', distractors: ['к', 'от', 'для'], explanation: '`у + 生格 + есть` で所有「〜には…がある」を表します。' },
  { prompt: 'Мы стои́м ___ окна́.', translation: '私たちは窓のそばに立っています。', fullSentence: 'Мы стои́м у окна́.', ipa: '[mɨ stɐˈim u ɐkˈna]', answer: 'у', distractors: ['к', 'до', 'от'], explanation: '`у + 生格` で「〜のそばに」を表します。' },
  { prompt: 'Я был ___ врача́.', translation: '私は医者のところにいました。', fullSentence: 'Я был у врача́.', ipa: '[ja bɨl u vrɐˈtɕa]', answer: 'у', distractors: ['к', 'от', 'в'], explanation: '`у + 生格` で人のところにいることを表します。' },
  { prompt: 'Маши́на стои́т ___ до́ма.', translation: '車は家のそばにあります。', fullSentence: 'Маши́на стои́т у до́ма.', ipa: '[mɐˈʂɨnə stɐˈit u ˈdomə]', answer: 'у', distractors: ['к', 'до', 'от'], explanation: '`у + 生格` で建物の近くを表します。' },
  { prompt: '___ него́ нет маши́ны.', translation: '彼は車を持っていません。', fullSentence: 'У него́ нет маши́ны.', ipa: '[u nʲɪˈvo nʲet mɐˈʂɨnɨ]', answer: 'у', distractors: ['к', 'от', 'для'], explanation: '`у + 生格 + нет` で「〜には…がない」を表します。' },
  { prompt: 'Мы ждём ___ вхо́да.', translation: '私たちは入口のそばで待っています。', fullSentence: 'Мы ждём у вхо́да.', ipa: '[mɨ ʐdʲom u ˈfxodə]', answer: 'у', distractors: ['к', 'до', 'от'], explanation: '`у + 生格` で位置「〜のそば」を表します。' },

  { prompt: 'Он отошёл ___ окна́.', translation: '彼は窓から離れました。', fullSentence: 'Он отошёл от окна́.', ipa: '[on ətɐˈʂol ɐt ɐkˈna]', answer: 'от', distractors: ['из', 'с', 'у'], explanation: '`от + 生格` で対象から離れることを表します。' },
  { prompt: 'Э́то пода́рок ___ дру́га.', translation: 'これは友人からのプレゼントです。', fullSentence: 'Э́то пода́рок от дру́га.', ipa: '[ˈɛtə pɐˈdarək ɐd ˈdruɡə]', answer: 'от', distractors: ['из', 'для', 'у'], explanation: '`от + 生格` で人からの由来・送り主を表します。' },
  { prompt: 'Оста́ньтесь по́дальше ___ огня́.', translation: '火から離れていてください。', fullSentence: 'Оста́ньтесь по́дальше от огня́.', ipa: '[ɐˈstanʲtʲɪsʲ ˈpodəlʲʂɨ ɐt ɐɡˈnʲa]', answer: 'от', distractors: ['из', 'у', 'до'], explanation: '距離を取る対象は `от + 生格` です。' },
  { prompt: 'Письмо́ ___ ба́бушки лежи́т на столе́.', translation: '祖母からの手紙が机の上にあります。', fullSentence: 'Письмо́ от ба́бушки лежи́т на столе́.', ipa: '[pʲɪsʲˈmo ɐd ˈbabʊʂkʲɪ lʲɪˈʐɨt nə stɐˈlʲe]', answer: 'от', distractors: ['из', 'для', 'у'], explanation: '送り主を表す `от + 生格` です。' },
  { prompt: 'Он прие́хал ___ бра́та.', translation: '彼は兄弟のところから来ました。', fullSentence: 'Он прие́хал от бра́та.', ipa: '[on prʲɪˈjexəl ɐd ˈbratə]', answer: 'от', distractors: ['из', 'с', 'к'], explanation: '人のところからという起点は `от + 生格` が使えます。' },

  { prompt: 'Ско́лько идти́ ___ ме́тро?', translation: '地下鉄駅まで歩いてどれくらいですか。', fullSentence: 'Ско́лько идти́ до ме́тро?', ipa: '[ˈskolʲkə ɪdʲˈtʲi də mʲɪˈtro]', answer: 'до', distractors: ['к', 'от', 'у'], explanation: '`до + 生格` で到達点「〜まで」を表します。' },
  { prompt: 'Мы дое́хали ___ Москвы́.', translation: '私たちはモスクワまで行きました。', fullSentence: 'Мы дое́хали до Москвы́.', ipa: '[mɨ dɐˈjexəlʲɪ də mɐskˈvɨ]', answer: 'до', distractors: ['к', 'от', 'из'], explanation: '`до + 生格` で「〜まで到達する」を表します。' },
  { prompt: 'Магази́н рабо́тает ___ девяти́.', translation: '店は9時まで営業しています。', fullSentence: 'Магази́н рабо́тает до девяти́.', ipa: '[məɡɐˈzʲin rɐˈbotəjɪt də dʲɪvʲɪˈtʲi]', answer: 'до', distractors: ['после', 'от', 'к'], explanation: '`до + 生格` は時間の終点「〜まで」も表します。' },
  { prompt: 'До ста́нции пять мину́т.', translation: '駅まで5分です。', fullSentence: 'До ста́нции пять мину́т.', ipa: '[də ˈstantsɨɪ pʲatʲ mʲɪˈnut]', answer: 'до', distractors: ['к', 'от', 'у'], explanation: '距離・所要時間の到達点に `до + 生格` を使います。' },
  { prompt: 'Мы говори́ли ___ по́здней но́чи.', translation: '私たちは夜遅くまで話していました。', fullSentence: 'Мы говори́ли до по́здней но́чи.', ipa: '[mɨ ɡəvɐˈrʲilʲɪ də ˈpozdnʲɪj ˈnotɕɪ]', answer: 'до', distractors: ['после', 'от', 'для'], explanation: '時間の終点を表す `до + 生格` です。' },

  { prompt: 'Э́то кни́га ___ де́тей.', translation: 'これは子ども向けの本です。', fullSentence: 'Э́то кни́га для де́тей.', ipa: '[ˈɛtə ˈknʲiɡə dlʲə ˈdʲetʲej]', answer: 'для', distractors: ['без', 'от', 'у'], explanation: '`для + 生格` で対象・目的「〜のための」を表します。' },
  { prompt: 'Я купи́л цветы́ ___ ма́мы.', translation: '私は母のために花を買いました。', fullSentence: 'Я купи́л цветы́ для ма́мы.', ipa: '[ja kʊˈpʲil tsvʲɪˈtɨ dlʲə ˈmamɨ]', answer: 'для', distractors: ['от', 'без', 'у'], explanation: '`для + 生格` で「〜のために」です。' },
  { prompt: 'Э́то ме́сто ___ маши́н.', translation: 'ここは車用の場所です。', fullSentence: 'Э́то ме́сто для маши́н.', ipa: '[ˈɛtə ˈmʲestə dlʲə mɐˈʂɨn]', answer: 'для', distractors: ['без', 'от', 'до'], explanation: '用途・対象を表す `для + 生格` です。' },
  { prompt: 'Что ну́жно ___ уро́ка?', translation: '授業のために何が必要ですか。', fullSentence: 'Что ну́жно для уро́ка?', ipa: '[ʂto ˈnuʐnə dlʲə ʊˈrokə]', answer: 'для', distractors: ['без', 'после', 'от'], explanation: '目的・用途を表す `для + 生格` です。' },
  { prompt: 'Пода́рок ___ сестры́ уже́ гото́в.', translation: '姉妹へのプレゼントはもう準備できています。', fullSentence: 'Пода́рок для сестры́ уже́ гото́в.', ipa: '[pɐˈdarək dlʲə sʲɪsˈtrɨ ʊˈʐe ɡɐˈtof]', answer: 'для', distractors: ['от', 'без', 'у'], explanation: '受け手・対象を表す `для + 生格` です。' },

  { prompt: 'Я пью ко́фе ___ са́хара.', translation: '私は砂糖なしでコーヒーを飲みます。', fullSentence: 'Я пью ко́фе без са́хара.', ipa: '[ja pʲju ˈkofʲe bʲɪs ˈsaxərə]', answer: 'без', distractors: ['с', 'для', 'из'], explanation: '`без + 生格` で「〜なしで」を表します。' },
  { prompt: 'Он пришёл ___ зо́нта.', translation: '彼は傘なしで来ました。', fullSentence: 'Он пришёл без зо́нта.', ipa: '[on prʲɪˈʂol bʲɪz ˈzontə]', answer: 'без', distractors: ['с', 'для', 'от'], explanation: '`без + 生格` で欠如を表します。' },
  { prompt: 'Она́ не мо́жет жить ___ му́зыки.', translation: '彼女は音楽なしでは生きられません。', fullSentence: 'Она́ не мо́жет жить без му́зыки.', ipa: '[ɐˈna nʲe ˈmoʐɪt ʐɨtʲ bʲɪz ˈmuzɨkʲɪ]', answer: 'без', distractors: ['с', 'для', 'о'], explanation: '`без + 生格` で「〜なしに」を表します。' },
  { prompt: 'Чай ___ лимо́на, пожа́луйста.', translation: 'レモンなしの紅茶をお願いします。', fullSentence: 'Чай без лимо́на, пожа́луйста.', ipa: '[tɕaj bʲɪz lʲɪˈmonə pɐˈʐalʊjstə]', answer: 'без', distractors: ['с', 'для', 'от'], explanation: '`без + 生格`。飲食物の「〜抜き」によく使います。' },
  { prompt: 'Он ушёл ___ сло́ва.', translation: '彼は一言も言わずに去りました。', fullSentence: 'Он ушёл без сло́ва.', ipa: '[on ʊˈʂol bʲɪs ˈslovə]', answer: 'без', distractors: ['с', 'для', 'после'], explanation: '`без + 生格` で「〜なしに」を表します。' },

  { prompt: 'Мы встре́тимся ___ уро́ка.', translation: '私たちは授業の後で会いましょう。', fullSentence: 'Мы встре́тимся по́сле уро́ка.', ipa: '[mɨ fstrʲeˈtʲimsə ˈposlʲe ʊˈrokə]', answer: 'после', distractors: ['до', 'перед', 'для'], explanation: '`по́сле + 生格` で「〜の後で」を表します。' },
  { prompt: '___ рабо́ты я иду́ домо́й.', translation: '仕事の後、私は家に帰ります。', fullSentence: 'По́сле рабо́ты я иду́ домо́й.', ipa: '[ˈposlʲe rɐˈbotɨ ja ɪˈdu dɐˈmoj]', answer: 'после', distractors: ['до', 'перед', 'без'], explanation: '`по́сле + 生格` で時間的な後を表します。' },
  { prompt: 'Мы пое́дем домо́й ___ конце́рта.', translation: '私たちはコンサートの後に家へ帰ります。', fullSentence: 'Мы пое́дем домо́й по́сле конце́рта.', ipa: '[mɨ pɐˈjedʲɪm dɐˈmoj ˈposlʲe kɐnˈtsɛrtə]', answer: 'после', distractors: ['до', 'перед', 'с'], explanation: '`по́сле + 生格` でイベント終了後を表します。' },
  { prompt: '___ обе́да он спит.', translation: '昼食後、彼は寝ます。', fullSentence: 'По́сле обе́да он спит.', ipa: '[ˈposlʲe ɐˈbʲedə on spʲit]', answer: 'после', distractors: ['до', 'перед', 'для'], explanation: '`по́сле + 生格` です。' },
  { prompt: 'Мы гуля́ли ___ до́ждя.', translation: '雨の後、私たちは散歩しました。', fullSentence: 'Мы гуля́ли по́сле до́ждя.', ipa: '[mɨ ɡʊˈlʲalʲɪ ˈposlʲe dɐʐˈdʲa]', answer: 'после', distractors: ['до', 'перед', 'без'], explanation: '`по́сле + 生格` で出来事の後を表します。' },

  { prompt: 'Мы говори́м ___ Росси́и.', translation: '私たちはロシアについて話しています。', fullSentence: 'Мы говори́м о Росси́и.', ipa: '[mɨ ɡəvɐˈrʲim ɐ rɐˈsʲiɪ]', answer: 'о', distractors: ['в', 'из', 'для'], explanation: '`о + 前置格` で話題「〜について」を表します。' },
  { prompt: 'Я ду́маю ___ рабо́те.', translation: '私は仕事について考えています。', fullSentence: 'Я ду́маю о рабо́те.', ipa: '[ja ˈduməjʊ ɐ rɐˈbotʲe]', answer: 'о', distractors: ['на', 'для', 'после'], explanation: '`ду́мать о + 前置格` で「〜について考える」です。' },
  { prompt: 'Он расска́зывает ___ семье́.', translation: '彼は家族について話しています。', fullSentence: 'Он расска́зывает о семье́.', ipa: '[on rɐˈskazɨvəjɪt ɐ sʲɪˈmʲje]', answer: 'о', distractors: ['у', 'для', 'от'], explanation: '`расска́зывать о + 前置格` で話題を表します。' },
  { prompt: 'Мы чита́ем ___ Москве́.', translation: '私たちはモスクワについて読んでいます。', fullSentence: 'Мы чита́ем о Москве́.', ipa: '[mɨ tɕɪˈtajɪm ɐ mɐskˈvʲe]', answer: 'о', distractors: ['в', 'из', 'для'], explanation: '`о + 前置格` で内容・話題を表します。' },
  { prompt: 'Я мечта́ю ___ путеше́ствии.', translation: '私は旅行を夢見ています。', fullSentence: 'Я мечта́ю о путеше́ствии.', ipa: '[ja mʲɪtɕˈtajʊ ɐ pʊtʲɪˈʂestvʲɪɪ]', answer: 'о', distractors: ['в', 'для', 'после'], explanation: '`мечта́ть о + 前置格` で「〜を夢見る」です。' },
  { prompt: 'Мы говори́ли ___ экза́мене.', translation: '私たちは試験について話しました。', fullSentence: 'Мы говори́ли об экза́мене.', ipa: '[mɨ ɡəvɐˈrʲilʲɪ ɐb ɪɡˈzamʲɪnʲe]', answer: 'об', distractors: ['о', 'для', 'после'], explanation: '母音で始まる語の前では `о` が `об` になることがあります。`об экза́мене`。' },
  { prompt: 'Она́ ду́мает ___ отпу́ске.', translation: '彼女は休暇について考えています。', fullSentence: 'Она́ ду́мает об отпу́ске.', ipa: '[ɐˈna ˈduməjɪt ɐb ɐtˈpuskʲe]', answer: 'об', distractors: ['о', 'для', 'после'], explanation: '母音で始まる語の前なので `об + 前置格` が自然です。' },

  { prompt: 'Маши́на стои́т ___ до́мом.', translation: '車は家の前にあります。', fullSentence: 'Маши́на стои́т пе́ред до́мом.', ipa: '[mɐˈʂɨnə stɐˈit ˈpʲerʲɪd ˈdoməm]', answer: 'перед', distractors: ['под', 'над', 'у'], explanation: '`пе́ред + 造格` で空間の「〜の前に」を表します。' },
  { prompt: '___ уро́ком мы повторя́ем слова́.', translation: '授業の前に私たちは単語を復習します。', fullSentence: 'Пе́ред уро́ком мы повторя́ем слова́.', ipa: '[ˈpʲerʲɪd ʊˈrokəm mɨ pəftɐˈrʲajɪm slɐˈva]', answer: 'перед', distractors: ['после', 'до', 'для'], explanation: '`пе́ред + 造格` は時間的な「〜の前に」も表します。' },
  { prompt: 'Он стои́т ___ две́рью.', translation: '彼はドアの前に立っています。', fullSentence: 'Он стои́т пе́ред две́рью.', ipa: '[on stɐˈit ˈpʲerʲɪd ˈdvʲerʲjʊ]', answer: 'перед', distractors: ['под', 'над', 'у'], explanation: '空間の前方は `пе́ред + 造格` です。' },
  { prompt: '___ экза́меном он волну́ется.', translation: '試験前、彼は緊張しています。', fullSentence: 'Пе́ред экза́меном он волну́ется.', ipa: '[ˈpʲerʲɪd ɪɡˈzamʲɪnəm on vɐlˈnujɪtsə]', answer: 'перед', distractors: ['после', 'до', 'для'], explanation: '時間的な直前を `пе́ред + 造格` で表します。' },

  { prompt: 'Соба́ка лежи́т ___ столо́м.', translation: '犬は机の下にいます。', fullSentence: 'Соба́ка лежи́т под столо́м.', ipa: '[sɐˈbakə lʲɪˈʐɨt pɐt stɐˈlom]', answer: 'под', distractors: ['над', 'перед', 'на'], explanation: '場所の「〜の下に」は `под + 造格` です。' },
  { prompt: 'Мы сидим ___ де́ревом.', translation: '私たちは木の下に座っています。', fullSentence: 'Мы сидим под де́ревом.', ipa: '[mɨ sʲɪˈdʲim pɐd ˈdʲerʲɪvəm]', answer: 'под', distractors: ['над', 'перед', 'у'], explanation: '`под + 造格` で位置「〜の下に」を表します。' },
  { prompt: 'Положи́ су́мку ___ стол.', translation: 'かばんを机の下へ置いてください。', fullSentence: 'Положи́ су́мку под стол.', ipa: '[pəlɐˈʐɨ ˈsumkʊ pɐt stol]', answer: 'под', distractors: ['на', 'над', 'перед'], explanation: '方向の「〜の下へ」は `под + 対格` です。' },
  { prompt: 'Ко́шка спрята́лась ___ крова́тью.', translation: '猫はベッドの下に隠れました。', fullSentence: 'Ко́шка спрята́лась под крова́тью.', ipa: '[ˈkoʂkə sprʲɪˈtaləsʲ pɐt krɐˈvatʲjʊ]', answer: 'под', distractors: ['над', 'перед', 'на'], explanation: '位置を表すので `под + 造格` です。' },

  { prompt: 'Ла́мпа виси́т ___ столо́м.', translation: 'ランプは机の上方に掛かっています。', fullSentence: 'Ла́мпа виси́т над столо́м.', ipa: '[ˈlampə vʲɪˈsʲit nɐt stɐˈlom]', answer: 'над', distractors: ['под', 'на', 'перед'], explanation: '`над + 造格` で「〜の上方に」を表します。' },
  { prompt: 'Самолёт лети́т ___ го́родом.', translation: '飛行機は街の上空を飛んでいます。', fullSentence: 'Самолёт лети́т над го́родом.', ipa: '[səmɐˈlʲot lʲɪˈtʲit nɐd ˈɡorədəm]', answer: 'над', distractors: ['под', 'на', 'перед'], explanation: '上空・上方を `над + 造格` で表します。' },
  { prompt: 'Карти́на виси́т ___ дива́ном.', translation: '絵はソファーの上方に掛かっています。', fullSentence: 'Карти́на виси́т над дива́ном.', ipa: '[kɐrˈtʲinə vʲɪˈsʲit nəd dʲɪˈvanəm]', answer: 'над', distractors: ['на', 'под', 'перед'], explanation: '`над + 造格` で物の上方を表します。' },
  { prompt: 'Мост ___ реко́й о́чень ста́рый.', translation: '川に架かる橋はとても古いです。', fullSentence: 'Мост над реко́й о́чень ста́рый.', ipa: '[most nɐt rʲɪˈkoj ˈotɕɪnʲ ˈstarɨj]', answer: 'над', distractors: ['под', 'на', 'между'], explanation: '`над + 造格` で「〜の上に／〜をまたいで」を表します。' },

  { prompt: 'Шко́ла нахо́дится ___ па́рком и ба́нком.', translation: '学校は公園と銀行の間にあります。', fullSentence: 'Шко́ла нахо́дится ме́жду па́рком и ба́нком.', ipa: '[ˈʂkolə nɐˈxodʲɪtsə ˈmʲeʐdʊ ˈparkəm ɪ ˈbankəm]', answer: 'между', distractors: ['перед', 'под', 'у'], explanation: '`ме́жду + 造格` で二つのものの間を表します。' },
  { prompt: 'Стол стои́т ___ окна́ми.', translation: '机は窓と窓の間にあります。', fullSentence: 'Стол стои́т ме́жду окна́ми.', ipa: '[stol stɐˈit ˈmʲeʐdʊ ɐkˈnamʲɪ]', answer: 'между', distractors: ['перед', 'под', 'над'], explanation: '`ме́жду + 造格` で「〜の間に」を表します。' },
  { prompt: 'Между́ на́ми нет секре́тов.', translation: '私たちの間には秘密がありません。', fullSentence: 'Между́ на́ми нет секре́тов.', ipa: '[mʲɪʐˈdu ˈnamʲɪ nʲet sʲɪˈkrʲetəf]', answer: 'между', distractors: ['перед', 'у', 'от'], explanation: '`ме́жду + 造格` は抽象的な「〜の間」も表します。' },
  { prompt: 'Апте́ка ___ магази́ном и кафе́.', translation: '薬局は店とカフェの間にあります。', fullSentence: 'Апте́ка ме́жду магази́ном и кафе́.', ipa: '[ɐpˈtʲekə ˈmʲeʐdʊ məɡɐˈzʲinəm ɪ kɐˈfʲe]', answer: 'между', distractors: ['перед', 'под', 'у'], explanation: '`ме́жду + 造格`。кафе́ は不変化です。' },
]

export const extraPrepositionQuestions: MultipleChoiceQuestion[] = seeds.map((seed, index) => ({
  id: `prep-${String(index + 6).padStart(3, '0')}`,
  category: 'preposition',
  prompt: seed.prompt,
  translation: seed.translation,
  fullSentence: seed.fullSentence,
  ipa: seed.ipa,
  answer: seed.answer,
  correctExplanation: seed.explanation,
  choices: [seed.answer, ...seed.distractors].map((value) => commonChoices[value]),
}))

if (extraPrepositionQuestions.length !== 95) {
  throw new Error(`Extra preposition pool must contain 95 items, got ${extraPrepositionQuestions.length}`)
}
