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
