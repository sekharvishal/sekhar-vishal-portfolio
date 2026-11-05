import { Quaternion, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import {
  CAMERA_POINTS,
  cameraPoseAt,
  curve,
  focusPointAt,
  frenetQuaternion,
  STATUE_MID_Y,
} from '../src/three/cameraPath'

const STEPS = 200

function forwardOf(q: Quaternion) {
  return new Vector3(0, 0, -1).applyQuaternion(q)
}
function upOf(q: Quaternion) {
  return new Vector3(0, 1, 0).applyQuaternion(q)
}

describe('camera path', () => {
  it('uses at least 8 control points on a Catmull-Rom curve with tension 0.5', () => {
    expect(CAMERA_POINTS.length).toBeGreaterThanOrEqual(8)
    expect(curve.curveType).toBe('catmullrom')
    expect(curve.tension).toBe(0.5)
  })

  it('returns finite positions and unit quaternions for t in [0, 1] (incl. endpoints)', () => {
    for (let i = 0; i <= STEPS; i++) {
      const { position, quaternion } = cameraPoseAt(i / STEPS)
      expect([position.x, position.y, position.z].every(Number.isFinite)).toBe(true)
      expect(quaternion.length()).toBeCloseTo(1, 6)
      expect(Number.isNaN(quaternion.x + quaternion.y + quaternion.z + quaternion.w)).toBe(false)
    }
  })

  it('clamps out-of-range t', () => {
    expect(cameraPoseAt(-1).position.distanceTo(cameraPoseAt(0).position)).toBeCloseTo(0, 8)
    expect(cameraPoseAt(2).position.distanceTo(cameraPoseAt(1).position)).toBeCloseTo(0, 8)
  })

  it('climbs monotonically (camera Y never decreases)', () => {
    let prev = -Infinity
    for (let i = 0; i <= STEPS; i++) {
      const y = cameraPoseAt(i / STEPS).position.y
      expect(y).toBeGreaterThanOrEqual(prev - 1e-6)
      prev = y
    }
  })

  it('keeps the camera upright (no roll flip) along the whole path', () => {
    for (let i = 0; i <= STEPS; i++) {
      const { quaternion } = cameraPoseAt(i / STEPS)
      expect(upOf(quaternion).y).toBeGreaterThan(0.5)
    }
  })

  it('stays pointed toward the statue column', () => {
    for (let i = 0; i <= STEPS; i++) {
      const { position, quaternion } = cameraPoseAt(i / STEPS)
      const toAxis = new Vector3(-position.x, 0, -position.z).normalize()
      const forwardFlat = forwardOf(quaternion).setY(0).normalize()
      expect(forwardFlat.dot(toAxis)).toBeGreaterThan(0.3)
    }
  })

  it('handles a tangent parallel to the up vector without NaN', () => {
    for (const dir of [new Vector3(0, 1, 0), new Vector3(0, -1, 0)]) {
      const q = frenetQuaternion(dir, new Quaternion())
      expect(Number.isNaN(q.x + q.y + q.z + q.w)).toBe(false)
      expect(q.length()).toBeCloseTo(1, 6)
      expect(forwardOf(q).dot(dir)).toBeCloseTo(1, 5)
    }
  })

  it('finale pulls back and frames the statue centre', () => {
    const start = cameraPoseAt(1)
    const finale = cameraPoseAt(1, { pullBack: 11, focus: 1 })
    expect(finale.position.length()).toBeGreaterThan(start.position.length())
    const toMid = new Vector3(0, STATUE_MID_Y, 0).sub(finale.position).normalize()
    expect(forwardOf(finale.quaternion).dot(toMid)).toBeGreaterThan(0.99)
  })

  it('focus point ahead stays on the curve and is clamped at the end', () => {
    const ahead = focusPointAt(0.5)
    expect(ahead.distanceTo(curve.getPointAt(0.53))).toBeCloseTo(0, 8)
    expect(focusPointAt(1).distanceTo(curve.getPointAt(1))).toBeCloseTo(0, 8)
  })
})
