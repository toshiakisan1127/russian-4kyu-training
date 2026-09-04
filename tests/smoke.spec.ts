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
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(status).not.toBeInViewport()
})
