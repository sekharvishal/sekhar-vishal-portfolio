import { Color } from 'three'
import { CHAPTERS } from './universeMap'

/** [deep, mid, highlight] per chapter, in the order of `CHAPTERS`. */
export const CHAPTER_COLORS: readonly (readonly [string, string, string])[] = [
  ['#1a0f3a', '#6b3fa0', '#e9c46a'], // origin
  ['#06232e', '#0e7c86', '#7df9ff'], // skills
  ['#2a0a2e', '#a3238e', '#ff7ad9'], // projects
  ['#2b1405', '#c2571a', '#ffb347'], // journey
  ['#062a1c', '#12805a', '#7dffc0'], // archive
  ['#1b1405', '#8c6a1d', '#ffe9a3'], // contact
]

export interface Mood {
  id: string
  label: string
  /** Hue rotation applied to every palette colour (0..1 = full turn). */
  hue: number
}

export const MOODS: readonly Mood[] = [
  { id: 'aurora', label: 'Aurora', hue: 0 },
  { id: 'nebula', label: 'Nebula', hue: 0.2 },
  { id: 'solar', label: 'Solar', hue: -0.32 },
]

export interface PaletteOut {
  a: Color
  b: Color
  c: Color
}

export const makePalette = (): PaletteOut => ({ a: new Color(), b: new Color(), c: new Color() })

const scratch = { x: new Color(), y: new Color() }

function mixInto(out: Color, from: string, to: string, t: number, hue: number) {
  scratch.x.set(from)
  scratch.y.set(to)
  out.copy(scratch.x).lerp(scratch.y, t)
  if (hue !== 0) out.offsetHSL(hue, 0, 0)
}

/** Blend two neighbouring chapter palettes. `chapterFloat` 2.5 = halfway between 2 and 3. */
export function paletteAt(chapterFloat: number, mood: number, out: PaletteOut): PaletteOut {
  const max = CHAPTERS.length - 1
  const f = Math.min(Math.max(chapterFloat, 0), max)
  const i = Math.floor(f)
  const j = Math.min(i + 1, max)
  const t = f - i
  const hue = MOODS[mood % MOODS.length].hue
  mixInto(out.a, CHAPTER_COLORS[i][0], CHAPTER_COLORS[j][0], t, hue)
  mixInto(out.b, CHAPTER_COLORS[i][1], CHAPTER_COLORS[j][1], t, hue)
  mixInto(out.c, CHAPTER_COLORS[i][2], CHAPTER_COLORS[j][2], t, hue)
  return out
}

/** Palette of the current camera position; refreshed once per frame by the camera rig. */
export const livePalette = makePalette()

const accentOut = makePalette()
/** CSS colour for the UI accent of a chapter in a mood. */
export function accentHex(chapter: number, mood: number): string {
  return `#${paletteAt(chapter, mood, accentOut).c.getHexString()}`
}
