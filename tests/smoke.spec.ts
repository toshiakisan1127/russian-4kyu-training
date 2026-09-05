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

  await page.reload({ waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: '続きから再開' })).not.toBeVisible()
  await expect(page.getByRole('button', { name: '模試を開始する' })).toBeVisible()
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
  await expect(page.getByText('1 / 71', { exact: true })).toBeVisible()
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

  await page.getByRole('button', { name: '提出して採点する' }).click()

  await expect(page.getByText('0 / 71', { exact: true })).toBeVisible()
  await expect(page.getByText('翻訳・自己採点 0 / 1', { exact: true })).toBeVisible()

  const review = page.locator('details').filter({ hasText: 'Меня зовут Ира.' }).first()
  await review.locator('summary').click()
  await expect(review).toContainText('模範解答')
  await expect(review.getByRole('button', { name: 'できた' })).toBeVisible()
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
  await expect(page.getByText('4 / 71', { exact: true })).toBeVisible()
})
