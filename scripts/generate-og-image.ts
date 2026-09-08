import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import part01 from '../server/utils/og-image/part01'
import part02 from '../server/utils/og-image/part02'
import part03 from '../server/utils/og-image/part03'
import part04 from '../server/utils/og-image/part04'
import part05 from '../server/utils/og-image/part05'
import part06 from '../server/utils/og-image/part06'

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const image = Buffer.from(part01 + part02 + part03 + part04 + part05 + part06, 'base64')

if (!image.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error('OGP image payload is not a PNG')
}

if (image.readUInt32BE(16) !== 1200 || image.readUInt32BE(20) !== 630) {
  throw new Error('OGP image must be 1200x630')
}

const publicDir = resolve(process.cwd(), 'public')
await mkdir(publicDir, { recursive: true })
await writeFile(resolve(publicDir, 'og-image.png'), image)
