import { deflateSync } from 'node:zlib'

type Color = [number, number, number]

const WIDTH = 1200
const HEIGHT = 630
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '4': ['00100', '01100', '10100', '11111', '00100', '00100', '00100'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
}

const createOgImage = () => {
  const stride = WIDTH * 3 + 1
  const rows = Buffer.alloc(stride * HEIGHT)

  const setPixel = (x: number, y: number, [r, g, b]: Color) => {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    const offset = y * stride + 1 + x * 3
    rows[offset] = r
    rows[offset + 1] = g
    rows[offset + 2] = b
  }

  const getPixel = (x: number, y: number): Color => {
    const offset = y * stride + 1 + x * 3
    return [rows[offset], rows[offset + 1], rows[offset + 2]]
  }

  const blendPixel = (x: number, y: number, color: Color, alpha: number) => {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    const base = getPixel(x, y)
    setPixel(x, y, [
      Math.round(base[0] * (1 - alpha) + color[0] * alpha),
      Math.round(base[1] * (1 - alpha) + color[1] * alpha),
      Math.round(base[2] * (1 - alpha) + color[2] * alpha),
    ])
  }

  const fillRect = (x: number, y: number, width: number, height: number, color: Color) => {
    for (let yy = y; yy < y + height; yy += 1) {
      for (let xx = x; xx < x + width; xx += 1) setPixel(xx, yy, color)
    }
  }

  const fillCircle = (cx: number, cy: number, radius: number, color: Color, alpha: number) => {
    const radiusSquared = radius * radius
    for (let y = Math.max(0, cy - radius); y <= Math.min(HEIGHT - 1, cy + radius); y += 1) {
      for (let x = Math.max(0, cx - radius); x <= Math.min(WIDTH - 1, cx + radius); x += 1) {
        const dx = x - cx
        const dy = y - cy
        if (dx * dx + dy * dy <= radiusSquared) blendPixel(x, y, color, alpha)
      }
    }
  }

  const drawText = (text: string, x: number, y: number, scale: number, color: Color) => {
    let cursor = x
    for (const rawChar of text) {
      const glyph = FONT[rawChar.toUpperCase()] ?? FONT[' ']
      for (let glyphY = 0; glyphY < glyph.length; glyphY += 1) {
        for (let glyphX = 0; glyphX < glyph[glyphY].length; glyphX += 1) {
          if (glyph[glyphY][glyphX] === '1') {
            fillRect(cursor + glyphX * scale, y + glyphY * scale, scale, scale, color)
          }
        }
      }
      cursor += 6 * scale
    }
  }

  for (let y = 0; y < HEIGHT; y += 1) {
    rows[y * stride] = 0
    const ratio = y / (HEIGHT - 1)
    const color: Color = [
      Math.round(79 - 30 * ratio),
      Math.round(70 - 24 * ratio),
      Math.round(229 - 100 * ratio),
    ]
    for (let x = 0; x < WIDTH; x += 1) setPixel(x, y, color)
  }

  fillCircle(1065, 90, 285, [255, 255, 255], 0.08)
  fillCircle(95, 650, 275, [255, 255, 255], 0.05)
  fillRect(88, 92, 212, 212, [79, 70, 229])
  fillRect(101, 105, 186, 4, [199, 210, 254])
  fillRect(101, 287, 186, 4, [199, 210, 254])
  fillRect(101, 105, 4, 186, [199, 210, 254])
  fillRect(283, 105, 4, 186, [199, 210, 254])
  drawText('R', 141, 140, 18, [255, 255, 255])
  fillRect(130, 264, 130, 10, [199, 210, 254])
  drawText('RUSSIAN 4KYU', 350, 120, 11, [255, 255, 255])
  drawText('TRAINING', 350, 220, 11, [255, 255, 255])
  drawText('GRAMMAR  VOCAB  MOCK EXAM', 92, 380, 5, [238, 242, 255])
  drawText('RUSSIAN4KYU-TRAINING.COM', 92, 560, 4, [199, 210, 254])

  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let crc = n
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    }
    return crc >>> 0
  })

  const crc32 = (buffer: Buffer) => {
    let crc = 0xffffffff
    for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
    return (crc ^ 0xffffffff) >>> 0
  }

  const chunk = (type: string, data: Buffer) => {
    const typeBuffer = Buffer.from(type)
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))
    return Buffer.concat([length, typeBuffer, data, crc])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(WIDTH, 0)
  ihdr.writeUInt32BE(HEIGHT, 4)
  ihdr[8] = 8
  ihdr[9] = 2

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const ogImage = createOgImage()

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'image/png')
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return ogImage
})
