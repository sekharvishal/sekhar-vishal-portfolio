import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import {
  ROAD_POINTS,
  createRoadFrame,
  frameAt,
  frameAtAlloc,
  frameFromTangent,
  roadCurve,
  buildRoadGeometry,
  type RoadFrame,
} from '../src/three-city/roadPath'

const STEPS = 200

function forwardOf(frame: RoadFrame) {
  return new Vector3(0, 0, -1).applyQuaternion(frame.quaternion)
}

describe('road path', () => {
  it('uses at least 10 control points on a Catmull-Rom curve with tension 0.5, all on the XZ plane', () => {
    expect(ROAD_POINTS.length).toBeGreaterThanOrEqual(10)
    expect(roadCurve.curveType).toBe('catmullrom')
    expect(roadCurve.tension).toBe(0.5)
    for (const p of ROAD_POINTS) expect(p.y).toBe(0)
  })

  it('returns finite positions and unit quaternions for t in [0, 1] (incl. endpoints)', () => {
    for (let i = 0; i <= STEPS; i++) {
      const frame = frameAtAlloc(i / STEPS)
      expect([frame.position.x, frame.position.y, frame.position.z].every(Number.isFinite)).toBe(true)
      expect(frame.quaternion.length()).toBeCloseTo(1, 6)
      expect(Number.isNaN(frame.quaternion.x + frame.quaternion.y + frame.quaternion.z + frame.quaternion.w)).toBe(false)
    }
  })

  it('keeps the road frame orthonormal (tangent, normal, binormal mutually perpendicular unit vectors)', () => {
    for (let i = 0; i <= STEPS; i += 5) {
      const frame = frameAtAlloc(i / STEPS)
      expect(frame.tangent.length()).toBeCloseTo(1, 5)
      expect(frame.normal.length()).toBeCloseTo(1, 5)
      expect(frame.binormal.length()).toBeCloseTo(1, 5)
      expect(frame.tangent.dot(frame.normal)).toBeCloseTo(0, 5)
      expect(frame.tangent.dot(frame.binormal)).toBeCloseTo(0, 5)
      expect(frame.normal.dot(frame.binormal)).toBeCloseTo(0, 5)
    }
  })

  it('faces forward along the tangent (local -Z matches the road tangent)', () => {
    for (let i = 0; i <= STEPS; i += 5) {
      const frame = frameAtAlloc(i / STEPS)
      expect(forwardOf(frame).dot(frame.tangent)).toBeGreaterThan(0.99)
    }
  })

  it('clamps out-of-range t', () => {
    expect(frameAtAlloc(-1).position.distanceTo(frameAtAlloc(0).position)).toBeCloseTo(0, 8)
    expect(frameAtAlloc(2).position.distanceTo(frameAtAlloc(1).position)).toBeCloseTo(0, 8)
  })

  it('handles a tangent parallel to the up vector without NaN (degenerate guard)', () => {
    for (const dir of [new Vector3(0, 1, 0), new Vector3(0, -1, 0)]) {
      const frame = frameFromTangent(dir, createRoadFrame())
      expect(Number.isNaN(frame.quaternion.x + frame.quaternion.y + frame.quaternion.z + frame.quaternion.w)).toBe(false)
      expect(frame.quaternion.length()).toBeCloseTo(1, 6)
      expect(forwardOf(frame).dot(dir)).toBeCloseTo(1, 5)
    }
  })

  it('writes into the same frame object every call without allocating a new one', () => {
    const frame = createRoadFrame()
    const result = frameAt(0.3, frame)
    expect(result).toBe(frame)
  })

  it('builds a ribbon geometry with matched position/uv counts and a valid triangle index', () => {
    const geometry = buildRoadGeometry(8, 50)
    expect(geometry.getAttribute('position').count).toBe(2 * 51)
    expect(geometry.getAttribute('uv').count).toBe(2 * 51)
    expect(geometry.getIndex()?.count).toBe(50 * 6)
    geometry.dispose()
  })
})
