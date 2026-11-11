/** Pure helpers for the Neon Run variant: scroll stops, dwell remap, finale thresholds. */
import { clamp01, mapRange } from './scrollMap'

export { clamp01, mapRange }

export interface ScrollStop {
  id: string
  label: string
  /** Progress (0..1) along the road curve where the car parks. */
  t: number
  /** Half-width, in overall page-scroll progress, of the hold window around `t`. */
  dwell: number
}

/** The four hero-building stops, in the order the road visits them. */
export const STOPS: readonly ScrollStop[] = [
  { id: 'secureW2', label: 'SecureW2 Experience', t: 0.22, dwell: 0.035 },
  { id: 'skillsMatrix', label: 'Skills Matrix', t: 0.46, dwell: 0.035 },
  { id: 'eduEats', label: 'Edu Eats & Projects', t: 0.7, dwell: 0.035 },
  { id: 'grandFinale', label: 'Grand Finale', t: 0.95, dwell: 0.02 },
]

/** Progress at which the Grand Finale (chase-camera pull-back + dashboard) starts. */
export const CITY_FINALE_THRESHOLD = STOPS[STOPS.length - 1].t
/** Progress below which an active finale is released again (hysteresis avoids flicker). */
export const CITY_FINALE_RELEASE = CITY_FINALE_THRESHOLD - 0.02

interface Keyframe {
  p: number
  u: number
}

/**
 * Keyframes of (page-scroll progress -> road progress): flat through each
 * stop's dwell window (the car "parks"), linear in between. Always starts at
 * (0, 0) and ends at (1, 1) so the whole road is covered exactly once.
 */
function buildKeyframes(stops: readonly ScrollStop[]): Keyframe[] {
  const frames: Keyframe[] = [{ p: 0, u: 0 }]
  for (const stop of stops) {
    frames.push({ p: clamp01(stop.t - stop.dwell), u: stop.t })
    frames.push({ p: clamp01(stop.t + stop.dwell), u: stop.t })
  }
  frames.push({ p: 1, u: 1 })
  return frames
}

const KEYFRAMES = buildKeyframes(STOPS)

/**
 * Remaps overall page-scroll progress `p` to the car's progress along the
 * road curve. Piecewise-linear and monotonic non-decreasing.
 */
export function remap(p: number): number {
  const input = clamp01(p)
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const prev = KEYFRAMES[i - 1]
    const cur = KEYFRAMES[i]
    if (input <= cur.p) {
      if (cur.p === prev.p) return cur.u
      const localT = (input - prev.p) / (cur.p - prev.p)
      return prev.u + (cur.u - prev.u) * localT
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1].u
}
