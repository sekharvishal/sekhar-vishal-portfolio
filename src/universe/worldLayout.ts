/**
 * Where everything lives in world space. The camera flies down -Z through the
 * chapters: Origin (z 0) -> Skills -> Projects -> Journey tunnel -> Archive -> Core.
 */
export type Vec3 = [number, number, number]

export const SKILL_CENTERS: Vec3[] = [
  [-9, 3, -44],
  [9, -2, -58],
  [-9, -3, -72],
  [9, 3, -86],
  [-2, 4, -100],
]
export const SKILL_RADIUS = 4.6

export const PROJECT_SLOT_Z0 = -130
export const PROJECT_SLOT_STEP = 18
export function projectSlot(i: number): Vec3 {
  return [i % 2 === 0 ? -8 : 8, i % 2 === 0 ? 0.6 : -0.6, PROJECT_SLOT_Z0 - i * PROJECT_SLOT_STEP]
}

export const TUNNEL_Z0 = -230
export const TUNNEL_STEP = 16
export const TUNNEL_LENGTH = 84
export const TUNNEL_START_Z = TUNNEL_Z0 + 16
export function stationZ(i: number): number {
  return TUNNEL_Z0 - i * TUNNEL_STEP
}

export const ARCHIVE_CENTER: Vec3 = [0, 0, -340]
export const ARCHIVE_RADIUS = 8

export const CORE_POSITION: Vec3 = [0, 0, -420]

export const STAR_Z_NEAR = 50
export const STAR_Z_FAR = -470
