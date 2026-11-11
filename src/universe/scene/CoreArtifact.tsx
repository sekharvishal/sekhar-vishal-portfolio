import { useCallback, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, type Group, type Mesh, type MeshBasicMaterial, type PointLight } from 'three'
import { livePalette } from '../palettes'
import { CORE_FRAG, CORE_VERT } from '../shaders'
import { universe } from '../universeStore'
import { CORE_POSITION } from '../worldLayout'
import { DustCloud } from './DustCloud'

const RINGS: { radius: number; tube: number; tilt: [number, number, number]; speed: number }[] = [
  { radius: 5.2, tube: 0.04, tilt: [1.2, 0.2, 0], speed: 0.35 },
  { radius: 6.6, tube: 0.03, tilt: [0.3, 0.9, 0.4], speed: -0.25 },
  { radius: 8.2, tube: 0.025, tilt: [-0.7, 0.1, 1.1], speed: 0.18 },
]

/** The finale: a living, noise-displaced sphere with orbiting rings and a halo of dust. */
export function CoreArtifact({ dust }: { dust: number }) {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const light = useRef<PointLight>(null)
  const ringRefs = useRef<(Group | null)[]>([])
  const ringMats = useRef<(MeshBasicMaterial | null)[]>([])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uA: { value: new Color() },
      uB: { value: new Color() },
      uC: { value: new Color() },
    }),
    [],
  )

  const fillShell = useCallback((_: number, out: [number, number, number], rand: () => number) => {
    const u = rand() * 2 - 1
    const a = rand() * Math.PI * 2
    const r = 7 + Math.pow(rand(), 0.7) * 14
    const s = Math.sqrt(1 - u * u)
    out[0] = Math.cos(a) * s * r
    out[1] = u * r * 0.7
    out[2] = Math.sin(a) * s * r
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const near = universe.chapter >= 4
    g.visible = near
    if (!near) return

    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    uniforms.uAmp.value = 0.85 + Math.sin(t * 0.8) * 0.15 + (universe.chapter === 5 ? universe.local * 0.25 : 0)
    uniforms.uA.value.copy(livePalette.a).multiplyScalar(2)
    uniforms.uB.value.copy(livePalette.b)
    uniforms.uC.value.copy(livePalette.c)
    if (core.current) core.current.rotation.y += delta * 0.06
    if (light.current) light.current.color.copy(livePalette.c)

    RINGS.forEach((ring, i) => {
      const r = ringRefs.current[i]
      if (r) r.rotation.z += delta * ring.speed
      ringMats.current[i]?.color.copy(livePalette.c).multiplyScalar(1.6)
    })
  })

  return (
    <group ref={group} position={CORE_POSITION} visible={false}>
      <mesh ref={core}>
        <icosahedronGeometry args={[3.4, 40]} />
        <shaderMaterial vertexShader={CORE_VERT} fragmentShader={CORE_FRAG} uniforms={uniforms} />
      </mesh>
      {RINGS.map((ring, i) => (
        <group key={ring.radius} rotation={ring.tilt}>
          <group ref={(el) => void (ringRefs.current[i] = el)}>
            <mesh>
              <torusGeometry args={[ring.radius, ring.tube, 8, 160]} />
              <meshBasicMaterial ref={(el) => void (ringMats.current[i] = el)} toneMapped={false} transparent opacity={0.85} />
            </mesh>
          </group>
        </group>
      ))}
      <pointLight ref={light} intensity={200} distance={90} decay={2} />
      <DustCloud count={dust} fill={fillShell} seed={99} size={1.1} spin={[0.02, 0.07, 0]} />
    </group>
  )
}
