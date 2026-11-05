/** Pure helpers shared by the camera, statue, overlay and tests. */

/** Progress at which the Grand Finale (zoom-out + dashboard) starts. */
export const FINALE_THRESHOLD = 0.95
/** Progress below which an active finale is released again (hysteresis avoids flicker). */
export const FINALE_RELEASE = 0.93

export function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

/** Normalises `t` from [a, b] to [0, 1], clamped. */
export function mapRange(t: number, a: number, b: number): number {
  if (b === a) return t >= b ? 1 : 0
  return clamp01((t - a) / (b - a))
}

export type StatuePart = 'Base' | 'Torso' | 'LeftArm' | 'RightArm' | 'Head'

/** Floor-by-floor assembly ranges (scroll progress), bottom to top. */
export const STATUE_PARTS: readonly StatuePart[] = ['Base', 'Torso', 'LeftArm', 'RightArm', 'Head']

export const STATUE_RANGES: Record<StatuePart, readonly [number, number]> = {
  Base: [0.0, 0.2],
  Torso: [0.2, 0.45],
  LeftArm: [0.45, 0.6],
  RightArm: [0.6, 0.75],
  Head: [0.8, 0.9],
}
