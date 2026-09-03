import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/prepositions',
  '/vocabulary',
  '/sections/1',
  '/sections/2',
  '/sections/3',
  '/sections/4',
  '/sections/5',
] as const

for (const route of routes) {
  test(`${route} opens without client-side runtime errors`, async ({ page }) => {
    const pageErrors: string[] = []
    const consoleErrors: string[] = []

    page.on('pageerror', (error) => {
      pageErrors.push(error.message)
    })

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })

    const response = await page.goto(route, { waitUntil: 'networkidle' })

    expect(response?.ok(), `HTTP response failed for ${route}`).toBeTruthy()
    await expect(page.locator('body')).not.toContainText('500 Internal Server Error')
    await expect(page.locator('body')).not.toContainText('An error has occurred')
    expect(pageErrors, `pageerror on ${route}: ${pageErrors.join('\n')}`).toEqual([])
    expect(consoleErrors, `console.error on ${route}: ${consoleErrors.join('\n')}`).toEqual([])
  })
}
