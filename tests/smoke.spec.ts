import { expect, test } from '@playwright/test'

const appBasePath = '/russian-4kyu-training'
const routes = [
  '/',
  '/prepositions',
  '/cases',
  '/verbs',
  '/mixed',
  '/vocabulary',
  '/reading',
  '/sections/1',
  '/sections/2',
  '/sections/3',
  '/sections/4',
  '/sections/5',
  '/sections/6',
  '/sections/7',
  '/sections/8',
  '/mock',
  '/translations/ru-ja',
  '/translations/ja-ru',
] as const

for (const route of routes) {
  test(`${route} renders`, async ({ page }) => {
    const response = await page.goto(`${appBasePath}${route}`, { waitUntil: 'networkidle' })

    expect(response?.ok(), `HTTP response failed for ${route}`).toBeTruthy()
    await expect(page.locator('body')).not.toContainText('500 Internal Server Error')
    await expect(page.locator('h1')).toBeVisible()
  })
}

const breadcrumbCases = [
  { route: '/about', parent: 'ホーム', current: 'このサイトについて' },
  { route: '/reference', parent: 'ホーム', current: '4級重要表現まとめ' },
  { route: '/reading', parent: 'ホーム', current: '朗読対策' },
  { route: '/mock', parent: 'ホーム', current: '模擬試験' },
  { route: '/prepositions', parent: '分野別トレーニング', current: '前置詞トレーニング' },
  { route: '/cases', parent: '分野別トレーニング', current: '格変化トレーニング' },
  { route: '/verbs', parent: '分野別トレーニング', current: '動詞トレーニング' },
  { route: '/verbs?filter=motion', parent: '動詞トレーニング', current: '行く系動詞トレーニング' },
  { route: '/mixed', parent: '分野別トレーニング', current: '総合トレーニング' },
  { route: '/vocabulary', parent: '分野別トレーニング', current: '語彙トレーニング' },
  { route: '/translations/ru-ja', parent: '翻訳トレーニング', current: '露文和訳' },
  { route: '/translations/ja-ru', parent: '翻訳トレーニング', current: '和文露訳' },
  { route: '/sections/1', parent: '大問別問題集', current: '第I問・発音' },
  { route: '/sections/8', parent: '大問別問題集', current: '第VIII問・過去形と未来形' },
] as const

for (const breadcrumb of breadcrumbCases) {
  test(`${breadcrumb.route} shows breadcrumbs`, async ({ page }) => {
    await page.goto(`${appBasePath}${breadcrumb.route}`, { waitUntil: 'networkidle' })

    const nav = page.getByRole('navigation', { name: 'パンくずリスト' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: 'ホーム' })).toBeVisible()
    await expect(nav.locator('[aria-current="page"]')).toHaveText(breadcrumb.current)

    if (breadcrumb.parent !== 'ホーム') {
      await expect(nav).toContainText(breadcrumb.parent)
    }
  })
}

test('home does not show breadcrumbs', async ({ page }) => {
  await page.goto(appBasePath, { waitUntil: 'networkidle' })
  await expect(page.getByRole('navigation', { name: 'パンくずリスト' })).toHaveCount(0)
})


test('about page keeps breadcrumbs after reloading a trailing-slash URL', async ({ page }) => {
  await page.goto(`${appBasePath}/about/`, { waitUntil: 'networkidle' })

  const nav = page.getByRole('navigation', { name: 'パンくずリスト' })
  await expect(page).toHaveURL(/\/about\/?$/)
  await expect(nav).toBeVisible()
  await expect(nav.locator('[aria-current="page"]')).toHaveText('このサイトについて')

  await page.getByRole('button', { name: 'ページを再読み込み' }).click()
  await page.waitForLoadState('networkidle')
  await expect(nav).toBeVisible()
  await expect(nav.locator('[aria-current="page"]')).toHaveText('このサイトについて')
})


test('reference page shows irregular noun plurals', async ({ page }) => {
  await page.goto(`${appBasePath}/reference`, { waitUntil: 'networkidle' })

  const section = page.locator('details').filter({ hasText: '不規則・要注意の名詞複数形' })
  await expect(section).toBeVisible()
  await expect(section).toContainText('челове́к')
  await expect(section).toContainText('лю́ди')
  await expect(section).toContainText('жёны')
  await expect(section).toContainText('го́род')
  await expect(section).toContainText('города́')
  await expect(section.locator('[data-testid="irregular-plural-item"]')).toHaveCount(18)
  await expect(section.locator('button')).toHaveCount(36)
})


