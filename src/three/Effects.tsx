import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer } from '@react-three/postprocessing'
import type { DepthOfFieldEffect } from 'postprocessing'
import { MathUtils, Vector2, Vector3 } from 'three'
import type { SceneTheme } from '../app/theme'
import type { TierSettings } from '../hooks/useDeviceTier'
import { scrollStore } from '../state/scrollStore'
import { focusPointAt } from './cameraPath'

/** Maximum chromatic-aberration offset reached at full scroll velocity. */
const MAX_OFFSET = 0.006
/** Lenis velocity (px/frame) treated as "full speed". */
const FULL_SPEED = 60

/**
 * Cinematic lens pipeline.
 *  - Bloom: lights up the emissive accents (intensity / threshold from the theme).
 *  - DepthOfField: focus target is the spline point slightly ahead of the camera.
 *  - ChromaticAberration: offset follows scroll velocity and eases back to zero.
 */
export function Effects({ settings, theme }: { settings: TierSettings; theme: SceneTheme }) {
  const dof = useRef<DepthOfFieldEffect>(null)
  const current = useRef(0)
  const focus = useMemo(() => new Vector3(), [])
  // The effect keeps this exact Vector2 instance, so mutating it updates the shader uniform.
  const offset = useMemo(() => new Vector2(0, 0), [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)

    const speed = Math.min(Math.abs(scrollStore.velocity) / FULL_SPEED, 1)
    current.current = MathUtils.damp(current.current, speed * MAX_OFFSET, 8, dt)
    offset.set(current.current, current.current)

    const effect = dof.current
    if (effect) {
      if (!effect.target) effect.target = new Vector3()
      effect.target.copy(focusPointAt(scrollStore.smooth, 0.03, focus))
    }
  })

  if (!settings.postprocessing) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={theme.bloomIntensity}
        luminanceThreshold={theme.bloomThreshold}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      {settings.depthOfField ? (
        <DepthOfField ref={dof} worldFocusRange={9} bokehScale={2.2} resolutionScale={0.5} />
      ) : (
        <></>
      )}
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  )
}
