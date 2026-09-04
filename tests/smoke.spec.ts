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

test('mock present tense answers accept plain spelling with separate stress positions', async ({ page }) => {
  await page.goto(`${appBasePath}/mock`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.localStorage.removeItem('russian-mock-exam-progress-v1:mock-1'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '模試を開始する' }).click()

  const status = page.locator('[data-testid="mock-exam-status"]')
  await status.locator('summary').click()
  await status.locator('nav button').nth(6).click()

  const firstQuestionInputs = page.locator('article').first().locator('input')
  await expect(firstQuestionInputs).toHaveCount(4)
  await firstQuestionInputs.nth(0).fill('читаю')
  await firstQuestionInputs.nth(1).fill('2')
  await firstQuestionInputs.nth(2).fill('читают')
  await firstQuestionInputs.nth(3).fill('2')

  await status.locator('nav button').nth(7).click()
  await page.getByRole('button', { name: '提出して採点する' }).click()
  await expect(page.getByText('4 / 82', { exact: true })).toBeVisible()
})
