import { Quaternion, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { CHASE_DISTANCE, CHASE_HEIGHT, computeChaseTarget } from '../src/three-city/chaseCamera'

describe('chase camera offset', () => {
  it('sits behind and above the car when facing -Z with no rotation', () => {
    const carPosition = new Vector3(0, 0, 0)
    const carQuaternion = new Quaternion() // identity: forward = (0, 0, -1)
    const target = computeChaseTarget({ carPosition, carQuaternion, pullBack: 0, liftUp: 0 })
    expect(target.z).toBeCloseTo(CHASE_DISTANCE, 5) // "behind" = +Z, since forward is -Z
    expect(target.y).toBeCloseTo(CHASE_HEIGHT, 5)
    expect(target.x).toBeCloseTo(0, 5)
  })

  it('stays behind the car after a 90-degree turn', () => {
    const carPosition = new Vector3(5, 0, 5)
    const carQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
    const forward = new Vector3(0, 0, -1).applyQuaternion(carQuaternion)
    const target = computeChaseTarget({ carPosition, carQuaternion, pullBack: 0, liftUp: 0 })
    const behindDir = target.clone().sub(carPosition).setY(0).normalize()
    expect(behindDir.dot(forward)).toBeLessThan(-0.99)
  })

  it('is always above the car, regardless of heading', () => {
    for (const angle of [0, Math.PI / 4, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      const carPosition = new Vector3(2, 1, -3)
      const carQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle)
      const target = computeChaseTarget({ carPosition, carQuaternion, pullBack: 0, liftUp: 0 })
      expect(target.y).toBeCloseTo(carPosition.y + CHASE_HEIGHT, 5)
    }
  })

  it('pulls further back and higher during the Grand Finale', () => {
    const carPosition = new Vector3()
    const carQuaternion = new Quaternion()
    const normal = computeChaseTarget({ carPosition, carQuaternion, pullBack: 0, liftUp: 0 })
    const finale = computeChaseTarget({ carPosition, carQuaternion, pullBack: 9, liftUp: 4 })
    expect(finale.z).toBeGreaterThan(normal.z)
    expect(finale.y).toBeGreaterThan(normal.y)
  })
})
