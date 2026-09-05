import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
  },
  webServer: {
    command: 'NUXT_PUBLIC_LAST_UPDATED_AT="$(git log -1 --format=%cI)" pnpm dev --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000/toshiaki_Russia_language/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
