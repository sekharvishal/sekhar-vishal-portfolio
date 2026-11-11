import { CatmullRomCurve3, Vector3 } from 'three'
import { CONTENT_COUNTS, itemProgress, progressOf, type ChapterId } from './universeMap'
import {
  ARCHIVE_CENTER,
  CORE_POSITION,
  SKILL_CENTERS,
  projectSlot,
  stationZ,
  type Vec3,
} from './worldLayout'

export interface Keyframe {
  p: number
  pos: Vec3
  look: Vec3
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

function buildKeyframes(): Keyframe[] {
  const frames: Keyframe[] = []
  const push = (p: number, pos: Vec3, look: Vec3) => frames.push({ p, pos, look })
  const at = (id: ChapterId, local: number) => progressOf(id, local)

  // Origin: start far back, glide up to the name, then dive through it.
  push(0, [0, 0.3, 24], [0, 0.4, 0])
  push(at('origin', 0.5), [0, 0.3, 13], [0, 0.4, 0])
  push(at('origin', 0.92), [0, 0.6, -10], [0, 0, -40])

  // Skills: visit each constellation, alternating sides.
  SKILL_CENTERS.forEach((c, i) => {
    push(itemProgress('skills', i), add(c, [i % 2 === 0 ? 2.5 : -2.5, 1.2, 13.5]), c)
  })

  // Projects: weave between the portals.
  for (let i = 0; i < CONTENT_COUNTS.projects; i++) {
    const s = projectSlot(i)
    push(itemProgress('projects', i), [s[0] * 0.28, s[1] + 0.6, s[2] + 11], s)
  }

  // Journey: fly straight down the tunnel, stopping at each gate.
  for (let i = 0; i < CONTENT_COUNTS.experience; i++) {
    const z = stationZ(i)
    push(itemProgress('journey', i), [0, 0, z + 8], [0, 0, z - 24])
  }

  // Archive: orbit the ring of credentials.
  const a = ARCHIVE_CENTER
  push(itemProgress('archive', 0), add(a, [0, 1.5, 17]), a)
  push(itemProgress('archive', 1), add(a, [13, 6, 8]), a)
  push(itemProgress('archive', 2), add(a, [-13, -3, -4]), a)

  // Contact: approach the core, then pull back to see the whole thing.
  const c = CORE_POSITION
  push(at('contact', 0.25), add(c, [0, 2, 30]), c)
  push(at('contact', 1), add(c, [0, 10, 52]), c)

  return frames
}

export const KEYFRAMES: Keyframe[] = buildKeyframes()

const toVectors = (pick: (k: Keyframe) => Vec3) => KEYFRAMES.map((k) => new Vector3(...pick(k)))
const posCurve = new CatmullRomCurve3(toVectors((k) => k.pos), false, 'centripetal')
const lookCurve = new CatmullRomCurve3(toVectors((k) => k.look), false, 'centripetal')

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Position on the curve parameter for a given scroll progress (holds at each keyframe). */
export function curveParam(progress: number): number {
  const n = KEYFRAMES.length
  if (progress <= KEYFRAMES[0].p) return 0
  if (progress >= KEYFRAMES[n - 1].p) return 1
  for (let j = 0; j < n - 1; j++) {
    const a = KEYFRAMES[j].p
    const b = KEYFRAMES[j + 1].p
    if (progress <= b) {
      const local = b === a ? 1 : (progress - a) / (b - a)
      return (j + smooth(local)) / (n - 1)
    }
  }
  return 1
}

export function sampleTrack(progress: number, outPos: Vector3, outLook: Vector3): void {
  const u = curveParam(progress)
  posCurve.getPoint(u, outPos)
  lookCurve.getPoint(u, outLook)
}
