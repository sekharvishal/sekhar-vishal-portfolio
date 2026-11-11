import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, type Points } from 'three'
import { livePalette } from '../palettes'
import { mulberry32 } from '../rng'
import { DUST_FRAG, DUST_VERT } from '../shaders'

interface DustCloudProps {
  count: number
  /** Writes the position of particle `i` into `out` (x, y, z). */
  fill: (i: number, out: [number, number, number], rand: () => number) => void
  seed?: number
  size?: number
  opacity?: number
  /** Radians per second around each axis. */
  spin?: [number, number, number]
}

/** GPU-twinkling point cloud: stars, orbit dust. One draw call. */
export function DustCloud({ count, fill, seed = 1, size = 1, opacity = 1, spin }: DustCloudProps) {
  const ref = useRef<Points>(null)

  const geometry = useMemo(() => {
    const rand = mulberry32(seed)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const sizes = new Float32Array(count)
    const tmp: [number, number, number] = [0, 0, 0]
    for (let i = 0; i < count; i++) {
      fill(i, tmp, rand)
      positions.set(tmp, i * 3)
      seeds[i] = rand()
      sizes[i] = 0.5 + Math.pow(rand(), 3) * 2.2
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(positions, 3))
    g.setAttribute('aSeed', new BufferAttribute(seeds, 1))
    g.setAttribute('aSize', new BufferAttribute(sizes, 1))
    return g
  }, [count, fill, seed])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: size },
      uOpacity: { value: opacity },
      uColor: { value: new Color() },
    }),
    [size, opacity],
  )

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uScale.value = size * Math.min(state.viewport.dpr, 2)
    uniforms.uColor.value.copy(livePalette.c)
    if (spin && ref.current) {
      ref.current.rotation.x += spin[0] * delta
      ref.current.rotation.y += spin[1] * delta
      ref.current.rotation.z += spin[2] * delta
    }
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={DUST_VERT}
        fragmentShader={DUST_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
