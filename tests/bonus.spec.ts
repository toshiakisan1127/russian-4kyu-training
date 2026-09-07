import { expect, test } from '@playwright/test'

const basePath = '/russian-4kyu-training'

test('opens the bonus page from the bottom of the home page', async ({ page }) => {
  await page.goto(`${basePath}/`)

  await expect(page.getByRole('link', { name: 'おまけ' })).toHaveCount(0)

  const bonusLink = page.getByRole('link', { name: /おまけ：ロシア国歌で遊ぶ/ })
  await expect(bonusLink).toBeVisible()
  await bonusLink.click()

  await expect(page).toHaveURL(new RegExp(`${basePath}/bonus/?$`))
  await expect(page.getByRole('heading', { name: 'ロシア国歌で遊ぶ' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '単語集' })).toBeVisible()
  await expect(page.getByText('горди́ться', { exact: true })).toBeVisible()
})

test('bonus page keeps the learning helpers available', async ({ page }) => {
  await page.goto(`${basePath}/bonus`)

  await expect(page.getByRole('navigation', { name: 'パンくずリスト' }).getByText('おまけ')).toBeVisible()
  await expect(page.getByRole('button', { name: 'アクセントを隠す' })).toBeVisible()
  await expect(page.getByRole('button', { name: '日本語訳を隠す' })).toBeVisible()
  await expect(page.getByRole('button', { name: '朗読する' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '国歌から拾える4級っぽい表現' })).toBeVisible()
})
