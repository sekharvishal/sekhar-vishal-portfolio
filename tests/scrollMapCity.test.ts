import { describe, expect, it } from 'vitest'
import { CITY_FINALE_RELEASE, CITY_FINALE_THRESHOLD, STOPS, mapRange, remap } from '../src/state/scrollMapCity'

describe('city scroll stops', () => {
  it('matches the specified stop progress values, in order', () => {
    expect(STOPS.map((s) => s.t)).toEqual([0.22, 0.46, 0.7, 0.95])
  })

  it('are spaced far enough apart that dwell windows never overlap', () => {
    let prevEnd = -Infinity
    for (const stop of STOPS) {
      const start = stop.t - stop.dwell
      expect(start).toBeGreaterThan(prevEnd)
      prevEnd = stop.t + stop.dwell
    }
  })
})

describe('remap', () => {
  it('is the identity at the endpoints', () => {
    expect(remap(0)).toBe(0)
    expect(remap(1)).toBe(1)
  })

  it('clamps outside [0, 1]', () => {
    expect(remap(-1)).toBe(0)
    expect(remap(2)).toBe(1)
  })

  it('is monotonic non-decreasing across the whole domain', () => {
    let prev = -Infinity
    for (let i = 0; i <= 500; i++) {
      const u = remap(i / 500)
      expect(u).toBeGreaterThanOrEqual(prev - 1e-9)
      prev = u
    }
  })

  it('holds (near-)constant inside each stop dwell window -- the car "parks"', () => {
    for (const stop of STOPS) {
      expect(remap(stop.t - stop.dwell)).toBeCloseTo(stop.t, 6)
      expect(remap(stop.t)).toBeCloseTo(stop.t, 6)
      expect(remap(stop.t + stop.dwell)).toBeCloseTo(stop.t, 6)
    }
  })

  it('still advances between stops', () => {
    expect(remap(0.34)).toBeGreaterThan(STOPS[0].t)
    expect(remap(0.34)).toBeLessThan(STOPS[1].t)
  })
})

describe('finale thresholds', () => {
  it('matches the Grand Finale stop', () => {
    expect(CITY_FINALE_THRESHOLD).toBe(STOPS[STOPS.length - 1].t)
  })
  it('release is below the trigger (hysteresis)', () => {
    expect(CITY_FINALE_RELEASE).toBeLessThan(CITY_FINALE_THRESHOLD)
  })
})

describe('mapRange re-export', () => {
  it('still clamps and interpolates', () => {
    expect(mapRange(0.5, 0, 1)).toBe(0.5)
    expect(mapRange(-1, 0.2, 0.4)).toBe(0)
  })
})
