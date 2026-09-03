import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3000/toshiaki_Russia_language',
    headless: true,
  },
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000/toshiaki_Russia_language/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
