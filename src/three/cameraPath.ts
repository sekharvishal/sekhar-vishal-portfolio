import { CatmullRomCurve3, Matrix4, Quaternion, Vector3 } from 'three'
import { clamp01 } from '../state/scrollMap'

export { mapRange } from '../state/scrollMap'

/** World-space height of the statue column the camera spirals around. */
export const STATUE_HEIGHT = 9
/** Point on the statue axis the finale frames. */
export const STATUE_MID_Y = 4.4

const POINT_COUNT = 10
const TURNS = 1
const START_Y = 1.2
const RISE = 8.6

/**
 * Control points of the flight path: a gentle spiral that climbs steadily on Y
 * while orbiting the central statue column. Equal spacing in Y means the
 * Catmull-Rom curve is exactly monotonic in height.
 */
export const CAMERA_POINTS: Vector3[] = Array.from({ length: POINT_COUNT }, (_, i) => {
  const k = i / (POINT_COUNT - 1)
  const angle = k * TURNS * Math.PI * 2
  const radius = 6.2 - k * 0.8
  return new Vector3(Math.sin(angle) * radius, START_Y + k * RISE, Math.cos(angle) * radius)
})

/**
 * Catmull-Rom spline through every control point. Tension 0.5 is the balanced
 * "default cruising speed" setting: smooth bends, no sharp corners.
 */
export const curve = new CatmullRomCurve3(CAMERA_POINTS, false, 'catmullrom', 0.5)

export interface FinaleOffsets {
  pullBack: number
  focus: number
}

export const NO_FINALE: FinaleOffsets = { pullBack: 0, focus: 0 }

/** How strongly the view direction leans toward the statue rather than along the path. */
const LOOK_BLEND = 0.6
const EPSILON = 1e-4

const UP = new Vector3(0, 1, 0)
const FALLBACK_UP = new Vector3(0, 0, 1)

const _tangent = new Vector3()
const _toAxis = new Vector3()
const _toMid = new Vector3()
const _forward = new Vector3()
const _right = new Vector3()
const _up = new Vector3()
const _basis = new Matrix4()

/**
 * Frenet-style orthonormal frame -> quaternion.
 *   N (right)    = F x U           (forward cross world-up)
 *   B (camera up) = N x F          (re-orthogonalised "binormal")
 * Camera looks down its local -Z, so the basis is (N, B, -F).
 * If F is parallel to U (vertical tangent) the cross product vanishes, so a
 * fallback up vector is used instead of producing NaNs / gimbal flips.
 */
export function frenetQuaternion(forward: Vector3, out: Quaternion): Quaternion {
  _right.crossVectors(forward, UP)
  if (_right.lengthSq() < EPSILON) _right.crossVectors(forward, FALLBACK_UP)
  _right.normalize()
  _up.crossVectors(_right, forward).normalize()
  _basis.makeBasis(_right, _up, _forward.copy(forward).negate())
  return out.setFromRotationMatrix(_basis)
}

/**
 * Writes the camera pose at path parameter `t` into `outPos` / `outQuat`
 * without allocating (safe to call every frame).
 */
export function writePoseAt(
  t: number,
  outPos: Vector3,
  outQuat: Quaternion,
  finale: FinaleOffsets = NO_FINALE,
): void {
  const u = clamp01(t)
  curve.getPointAt(u, outPos)
  curve.getTangentAt(u, _tangent).normalize()

  // Direction to a point on the statue axis, slightly biased toward its middle.
  const targetY = outPos.y + (STATUE_MID_Y - outPos.y) * 0.35
  _toAxis.set(-outPos.x, targetY - outPos.y, -outPos.z).normalize()

  // Look along the path but lean into the statue so it stays in frame.
  _forward.copy(_tangent).multiplyScalar(1 - LOOK_BLEND).addScaledVector(_toAxis, LOOK_BLEND)
  if (_forward.lengthSq() < EPSILON) _forward.copy(_toAxis)
  _forward.normalize()

  if (finale.focus > 0) {
    _toMid.set(-outPos.x, STATUE_MID_Y - outPos.y, -outPos.z).normalize()
    _forward.lerp(_toMid, finale.focus).normalize()
  }
  if (finale.pullBack !== 0) outPos.addScaledVector(_forward, -finale.pullBack)

  frenetQuaternion(_forward, outQuat)
}

export function cameraPoseAt(
  t: number,
  finale: FinaleOffsets = NO_FINALE,
): { position: Vector3; quaternion: Quaternion } {
  const position = new Vector3()
  const quaternion = new Quaternion()
  writePoseAt(t, position, quaternion, finale)
  return { position, quaternion }
}

/** Point on the spline slightly ahead of `t`, used as the depth-of-field focus target. */
export function focusPointAt(t: number, ahead = 0.03, out = new Vector3()): Vector3 {
  return curve.getPointAt(clamp01(t + ahead), out)
}
