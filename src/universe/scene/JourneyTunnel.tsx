import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  Object3D,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
} from 'three'
import { experience } from '../../data/content'
import type { ExperienceItem } from '../../data/types'
import { usePlace } from '../hooks'
import { livePalette } from '../palettes'
import { mulberry32 } from '../rng'
import { STREAK_FRAG, STREAK_VERT } from '../shaders'
import { universe } from '../universeStore'
import { TUNNEL_LENGTH, TUNNEL_START_Z, stationZ } from '../worldLayout'

const JOURNEY_CHAPTER = 3
const RING_COUNT = 52
const RING_SPACING = 1.6
const STREAKS = 600
const TYPE_COLOR: Record<ExperienceItem['type'], string> = {
  employment: '#ffd36b',
  internship: '#6be8ff',
  virtual: '#b48bff',
}

function Gate({ index, type, active }: { index: number; type: ExperienceItem['type']; active: boolean }) {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  const outerMat = useRef<MeshBasicMaterial>(null)
  const innerMat = useRef<MeshBasicMaterial>(null)
  const act = useRef(0)
  const color = useMemo(() => new Color(TYPE_COLOR[type]), [type])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    act.current = MathUtils.damp(act.current, active ? 1 : 0, 4, Math.min(delta, 0.1))
    const a = act.current
    if (outer.current) outer.current.rotation.z = t * 0.12 + index
    if (inner.current) inner.current.rotation.z = -t * 0.2
    outerMat.current?.color.copy(color).multiplyScalar(0.9 + a * 2.2 + Math.sin(t * 3 + index) * 0.12 * a)
    innerMat.current?.color.copy(color).multiplyScalar(0.5 + a * 1.2)
  })

  return (
    <group position={[0, 0, stationZ(index)]}>
      <group ref={outer}>
        <mesh>
          <torusGeometry args={[7.2, 0.14, 10, 6]} />
          <meshBasicMaterial ref={outerMat} toneMapped={false} />
        </mesh>
      </group>
      <group ref={inner}>
        <mesh>
          <torusGeometry args={[5.4, 0.05, 8, 6]} />
          <meshBasicMaterial ref={innerMat} toneMapped={false} transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

/** A hex-ringed corridor with a glowing gate for every role; rings light up as the camera passes. */
export function JourneyTunnel() {
  const root = useRef<Group>(null)
  const rings = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const tmp = useMemo(() => new Color(), [])
  const { chapter, item } = usePlace()

  const streakGeo = useMemo(() => {
    const rand = mulberry32(555)
    const pos = new Float32Array(STREAKS * 3)
    const seed = new Float32Array(STREAKS)
    for (let i = 0; i < STREAKS; i++) {
      const a = rand() * Math.PI * 2
      const r = 1.5 + rand() * 7
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r
      pos[i * 3 + 2] = TUNNEL_START_Z - TUNNEL_LENGTH - 6 + rand() * (TUNNEL_LENGTH + 12)
      seed[i] = rand()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    return g
  }, [])
  useEffect(() => () => streakGeo.dispose(), [streakGeo])

  const streakUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 6 },
      uZMin: { value: TUNNEL_START_Z - TUNNEL_LENGTH - 6 },
      uLen: { value: TUNNEL_LENGTH + 12 },
      uColor: { value: new Color() },
    }),
    [],
  )

  useLayoutEffect(() => {
    const mesh = rings.current
    if (!mesh) return
    for (let k = 0; k < RING_COUNT; k++) {
      dummy.position.set(0, 0, TUNNEL_START_Z - k * RING_SPACING)
      dummy.rotation.set(0, 0, k * 0.11)
      dummy.updateMatrix()
      mesh.setMatrixAt(k, dummy.matrix)
      mesh.setColorAt(k, tmp.setRGB(0.2, 0.2, 0.2))
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [dummy, tmp])

  const setStreakTime = useCallback(
    (t: number) => {
      streakUniforms.uTime.value = t
      streakUniforms.uSpeed.value = 6 + Math.min(Math.abs(universe.velocity), 90) * 0.35
      streakUniforms.uColor.value.copy(livePalette.c)
    },
    [streakUniforms],
  )

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const near = universe.chapter >= 2 && universe.chapter <= 4
    g.visible = near
    if (!near) return

    const camZ = universe.camZ
    const mesh = rings.current
    if (mesh?.instanceColor) {
      for (let k = 0; k < RING_COUNT; k++) {
        const z = TUNNEL_START_Z - k * RING_SPACING
        const b = Math.exp(-Math.abs(z - camZ + 4) / 13)
        tmp.copy(livePalette.c).multiplyScalar(0.12 + b * 2.4)
        mesh.setColorAt(k, tmp)
      }
      mesh.instanceColor.needsUpdate = true
    }
    setStreakTime(state.clock.elapsedTime)
  })

  return (
    <group ref={root} visible={false}>
      <instancedMesh ref={rings} args={[undefined, undefined, RING_COUNT]} frustumCulled={false}>
        <torusGeometry args={[5.6, 0.03, 6, 6]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {experience.map((e, i) => (
        <Gate key={`${e.org}-${e.role}`} index={i} type={e.type} active={chapter === JOURNEY_CHAPTER && item === i} />
      ))}
      <points geometry={streakGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={STREAK_VERT}
          fragmentShader={STREAK_FRAG}
          uniforms={streakUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  )
}
