import { describe, expect, it } from 'vitest'
import { TIER_SETTINGS, classifyDevice } from '../src/hooks/useDeviceTier'

describe('classifyDevice', () => {
  it('treats small or touch devices as low tier', () => {
    expect(classifyDevice({ width: 390, coarsePointer: true })).toBe('low')
    expect(classifyDevice({ width: 700, coarsePointer: false })).toBe('low')
    expect(classifyDevice({ width: 1440, coarsePointer: true })).toBe('low')
  })
  it('treats weak desktops as medium tier', () => {
    expect(classifyDevice({ width: 1440, coarsePointer: false, cores: 4 })).toBe('medium')
    expect(classifyDevice({ width: 1440, coarsePointer: false, cores: 12, memoryGb: 4 })).toBe('medium')
  })
  it('treats capable desktops as high tier', () => {
    expect(classifyDevice({ width: 1920, coarsePointer: false, cores: 12, memoryGb: 8 })).toBe('high')
    expect(classifyDevice({ width: 1920, coarsePointer: false })).toBe('high')
  })
  it('disables expensive effects on lower tiers', () => {
    expect(TIER_SETTINGS.low.postprocessing).toBe(false)
    expect(TIER_SETTINGS.medium.depthOfField).toBe(false)
    expect(TIER_SETTINGS.high.depthOfField).toBe(true)
    expect(TIER_SETTINGS.high.dpr[1]).toBeLessThanOrEqual(1.75)
  })
})
