import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ogImage = readFileSync(fileURLToPath(new URL('../../../public/og-image.png', import.meta.url)))

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'image/png')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return ogImage
})
