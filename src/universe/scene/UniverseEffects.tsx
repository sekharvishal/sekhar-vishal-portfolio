import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { MathUtils, Vector2 } from 'three'
import { universe } from '../universeStore'

/** Bloom for every emissive accent, velocity-driven lens split and vignette. Grain is a CSS overlay (blend-mode noise misbehaves on HDR values). */
export function UniverseEffects() {
  // The effect keeps this exact Vector2, so mutating it updates the shader uniform.
  const offset = useMemo(() => new Vector2(0, 0), [])

  useFrame((_, delta) => {
    const speed = Math.min(Math.abs(universe.velocity) / 70, 1)
    const target = 0.0006 + speed * 0.005
    const next = MathUtils.damp(offset.x, target, 8, Math.min(delta, 0.1))
    offset.set(next, next)
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.15} luminanceThreshold={0.62} luminanceSmoothing={0.25} mipmapBlur />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette offset={0.25} darkness={0.8} />
    </EffectComposer>
  )
}