test('about page shows the build timestamp', async ({ page }) => {
  await page.goto(`${appBasePath}/about`, { waitUntil: 'networkidle' })

  const lastUpdated = page.getByTestId('last-updated')
  await expect(lastUpdated).toBeVisible()
  await expect(lastUpdated).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}T/)
  await expect(lastUpdated).toContainText(/\d{4}年\d{1,2}月\d{1,2}日/)
})


test('movement reference cards contain explanations on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(`${appBasePath}/reference`, { waitUntil: 'networkidle' })

  const movementSection = page.locator('article').filter({ hasText: '「行く」系の動詞 4つ' }).first()
  const cards = movementSection.locator(':scope > div.grid > article')
  await expect(cards).toHaveCount(4)

  const overflow = await movementSection.evaluate((section) => {
    const sectionRect = section.getBoundingClientRect()
    const cardNodes = [...section.querySelectorAll(':scope > div.grid > article')]

    return cardNodes.flatMap((card) => {
      const title = card.querySelector('h3')?.textContent?.trim() ?? 'unknown card'
      const cardRect = card.getBoundingClientRect()
      const issues: string[] = []

      if (cardRect.left < sectionRect.left - 1 || cardRect.right > sectionRect.right + 1) {
        issues.push(`${title} card exceeds movement section`)
      }

      if (card.scrollWidth > card.clientWidth + 1) {
        issues.push(`${title} card has horizontal overflow`)
      }

      for (const paragraph of card.querySelectorAll('p')) {
        if (paragraph.scrollWidth > paragraph.clientWidth + 1) {
          issues.push(`${title} explanation overflows: ${paragraph.textContent?.trim().slice(0, 80)}`)
        }
      }

      return issues
    })
  })

  expect(overflow).toEqual([])
})

test('mock status card scrolls away and avoids fixed utility controls', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await expect(status).toBeVisible()

  const questionFive = page.locator('article').nth(4)
  await expect(questionFive).toContainText('до̲м')
  await expect(questionFive).not.toContainText('д̲ом')

  const assertNoUtilityOverlap = async () => {
    const overlaps = await page.evaluate(() => {
      const status = document.querySelector('[data-testid="mock-exam-status"]')?.getBoundingClientRect()
      const controls = [
        document.querySelector('#theme-toggle')?.getBoundingClientRect(),
        document.querySelector('#theme-toggle + details > summary')?.getBoundingClientRect(),
      ].filter((rect): rect is DOMRect => Boolean(rect))

      if (!status) return ['mock status card is missing']

      return controls
        .filter((rect) => Math.max(status.left, rect.left) < Math.min(status.right, rect.right)
          && Math.max(status.top, rect.top) < Math.min(status.bottom, rect.bottom))
        .map((rect) => `status overlaps utility control at ${Math.round(rect.left)},${Math.round(rect.top)}`)
    })

    expect(overlaps).toEqual([])
  }

  await assertNoUtilityOverlap()
  await status.locator('summary').click()
  await expect(status).toHaveAttribute('open', '')
  await assertNoUtilityOverlap()

  const examContent = page.locator('main')
  for (let index = 0; index < 8; index += 1) {
    await status.locator('nav button').nth(index).click()
    await expect(examContent).not.toContainText('\u0301')
    if (index === 1) await expect(examContent).not.toContainText('\u0332')
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(status).not.toBeInViewport()
})

