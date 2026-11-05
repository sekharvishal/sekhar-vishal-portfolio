import { Quaternion, Vector3 } from 'three'

export const CITY_BASE_FOV = 55
/** Chase-camera offset behind the car, in world units along its (roll-free) heading. */
export const CHASE_DISTANCE = 6.5
/** Chase-camera height above the car. */
export const CHASE_HEIGHT = 2.6

export interface ChaseInput {
  carPosition: Vector3
  carQuaternion: Quaternion
  pullBack: number
  liftUp: number
}

const _forward = new Vector3()

/**
 * Pure chase-target calculation (no React, no globals): the point behind and
 * above the car, in the car's heading frame. Kept standalone (and in its own
 * module, away from the `CameraRigCity` component) so the offset math is
 * directly unit-testable without mounting the R3F tree.
 */
export function computeChaseTarget(input: ChaseInput, out = new Vector3()): Vector3 {
  _forward.set(0, 0, -1).applyQuaternion(input.carQuaternion)
  out.copy(input.carPosition).addScaledVector(_forward, -(CHASE_DISTANCE + input.pullBack))
  out.y += CHASE_HEIGHT + input.liftUp
  return out
}
