import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  type Group,
  type LineBasicMaterial,
  type Mesh,
  type MeshStandardMaterial,
  type PointLight,
} from 'three'
import { credentials } from '../../data/content'
import type { CredentialKind } from '../../data/types'
import { useCredentialHover } from '../hooks'
import { livePalette } from '../palettes'
import { setCursorLabel, universe } from '../universeStore'
import { ARCHIVE_CENTER, ARCHIVE_RADIUS } from '../worldLayout'

const ARCHIVE_CHAPTER = 4
const KIND_COLOR: Record<CredentialKind, string> = {
  professional: '#ffd36b',
  course: '#7df9ff',
  simulation: '#ff7ad9',
}

function placeOf(i: number, n: number): [number, number, number] {
  const a = (i / n) * Math.PI * 2
  return [Math.cos(a) * ARCHIVE_RADIUS, Math.sin(i * 1.7) * 1.6, Math.sin(a) * ARCHIVE_RADIUS]
}

function Crystal({ index, hovered }: { index: number; hovered: boolean }) {
  const cred = credentials[index]
  const mesh = useRef<Mesh>(null)
  const mat = useRef<MeshStandardMaterial>(null)
  const h = useRef(0)
  const color = useMemo(() => new Color(KIND_COLOR[cred.kind]), [cred.kind])
  const pos = useMemo(() => placeOf(index, credentials.length), [index])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    h.current = MathUtils.damp(h.current, hovered ? 1 : 0, 7, Math.min(delta, 0.1))
    const m = mesh.current
    if (m) {
      m.rotation.y = t * 0.5 + index
      m.rotation.x = Math.sin(t * 0.4 + index) * 0.25
      m.position.y = pos[1] + Math.sin(t * 0.8 + index * 2) * 0.35
      m.scale.set(0.95, 1.55, 0.95).multiplyScalar(1 + h.current * 0.45)
    }
    if (mat.current) {
      mat.current.emissiveIntensity = 0.7 + h.current * 2.2
      mat.current.emissive.copy(color)
    }
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    if (universe.chapter !== ARCHIVE_CHAPTER) return
    e.stopPropagation()
    universe.hoverCredential = index
    setCursorLabel('Inspect')
  }
  const out = () => {
    if (universe.hoverCredential === index) {
      universe.hoverCredential = -1
      setCursorLabel(null)
    }
  }

  return (
    <mesh ref={mesh} position={pos} onPointerOver={over} onPointerOut={out}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial ref={mat} color="#0b0d14" flatShading metalness={0.7} roughness={0.25} />
      {hovered && (
        <Html center position={[0, 1.9, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="uni-tag uni-tag-portal">
            <span>{cred.title}</span>
            <small>{cred.issuer}</small>
          </div>
        </Html>
      )}
    </mesh>
  )
}

/** Nine crystals orbiting a halo: one per credential, colour-coded by kind. */
export function ArchiveRing() {
  const root = useRef<Group>(null)
  const spinner = useRef<Group>(null)
  const light = useRef<PointLight>(null)
  const lineMat = useRef<LineBasicMaterial>(null)
  const hover = useCredentialHover()

  const outline = useMemo(() => {
    const pts: number[] = []
    credentials.forEach((_, i) => pts.push(...placeOf(i, credentials.length)))
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3))
    return g
  }, [])
  useEffect(() => () => outline.dispose(), [outline])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const near = universe.chapter >= 3 && universe.chapter <= 5
    g.visible = near
    if (!near) return
    if (spinner.current) spinner.current.rotation.y = state.clock.elapsedTime * 0.12
    if (light.current) light.current.color.copy(livePalette.c)
    lineMat.current?.color.copy(livePalette.c).multiplyScalar(0.8)
  })

  return (
    <group ref={root} position={ARCHIVE_CENTER} visible={false}>
      <ambientLight intensity={0.35} />
      <pointLight ref={light} intensity={260} distance={70} decay={2} />
      <group ref={spinner}>
        <lineLoop geometry={outline}>
          <lineBasicMaterial ref={lineMat} transparent opacity={0.35} toneMapped={false} />
        </lineLoop>
        {credentials.map((c, i) => (
          <Crystal key={c.title} index={i} hovered={hover === i} />
        ))}
      </group>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[ARCHIVE_RADIUS + 1.4, 0.03, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </group>
  )
}
