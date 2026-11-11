import { mulberry32 } from './rng'

/**
 * Rasterises `lines` on an offscreen canvas and returns world-space x,y pairs
 * (flat array) for the lit pixels, centred on the origin and scaled so the
 * widest line is `worldWidth` units wide. Returns an empty array without canvas support.
 */
export function sampleText(lines: string[], maxPoints: number, worldWidth: number): Float32Array {
  if (typeof document === 'undefined') return new Float32Array(0)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array(0)

  const fontPx = 230
  const lineHeight = fontPx * 0.92
  const width = 1800
  const height = Math.ceil(lineHeight * lines.length + fontPx * 0.4)
  canvas.width = width
  canvas.height = height
  ctx.fillStyle = '#fff'
  ctx.font = `600 ${fontPx}px "Cormorant Garamond", Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const spaced = (s: string) => s.split('').join('\u200A')
  lines.forEach((line, i) => ctx.fillText(spaced(line), width / 2, fontPx * 0.2 + lineHeight * (i + 0.5)))

  const data = ctx.getImageData(0, 0, width, height).data
  const step = 3
  const hits: number[] = []
  let minX = Infinity
  let maxX = -Infinity
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 140) {
        hits.push(x, y)
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }
  if (hits.length === 0) return new Float32Array(0)

  const scale = worldWidth / Math.max(1, maxX - minX)
  const cx = (minX + maxX) / 2
  const cy = height / 2
  const total = hits.length / 2
  const keep = Math.min(total, maxPoints)
  const rand = mulberry32(7)
  const out = new Float32Array(keep * 2)
  // Reservoir-free subsample: pick each point with probability keep/total.
  let written = 0
  const p = keep / total
  for (let i = 0; i < total && written < keep; i++) {
    if (p >= 1 || rand() < p) {
      out[written * 2] = (hits[i * 2] - cx) * scale
      out[written * 2 + 1] = -(hits[i * 2 + 1] - cy) * scale
      written++
    }
  }
  return out.subarray(0, written * 2)
}
