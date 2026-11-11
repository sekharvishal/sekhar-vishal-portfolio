import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { KEYFRAMES, curveParam, sampleTrack } from '../src/universe/cameraTrack'
import { CORE_POSITION } from '../src/universe/worldLayout'

describe('universe camera track', () => {
  it('keyframes are strictly increasing in progress and span the whole scroll', () => {
    expect(KEYFRAMES[0].p).toBe(0)
    expect(KEYFRAMES[KEYFRAMES.length - 1].p).toBeCloseTo(1, 10)
    for (let i = 1; i < KEYFRAMES.length; i++) {
      expect(KEYFRAMES[i].p).toBeGreaterThan(KEYFRAMES[i - 1].p)
    }
  })

  it('curveParam is monotonic and holds at every keyframe', () => {
    let last = -1
    for (let i = 0; i <= 400; i++) {
      const u = curveParam(i / 400)
      expect(u).toBeGreaterThanOrEqual(last)
      last = u
    }
    KEYFRAMES.forEach((k, i) => {
      expect(curveParam(k.p)).toBeCloseTo(i / (KEYFRAMES.length - 1), 8)
    })
  })

  it('passes exactly through each keyframe pose', () => {
    const pos = new Vector3()
    const look = new Vector3()
    for (const k of KEYFRAMES) {
      sampleTrack(k.p, pos, look)
      expect(pos.distanceTo(new Vector3(...k.pos))).toBeLessThan(1e-6)
      expect(look.distanceTo(new Vector3(...k.look))).toBeLessThan(1e-6)
    }
  })

  it('never produces NaN and ends looking at the core', () => {
    const pos = new Vector3()
    const look = new Vector3()
    for (let i = 0; i <= 500; i++) {
      sampleTrack(i / 500, pos, look)
      expect(Number.isFinite(pos.x + pos.y + pos.z + look.x + look.y + look.z)).toBe(true)
    }
    sampleTrack(1, pos, look)
    expect(look.distanceTo(new Vector3(...CORE_POSITION))).toBeLessThan(1e-6)
  })
})
