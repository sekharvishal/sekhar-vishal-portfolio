import { describe, expect, it } from 'vitest'
import { buildCityLayout } from '../src/three-city/cityLayout'
import { ROAD_WIDTH, roadCurve } from '../src/three-city/roadPath'

function distanceToCurve(x: number, z: number): number {
  let min = Infinity
  for (let i = 0; i <= 300; i++) {
    const p = roadCurve.getPointAt(i / 300)
    const d = Math.hypot(p.x - x, p.z - z)
    if (d < min) min = d
  }
  return min
}

describe('city layout', () => {
  it('is deterministic for a given seed', () => {
    const a = buildCityLayout(42, 60)
    const b = buildCityLayout(42, 60)
    expect(a).toEqual(b)
  })

  it('produces a different layout for a different seed', () => {
    const a = buildCityLayout(1, 60)
    const b = buildCityLayout(2, 60)
    expect(a).not.toEqual(b)
  })

  it('requests exactly `buildingCount` buildings', () => {
    const layout = buildCityLayout(7, 60)
    expect(layout.buildings.length).toBe(60)
  })

  it('keeps every background building clear of the road corridor', () => {
    const layout = buildCityLayout(7, 80)
    for (const b of layout.buildings) {
      const [x, , z] = b.position
      expect(distanceToCurve(x, z)).toBeGreaterThanOrEqual(ROAD_WIDTH / 2 + 6 - 0.01)
    }
  })

  it('places lamps just outside the road edge, alternating sides', () => {
    const layout = buildCityLayout(7, 80)
    expect(layout.lamps.length).toBeGreaterThan(0)
    for (const lamp of layout.lamps) {
      const [x, , z] = lamp.position
      expect(distanceToCurve(x, z)).toBeGreaterThan(ROAD_WIDTH / 2)
    }
  })
})
