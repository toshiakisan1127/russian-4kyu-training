import part01 from '../utils/og-image/part01'
import part02 from '../utils/og-image/part02'
import part03 from '../utils/og-image/part03'
import part04 from '../utils/og-image/part04'
import part05 from '../utils/og-image/part05'
import part06 from '../utils/og-image/part06'

const ogImage = Buffer.from(
  part01 + part02 + part03 + part04 + part05 + part06,
  'base64',
)

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'image/png')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return ogImage
})
