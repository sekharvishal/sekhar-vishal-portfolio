import { describe, expect, it } from 'vitest'
import {
  FINALE_RELEASE,
  FINALE_THRESHOLD,
  STATUE_PARTS,
  STATUE_RANGES,
  clamp01,
  mapRange,
} from '../src/state/scrollMap'

describe('mapRange', () => {
  it('maps linearly inside the range', () => {
    expect(mapRange(0.5, 0, 1)).toBe(0.5)
    expect(mapRange(0.3, 0.2, 0.4)).toBeCloseTo(0.5, 10)
  })
  it('clamps below and above', () => {
    expect(mapRange(-1, 0.2, 0.4)).toBe(0)
    expect(mapRange(5, 0.2, 0.4)).toBe(1)
  })
  it('handles a degenerate range without NaN', () => {
    expect(mapRange(0.1, 0.5, 0.5)).toBe(0)
    expect(mapRange(0.9, 0.5, 0.5)).toBe(1)
  })
  it('clamp01 bounds values', () => {
    expect(clamp01(-0.1)).toBe(0)
    expect(clamp01(1.1)).toBe(1)
    expect(clamp01(0.4)).toBe(0.4)
  })
})

describe('statue ranges', () => {
  it('are valid, ordered bottom to top and never overlap', () => {
    let prevEnd = 0
    for (const part of STATUE_PARTS) {
      const [start, end] = STATUE_RANGES[part]
      expect(start).toBeLessThan(end)
      expect(start).toBeGreaterThanOrEqual(prevEnd)
      expect(end).toBeLessThanOrEqual(1)
      prevEnd = end
    }
  })
  it('matches the specified floors', () => {
    expect(STATUE_RANGES.Base).toEqual([0, 0.2])
    expect(STATUE_RANGES.Head).toEqual([0.8, 0.9])
  })
  it('has every part fully visible by the finale threshold', () => {
    for (const part of STATUE_PARTS) {
      const [a, b] = STATUE_RANGES[part]
      expect(mapRange(0.9, a, b)).toBe(1)
      expect(mapRange(FINALE_THRESHOLD, a, b)).toBe(1)
    }
  })
  it('finale release is below the trigger (hysteresis)', () => {
    expect(FINALE_RELEASE).toBeLessThan(FINALE_THRESHOLD)
  })
})
