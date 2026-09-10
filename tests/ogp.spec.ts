import { expect, test } from '@playwright/test'

const appBasePath = '/russian-4kyu-training'
const siteUrl = 'https://russian4kyu-training.com/'
const siteTitle = 'ロシア語能力検定4級対策｜文法・語彙・模擬試験トレーニング'
const siteDescription = 'ロシア語能力検定4級の合格を目指す無料・登録不要の学習サイト。語彙・格変化・動詞活用・前置詞・露文和訳・和文露訳・模擬試験を分野別に練習できます。'
const ogImageUrl = `${siteUrl}og-image.png?v=20260908`

test('home exposes OGP and Twitter Card metadata', async ({ page }) => {
  await page.goto(appBasePath, { waitUntil: 'networkidle' })

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', siteTitle)
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', siteDescription)
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', siteUrl)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', ogImageUrl)
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png')
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', 'ロシア語能力検定4級対策の文法・語彙・模擬試験トレーニング')
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'ロシア語4級トレーニング')
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'ja_JP')
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', siteTitle)
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', siteDescription)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', ogImageUrl)
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', 'ロシア語能力検定4級対策の文法・語彙・模擬試験トレーニング')
})

test('OGP image is a decodable 1200x630 PNG', async ({ page, request }) => {
  const imagePath = `${appBasePath}/og-image.png`
  const response = await request.get(imagePath)
  expect(response.ok()).toBeTruthy()
  expect(response.headers()['content-type']).toContain('image/png')

  const body = await response.body()
  expect(body.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  expect(body.readUInt32BE(16)).toBe(1200)
  expect(body.readUInt32BE(20)).toBe(630)

  await page.goto(appBasePath)
  const dimensions = await page.evaluate(async (src) => {
    const image = new Image()
    image.src = src
    await image.decode()
    return [image.naturalWidth, image.naturalHeight]
  }, imagePath)

  expect(dimensions).toEqual([1200, 630])
})
