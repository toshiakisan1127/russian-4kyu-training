import { defineConfig } from '@playwright/test'

const isCI = Boolean(process.env.CI)
const webServerCommand = isCI
  ? 'rm -rf .playwright-static && mkdir -p .playwright-static && ln -s ../.output/public .playwright-static/russian-4kyu-training && python3 -m http.server 3000 --directory .playwright-static'
  : 'NUXT_PUBLIC_LAST_UPDATED_AT="$(git log -1 --format=%cI)" pnpm dev --host 127.0.0.1 --port 3000'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: isCI,
  workers: isCI ? 4 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
  },
  webServer: {
    command: webServerCommand,
    url: 'http://127.0.0.1:3000/russian-4kyu-training/',
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
})