test('mock exam progress resumes and resets after submission', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })

  await page.getByRole('button', { name: '模試を開始する' }).click()
  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await page.locator('article').nth(0).getByRole('button').nth(0).click()
  await status.locator('nav button').nth(1).click()

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: '続きから再開' })).toBeVisible()
  await page.getByRole('button', { name: '続きから再開' }).click()
  await expect(status).toContainText('第II問')

  await status.locator('summary').click()
  await status.locator('nav button').nth(7).click()
  await expect(page.locator('article').first()).not.toContainText('\\n')
  await status.locator('nav button').last().click()
  await page.getByRole('button', { name: '提出して採点する' }).click()
  await expect(page.getByRole('heading', { name: '採点結果' })).toBeVisible()

  const categoryResults = page.getByTestId('mock-category-results')
  await expect(categoryResults).toContainText('文法')
  await expect(categoryResults).toContainText('0%')
  await expect(categoryResults).toContainText('未達')
  await expect(categoryResults).toContainText('露文和訳')
  await expect(categoryResults).toContainText('未入力')
  await expect(categoryResults).toContainText('和文露訳')

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: '採点結果' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'もう一度、第1回を解く' })).toBeVisible()
})

test('mock section navigation returns to the top', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  await page.getByRole('button', { name: '次の大問 →' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  await page.getByRole('button', { name: '← 前の大問' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('mock section II question 3 has a distinct stress position answer', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(1).click()

  const questionThree = page.locator('article').nth(2)
  await expect(questionThree.locator('button')).toHaveText(['1 улица', '2 письмо', '3 город'])
  await questionThree.getByRole('button', { name: '2 письмо', exact: true }).click()

  await status.locator('nav button').nth(7).click()
  await status.locator('nav button').last().click()
  await page.getByRole('button', { name: '提出して採点する' }).click()
  await expect(page.getByText('1 / 76', { exact: true })).toBeVisible()
})

test('mock section IV matches the stress-tap input UI', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()
  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(3).click()

  const question = page.locator('article').first()
  const input = question.locator('input[type="text"]')
  await expect(input).toHaveCount(1)
  await input.fill('города')
  await expect(question).toContainText('Stress')
  await question.getByRole('button', { name: 'а', exact: true }).click()
  await expect(question).toContainText('回答: города́')
})

test('mock translation questions are self-graded after submission', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(8).click()
  await page.locator('article').first().locator('textarea').fill('昨日は頭が痛かったので、私は一日中家にいました。')

  await status.locator('nav button').last().click()
  await page.getByRole('button', { name: '提出して採点する' }).click()

  await expect(page.getByText('0 / 76', { exact: true })).toBeVisible()
  await expect(page.getByText('翻訳・自己採点 未入力（0/6問）', { exact: true })).toBeVisible()

  const review = page.locator('details').filter({ hasText: 'Меня зовут Ира.' }).first()
  await review.locator('summary').click()
  await expect(review).toContainText('模範解答')
  const selfGradeInput = review.getByRole('spinbutton', { name: '自己採点率' })
  await selfGradeInput.fill('101')
  await expect(review).toContainText('0〜100の整数で入力してください。')
  await selfGradeInput.fill('80')
  await expect(review).toContainText('自己採点：80%')
  await expect(page.getByText('翻訳・自己採点 80%（1/6問）', { exact: true })).toBeVisible()
  await expect(page.getByTestId('mock-category-results').locator('article').filter({ hasText: '露文和訳' })).toContainText('合格')

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: '採点結果' })).toBeVisible()
  const restoredReview = page.locator('details').filter({ hasText: 'Меня зовут Ира.' }).first()
  await restoredReview.locator('summary').click()
  await expect(restoredReview.getByRole('spinbutton', { name: '自己採点率' })).toHaveValue('80')
})

