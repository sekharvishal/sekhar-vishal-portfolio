import { useMemo } from 'react'

export type DeviceTier = 'high' | 'medium' | 'low'

export interface TierSettings {
  particles: number
  shadows: boolean
  shadowMapSize: number
  postprocessing: boolean
  depthOfField: boolean
  glassBlurPx: number
  dpr: [number, number]
}

export const TIER_SETTINGS: Record<DeviceTier, TierSettings> = {
  high: { particles: 1500, shadows: true, shadowMapSize: 1024, postprocessing: true, depthOfField: true, glassBlurPx: 12, dpr: [1, 1.75] },
  medium: { particles: 700, shadows: true, shadowMapSize: 512, postprocessing: true, depthOfField: false, glassBlurPx: 8, dpr: [1, 1.5] },
  low: { particles: 300, shadows: false, shadowMapSize: 512, postprocessing: false, depthOfField: false, glassBlurPx: 4, dpr: [1, 1.25] },
}

interface NavigatorHints {
  hardwareConcurrency?: number
  deviceMemory?: number
}

/** Pure so it can be unit-tested; `hints` mirrors the relevant browser signals. */
export function classifyDevice(hints: {
  width: number
  coarsePointer: boolean
  cores?: number
  memoryGb?: number
}): DeviceTier {
  if (hints.width < 768 || hints.coarsePointer) return 'low'
  if ((hints.cores !== undefined && hints.cores <= 4) || (hints.memoryGb !== undefined && hints.memoryGb <= 4)) return 'medium'
  return 'high'
}

export function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high'
  const nav = navigator as Navigator & NavigatorHints
  return classifyDevice({
    width: window.innerWidth,
    coarsePointer: typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches,
    cores: nav.hardwareConcurrency,
    memoryGb: nav.deviceMemory,
  })
}

export function useDeviceTier(): { tier: DeviceTier; settings: TierSettings } {
  return useMemo(() => {
    const tier = detectTier()
    return { tier, settings: TIER_SETTINGS[tier] }
  }, [])
}
