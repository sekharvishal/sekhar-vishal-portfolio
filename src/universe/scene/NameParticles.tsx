import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, MathUtils, Vector3, type Group } from 'three'
import { profile } from '../../data/content'
import { livePalette } from '../palettes'
import { mulberry32 } from '../rng'
import { sampleText } from '../sampleText'
import { NAME_FRAG, NAME_VERT } from '../shaders'
import { uiStore, universe } from '../universeStore'

const smoothstep = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** The visitor's name, built from particles that condense out of the galaxy and flee the cursor. */
export function NameParticles({ maxPoints, compact }: { maxPoints: number; compact: boolean }) {
  const group = useRef<Group>(null)
  const [targets, setTargets] = useState<Float32Array | null>(null)
  const ray = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])

  useEffect(() => {
    let alive = true
    const lines = compact ? profile.name.toUpperCase().split(' ') : [profile.name.toUpperCase()]
    const run = async () => {
      try {
        await document.fonts.load('600 200px "Cormorant Garamond"')
      } catch {
        /* fall back to the serif stack */
      }
      if (alive) setTargets(sampleText(lines, maxPoints, compact ? 6.2 : 17))
    }
    void run()
    return () => {
      alive = false
    }
  }, [maxPoints, compact])

  const geometry = useMemo(() => {
    if (!targets || targets.length === 0) return null
    const n = targets.length / 2
    const rand = mulberry32(21)
    const position = new Float32Array(n * 3)
    const start = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      position[i * 3] = targets[i * 2]
      position[i * 3 + 1] = targets[i * 2 + 1]
      position[i * 3 + 2] = (rand() - 0.5) * 0.35
      const a = rand() * Math.PI * 2
      const r = 14 + rand() * 46
      start[i * 3] = Math.cos(a) * r
      start[i * 3 + 1] = (rand() - 0.5) * 30
      start[i * 3 + 2] = Math.sin(a) * r - 10
      seed[i] = rand()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(position, 3))
    g.setAttribute('aStart', new BufferAttribute(start, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    return g
  }, [targets])

  useEffect(() => {
    if (!geometry) return
    uiStore.set({ sceneReady: true })
    return () => geometry.dispose()
  }, [geometry])

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uPx: { value: 1 },
      uMouse: { value: new Vector3() },
      uMouseOn: { value: 0 },
      uColorB: { value: new Color() },
      uColorC: { value: new Color() },
    }),
    [],
  )

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const show = universe.smooth < 0.16
    g.visible = show
    if (!show) return

    // Starts shifted right so the headline has room; glides to centre as the camera closes in.
    g.position.x = compact ? 0 : 3.2 * (1 - smoothstep(0.02, 0.42, universe.chapter === 0 ? universe.local : 1))

    const cam = state.camera
    ray.set(universe.pointerX, universe.pointerY, 0.5).unproject(cam)
    dir.copy(ray).sub(cam.position).normalize()
    if (Math.abs(dir.z) > 1e-4) {
      const t = -cam.position.z / dir.z
      if (t > 0) uniforms.uMouse.value.copy(cam.position).addScaledVector(dir, t)
      uniforms.uMouse.value.x -= g.position.x
    }

    const inOrigin = universe.chapter === 0
    uniforms.uMouseOn.value = MathUtils.damp(uniforms.uMouseOn.value, inOrigin && universe.dolly > 0.6 ? 1 : 0, 6, 0.016)
    uniforms.uExplode.value = inOrigin ? smoothstep(0.42, 0.95, universe.local) : 1
    uniforms.uMorph.value = universe.morph
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPx.value = Math.min(state.viewport.dpr, 2)
    uniforms.uColorB.value.copy(livePalette.b)
    uniforms.uColorC.value.copy(livePalette.c)
  })

  if (!geometry) return null

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={NAME_VERT}
          fragmentShader={NAME_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
