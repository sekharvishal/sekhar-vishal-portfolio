import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Matrix4, Quaternion, Vector3 } from 'three'
import { clamp01 } from '../state/scrollMap'

export { mapRange, clamp01 } from '../state/scrollMap'

/** Number of XZ-plane control points the winding road is built from. */
const POINT_COUNT = 12
/** Total length (world units) the road travels along Z. */
export const ROAD_LENGTH = 150
/** Lateral (X) wander amplitude, growing toward the far end. */
const LATERAL_AMPLITUDE = 11
/** World-space width of the drivable road ribbon. */
export const ROAD_WIDTH = 8

/**
 * Control points of the road: a winding S-curve in the XZ plane. Cars,
 * buildings and lamps all sit at y = 0; only the chase camera lifts off it.
 */
export const ROAD_POINTS: Vector3[] = Array.from({ length: POINT_COUNT }, (_, i) => {
  const k = i / (POINT_COUNT - 1)
  const z = -k * ROAD_LENGTH
  const x = Math.sin(k * Math.PI * 2.4) * LATERAL_AMPLITUDE * (0.35 + 0.65 * k)
  return new Vector3(x, 0, z)
})

/** Catmull-Rom spline through the road's control points; tension 0.5 (same "default cruising speed" as the statue's camera path). */
export const roadCurve = new CatmullRomCurve3(ROAD_POINTS, false, 'catmullrom', 0.5)

export interface RoadFrame {
  position: Vector3
  tangent: Vector3
  normal: Vector3
  binormal: Vector3
  quaternion: Quaternion
}

export function createRoadFrame(): RoadFrame {
  return {
    position: new Vector3(),
    tangent: new Vector3(),
    normal: new Vector3(),
    binormal: new Vector3(),
    quaternion: new Quaternion(),
  }
}

const UP = new Vector3(0, 1, 0)
const FALLBACK_UP = new Vector3(0, 0, 1)
const EPSILON = 1e-4
const _forward = new Vector3()
const _basis = new Matrix4()

/**
 * Orthonormal frame from a forward direction alone -> quaternion, also
 * writing `normal` (right) and `binormal` (up) into `frame`.
 *   normal   (right) = tangent x world-up
 *   binormal (up)    = normal x tangent
 * The quaternion looks down local -Z, matching the statue camera's convention
 * (`cameraPath.ts#frenetQuaternion`), so it drops directly onto the chase
 * camera or a procedural car modelled facing -Z. If the tangent is parallel
 * to world-up the cross product degenerates to zero, so a fallback up vector
 * is substituted instead of producing NaNs. Exported standalone (rather than
 * only inlined in `frameAt`) so the degenerate case is directly testable --
 * the actual road never produces one, since every control point lies in the
 * XZ plane and its tangent is therefore always perpendicular to world-up.
 */
export function frameFromTangent(tangent: Vector3, frame: RoadFrame): RoadFrame {
  frame.tangent.copy(tangent)
  frame.normal.crossVectors(tangent, UP)
  if (frame.normal.lengthSq() < EPSILON) frame.normal.crossVectors(tangent, FALLBACK_UP)
  frame.normal.normalize()
  frame.binormal.crossVectors(frame.normal, tangent).normalize()
  _basis.makeBasis(frame.normal, frame.binormal, _forward.copy(tangent).negate())
  frame.quaternion.setFromRotationMatrix(_basis)
  return frame
}

/** Writes the road frame at parameter `t` into `frame` without allocating (safe every frame). */
export function frameAt(t: number, frame: RoadFrame): RoadFrame {
  const u = clamp01(t)
  roadCurve.getPointAt(u, frame.position)
  roadCurve.getTangentAt(u, frame.tangent).normalize()
  return frameFromTangent(frame.tangent, frame)
}

/** Allocating convenience wrapper for one-off lookups (tests, hero-building placement). */
export function frameAtAlloc(t: number): RoadFrame {
  return frameAt(t, createRoadFrame())
}

/**
 * Flat ribbon geometry following the road curve, `width` units wide, sampled
 * in `segments` steps. The caller owns disposal (`geometry.dispose()`).
 */
export function buildRoadGeometry(width = ROAD_WIDTH, segments = 200): BufferGeometry {
  const half = width / 2
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const frame = createRoadFrame()
  const left = new Vector3()
  const right = new Vector3()

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    frameAt(t, frame)
    left.copy(frame.position).addScaledVector(frame.normal, -half)
    right.copy(frame.position).addScaledVector(frame.normal, half)
    positions.push(left.x, left.y + 0.01, left.z, right.x, right.y + 0.01, right.z)
    uvs.push(0, t, 1, t)
    if (i < segments) {
      const a = i * 2
      const b = a + 1
      const c = a + 2
      const d = a + 3
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
