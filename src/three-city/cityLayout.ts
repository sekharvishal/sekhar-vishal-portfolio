import { ROAD_LENGTH, ROAD_WIDTH, frameAtAlloc, roadCurve } from './roadPath'

export interface BuildingPlacement {
  position: [number, number, number]
  rotationY: number
  width: number
  depth: number
  height: number
  /** 0..1, drives small per-instance colour/window variation. */
  colorSeed: number
}

export interface LampPlacement {
  position: [number, number, number]
  rotationY: number
}

export interface CityLayout {
  buildings: BuildingPlacement[]
  lamps: LampPlacement[]
}

/** Deterministic PRNG (mulberry32): same seed always produces the same layout. */
function mulberry32(seed: number): () => number {
  let state = seed | 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ROAD_SAMPLE_COUNT = 120
/** Background buildings stay clear of the road + a sidewalk gap. */
const CORRIDOR_BUFFER = ROAD_WIDTH / 2 + 6

function sampleRoad(count = ROAD_SAMPLE_COUNT): { x: number; z: number }[] {
  const points: { x: number; z: number }[] = []
  for (let i = 0; i <= count; i++) {
    const p = roadCurve.getPointAt(i / count)
    points.push({ x: p.x, z: p.z })
  }
  return points
}

function distanceToRoad(x: number, z: number, samples: { x: number; z: number }[]): number {
  let min = Infinity
  for (const p of samples) {
    const dx = p.x - x
    const dz = p.z - z
    const d = Math.sqrt(dx * dx + dz * dz)
    if (d < min) min = d
  }
  return min
}

const FIELD_HALF_WIDTH = 90
const FIELD_START_Z = 20
const FIELD_END_Z = -ROAD_LENGTH - 20
const LAMP_SPACING = 10

/**
 * Deterministic city layout from `seed`: background buildings scattered on
 * both sides of the road, skipped wherever they would land inside the road
 * corridor; street lamps placed at regular intervals just outside the road
 * edge, alternating sides.
 */
export function buildCityLayout(seed: number, buildingCount = 140): CityLayout {
  const rand = mulberry32(seed)
  const samples = sampleRoad()
  const buildings: BuildingPlacement[] = []

  let guard = 0
  while (buildings.length < buildingCount && guard < buildingCount * 20) {
    guard++
    const x = (rand() * 2 - 1) * FIELD_HALF_WIDTH
    const z = FIELD_START_Z + rand() * (FIELD_END_Z - FIELD_START_Z)
    if (distanceToRoad(x, z, samples) < CORRIDOR_BUFFER) continue

    const width = 4 + rand() * 6
    const depth = 4 + rand() * 6
    const height = 6 + rand() * 34
    buildings.push({
      position: [x, 0, z],
      rotationY: rand() * Math.PI * 2,
      width,
      depth,
      height,
      colorSeed: rand(),
    })
  }

  const lamps: LampPlacement[] = []
  const lampSpacingT = LAMP_SPACING / ROAD_LENGTH
  for (let i = 1, t = lampSpacingT; t < 1; i++, t = i * lampSpacingT) {
    const frame = frameAtAlloc(t)
    const side = i % 2 === 0 ? 1 : -1
    const offset = ROAD_WIDTH / 2 + 1.5
    const x = frame.position.x + frame.normal.x * side * offset
    const z = frame.position.z + frame.normal.z * side * offset
    lamps.push({
      position: [x, 0, z],
      rotationY: Math.atan2(frame.tangent.x, frame.tangent.z),
    })
  }

  return { buildings, lamps }
}
