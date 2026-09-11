import { expect, test } from '@playwright/test'

const appBasePath = '/russian-4kyu-training'
const productionUrl = 'https://russian4kyu-training.com'

test('home explains the 4th grade exam training scope with useful internal links', async ({ page }) => {
  await page.goto(appBasePath, { waitUntil: 'domcontentloaded' })

  const guide = page.locator('section[aria-labelledby="seo-guide-heading"]')
  await expect(guide.getByRole('heading', { name: 'ロシア語能力検定4級の対策を、問題演習でくり返す' })).toBeVisible()
  await expect(guide.getByText('無料・登録不要の個人制作学習サイト')).toBeVisible()
  await expect(guide.locator('a[href$="/vocabulary"]')).toHaveAttribute('href', /\/vocabulary/)
  await expect(guide.locator('a[href$="/verbs"]')).toHaveAttribute('href', /\/verbs/)
  await expect(guide.locator('a[href$="/mock"]')).toHaveAttribute('href', /\/mock/)
})

test('about page is a useful 4th grade exam landing page with study routes', async ({ page }) => {
  await page.goto(`${appBasePath}/about`, { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { level: 1, name: 'ロシア語能力検定4級とは？試験内容と対策' })).toBeVisible()

  const guide = page.locator('section[aria-labelledby="exam-study-heading"]')
  await expect(guide.getByRole('heading', { name: 'ロシア語能力検定4級の対策は、弱点を分けて練習する' })).toBeVisible()
  await expect(guide.locator('a[href$="/verbs"]')).toHaveText('動詞トレーニング →')
  await expect(guide.locator('a[href$="/mock"]')).toHaveText('4級模擬試験 →')
})

test('training pages expose canonical, page-specific social metadata and LearningResource JSON-LD', async ({ page }) => {
  await page.goto(`${appBasePath}/verbs`, { waitUntil: 'domcontentloaded' })

  const expectedTitle = 'ロシア語4級 動詞活用トレーニング｜現在形・過去形・未来形・移動動詞'
  const expectedDescription = 'ロシア語能力検定4級向けの動詞問題。現在形の人称変化、過去形、未来形、完了体・不完了体、移動動詞を練習できます。'
  const expectedCanonical = `${productionUrl}/verbs`

  await expect(page).toHaveTitle(expectedTitle)
  await expect(page.locator(`meta[name="description"][content="${expectedDescription}"]`)).toHaveCount(1)
  await expect(page.locator(`link[rel="canonical"][href="${expectedCanonical}"]`)).toHaveCount(1)
  await expect(page.locator(`meta[property="og:title"][content="${expectedTitle}"]`)).toHaveCount(1)
  await expect(page.locator(`meta[property="og:description"][content="${expectedDescription}"]`)).toHaveCount(1)
  await expect(page.locator(`meta[property="og:url"][content="${expectedCanonical}"]`)).toHaveCount(1)
  await expect(page.locator(`meta[name="twitter:title"][content="${expectedTitle}"]`)).toHaveCount(1)

  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
  const jsonLd = scripts.flatMap((text) => {
    try {
      return [JSON.parse(text)]
    }
    catch {
      return []
    }
  })
  const learningResource = jsonLd.find((item) => item['@type'] === 'LearningResource')

  expect(learningResource).toMatchObject({
    '@type': 'LearningResource',
    url: expectedCanonical,
    educationalLevel: 'ロシア語能力検定4級',
    learningResourceType: 'Practice exercise',
    isAccessibleForFree: true,
  })
})

test('sitemap includes public landing pages and excludes personal-state pages', async ({ request }) => {
  const response = await request.get(`${appBasePath}/sitemap.xml`)
  expect(response.ok()).toBeTruthy()
  const sitemap = await response.text()

  expect(sitemap).toContain(`${productionUrl}/about`)
  expect(sitemap).toContain(`${productionUrl}/mock`)
  expect(sitemap).toContain(`${productionUrl}/vocabulary`)
  expect(sitemap).toContain(`${productionUrl}/verbs`)
  expect(sitemap).not.toContain(`${productionUrl}/dashboard`)
  expect(sitemap).not.toContain(`${productionUrl}/feedback`)
})