test('mock section X includes Japanese-to-Russian self-graded questions', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(9).click()

  await expect(page.locator('article')).toHaveCount(5)
  await expect(page.locator('article').first()).toContainText('毎週日曜日、私たちは祖母の家へ歩いて行きます。')
  await page.locator('article').first().locator('textarea').fill('Каждое воскресенье мы ходим пешком к бабушке.')

  await page.getByRole('button', { name: '提出して採点する' }).click()

  await expect(page.getByText('0 / 76', { exact: true })).toBeVisible()
  await expect(page.getByText('翻訳・自己採点 未入力（0/6問）', { exact: true })).toBeVisible()

  const review = page.locator('details').filter({ hasText: '毎週日曜日、私たちは祖母の家へ歩いて行きます。' }).first()
  await review.locator('summary').click()
  await expect(review).toContainText('模範解答')
  await expect(review).toContainText('Ка́ждое воскресе́нье мы хо́дим пешко́м к ба́бушке.')
  await review.getByRole('spinbutton', { name: '自己採点率' }).fill('60')
  await expect(review).toContainText('自己採点：60%')
  await expect(page.getByText('翻訳・自己採点 60%（1/6問）', { exact: true })).toBeVisible()
  await expect(page.getByTestId('mock-category-results').locator('article').filter({ hasText: '和文露訳' })).toContainText('未入力')

  const japaneseToRussianGrades = [
    ['昨日、オレグは学校で友だちとロシア語を話しました。', 80],
    ['明日の朝、彼女はバスで仕事へ行くでしょう。', 60],
    ['私たちの教室には大きな窓があります。', 40],
    ['私は夏に海で泳ぐのが好きです。', 20],
  ] as const
  for (const [prompt, percentage] of japaneseToRussianGrades) {
    const questionReview = page.locator('details').filter({ hasText: prompt }).first()
    await questionReview.locator('summary').click()
    await questionReview.getByRole('spinbutton', { name: '自己採点率' }).fill(String(percentage))
  }

  await expect(page.getByText('翻訳・自己採点 60%（5/6問）', { exact: true })).toBeVisible()
  const japaneseToRussianCategory = page.getByTestId('mock-category-results').locator('article').filter({ hasText: '和文露訳' })
  await expect(japaneseToRussianCategory).toContainText('60%')
  await expect(japaneseToRussianCategory).toContainText('合格')
})

test('mock written answers accept accentless spelling', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(6).click()

  const firstQuestionInputs = page.locator('article').first().locator('input')
  await expect(firstQuestionInputs).toHaveCount(2)
  await firstQuestionInputs.nth(0).fill('читаю')
  await firstQuestionInputs.nth(1).fill('читают')

  await status.locator('nav button').nth(7).click()
  const futureQuestionInputs = page.locator('article').first().locator('input')
  await expect(futureQuestionInputs).toHaveCount(2)
  await futureQuestionInputs.nth(0).fill('работала')
  await futureQuestionInputs.nth(1).fill('будет работать')

  await status.locator('nav button').last().click()
  await page.getByRole('button', { name: '提出して採点する' }).click()
  await expect(page.locator('body')).toContainText('бу́дем чита́ть')
  await expect(page.locator('body')).toContainText('бу́дете идти́')
  await expect(page.locator('body')).toContainText('бу́дут учи́ться')
  await expect(page.getByText('4 / 76', { exact: true })).toBeVisible()
})


test('mock review mode filters saved targets without removing them', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1')
    window.localStorage.removeItem('russian-mock-exam-result-v1:mock-1')
    window.localStorage.removeItem('russian-mock-exam-self-grades-v1:mock-1')
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').last().click()
  await page.getByRole('button', { name: '提出して採点する' }).click()

  await page.getByRole('button', { name: '間違えた問題を復習する' }).click()
  await expect(page.getByRole('heading', { name: '模試の復習' })).toBeVisible()

  const reviewItems = page.locator('[data-testid="mock-review-item"]')
  await expect(reviewItems.first()).toBeVisible()

  await page.getByRole('button', { name: '露文和訳' }).click()
  await expect(reviewItems).toHaveCount(1)
  await expect(reviewItems.first()).toContainText('Меня зовут Ира.')
  await expect(reviewItems.first()).toContainText('自己採点')

  await page.getByRole('button', { name: '和文露訳' }).click()
  await expect(reviewItems).toHaveCount(5)
  await expect(reviewItems.first()).toContainText('毎週日曜日、私たちは祖母の家へ歩いて行きます。')

  await page.getByRole('button', { name: '結果に戻る' }).click()
  await expect(page.getByRole('heading', { name: '採点結果' })).toBeVisible()
  const japaneseToRussianCategory = page.getByTestId('mock-category-results').locator('article').filter({ hasText: '和文露訳' })
  await expect(japaneseToRussianCategory).toContainText('60%')
  await expect(japaneseToRussianCategory).toContainText('合格')

  await page.getByRole('button', { name: '間違えた問題を復習する' }).click()
  await page.getByRole('button', { name: '露文和訳' }).click()
  await expect(reviewItems).toHaveCount(1)
})
