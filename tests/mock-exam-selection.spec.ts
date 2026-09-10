import { expect, test } from '@playwright/test'

const appBasePath = '/russian-4kyu-training'

test('second mock exam card does not restore the first mock exam result', async ({ page }) => {
  await page.goto(appBasePath, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    window.localStorage.setItem('russian-mock-exam-result-v1:mock-1', JSON.stringify({
      version: 1,
      answers: {},
      selfGrades: {},
    }))
  })

  await page.getByRole('link', { name: /模擬試験 第2回/ }).click()

  await expect(page).toHaveURL(/\/mock\/?\?exam=mock-2$/)
  await expect(page.getByRole('heading', { level: 1, name: '模擬試験 第2回' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: '採点結果' })).toHaveCount(0)
})

test('saved result is restored only for the requested mock exam', async ({ page }) => {
  await page.goto(appBasePath, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    window.localStorage.setItem('russian-mock-exam-result-v1:mock-2', JSON.stringify({
      version: 1,
      answers: {},
      selfGrades: {},
    }))
  })

  await page.goto(`${appBasePath}/mock/?exam=mock-2`, { waitUntil: 'networkidle' })

  await expect(page.getByRole('heading', { level: 1, name: '採点結果' })).toBeVisible()
  await expect(page.getByText('Result · 模擬試験 第2回')).toBeVisible()
})
