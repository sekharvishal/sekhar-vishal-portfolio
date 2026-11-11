import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer } from '@react-three/postprocessing'
import type { DepthOfFieldEffect } from 'postprocessing'
import { MathUtils, Vector2 } from 'three'
import type { TierSettings } from '../hooks/useDeviceTier'
import { carPose } from '../state/scrollStoreCity'

/** Maximum chromatic-aberration offset reached at full car speed. */
const MAX_OFFSET = 0.006

/**
 * Cinematic lens pipeline for the Neon Run variant: same structure as the
 * statue's `Effects.tsx`, but DoF focuses on the car and the chromatic
 * aberration follows the car's speed instead of scroll velocity.
 */
export function EffectsCity({ settings }: { settings: TierSettings }) {
  const dof = useRef<DepthOfFieldEffect>(null)
  const current = useRef(0)
  const offset = useMemo(() => new Vector2(0, 0), [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)

    current.current = MathUtils.damp(current.current, carPose.speed * MAX_OFFSET, 8, dt)
    offset.set(current.current, current.current)

    const effect = dof.current
    if (effect) {
      if (!effect.target) effect.target = carPose.position.clone()
      else effect.target.copy(carPose.position)
    }
  })

  if (!settings.postprocessing) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.5} luminanceThreshold={0.8} luminanceSmoothing={0.2} mipmapBlur />
      {settings.depthOfField ? (
        <DepthOfField ref={dof} worldFocusRange={9} bokehScale={2.2} resolutionScale={0.5} />
      ) : (
        <></>
      )}
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  )
}
