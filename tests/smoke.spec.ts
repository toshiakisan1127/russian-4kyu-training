import { expect, test } from '@playwright/test'

const appBasePath = '/toshiaki_Russia_language'
const routes = [
  '/',
  '/prepositions',
  '/cases',
  '/vocabulary',
  '/sections/1',
  '/sections/2',
  '/sections/3',
  '/sections/4',
  '/sections/5',
  '/sections/6',
  '/sections/7',
  '/sections/8',
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
