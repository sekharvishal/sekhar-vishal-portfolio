import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Color, MathUtils, Object3D, type Group, type InstancedMesh, type MeshBasicMaterial } from 'three'
import { projects } from '../../data/content'
import type { Project, ProjectStatus } from '../../data/types'
import { usePlace, useProjectHover } from '../hooks'
import { livePalette } from '../palettes'
import { mulberry32 } from '../rng'
import { PORTAL_FRAG, PORTAL_VERT } from '../shaders'
import { setCursorLabel, uiStore, universe } from '../universeStore'
import { projectSlot } from '../worldLayout'

const PROJECT_CHAPTER = 2
const SHARDS = 22

/** Shipped work is stable; work in progress and explorations visibly flicker. */
const UNSTABLE: Record<ProjectStatus, number> = { shipped: 0, 'in-development': 0.5, exploration: 0.9 }
const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: 'Completed',
  'in-development': 'In development',
  exploration: 'Technical exploration',
}

function Portal({ index, project, active, hovered }: { index: number; project: Project; active: boolean; hovered: boolean }) {
  const slot = projectSlot(index)
  const ring = useRef<Group>(null)
  const ring2 = useRef<Group>(null)
  const shards = useRef<Group>(null)
  const shardMesh = useRef<InstancedMesh>(null)
  const ringMat = useRef<MeshBasicMaterial>(null)
  const ringMat2 = useRef<MeshBasicMaterial>(null)
  const shardMat = useRef<MeshBasicMaterial>(null)
  const hover = useRef(0)
  const act = useRef(0)
  const tint = useMemo(() => new Color(), [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uUnstable: { value: UNSTABLE[project.status] },
      uActive: { value: 0 },
      uA: { value: new Color() },
      uB: { value: new Color() },
      uC: { value: new Color() },
    }),
    [project.status],
  )

  useLayoutEffect(() => {
    const mesh = shardMesh.current
    if (!mesh) return
    const rand = mulberry32(300 + index)
    const o = new Object3D()
    for (let i = 0; i < SHARDS; i++) {
      const a = (i / SHARDS) * Math.PI * 2 + rand() * 0.4
      const r = 4.3 + rand() * 1.3
      o.position.set(Math.cos(a) * r, Math.sin(a) * r, (rand() - 0.5) * 1.6)
      o.rotation.set(rand() * 6, rand() * 6, rand() * 6)
      o.scale.setScalar(0.06 + rand() * 0.14)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [index])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const t = state.clock.elapsedTime
    hover.current = MathUtils.damp(hover.current, hovered ? 1 : 0, 6, dt)
    act.current = MathUtils.damp(act.current, active ? 1 : 0, 4, dt)
    const h = hover.current
    const a = act.current

    uniforms.uTime.value = t + index * 3
    uniforms.uHover.value = h
    uniforms.uActive.value = a
    uniforms.uA.value.copy(livePalette.a).offsetHSL(index * 0.05, 0, 0)
    uniforms.uB.value.copy(livePalette.b).offsetHSL(index * 0.05, 0, 0)
    uniforms.uC.value.copy(livePalette.c).offsetHSL(index * 0.05, 0, 0)

    tint.copy(livePalette.c).offsetHSL(index * 0.05, 0, 0)
    ringMat.current?.color.copy(tint).multiplyScalar(1.4 + a * 1.2 + h)
    ringMat2.current?.color.copy(tint).multiplyScalar(1 + a)
    shardMat.current?.color.copy(tint).multiplyScalar(1.6)
    if (ring.current) ring.current.rotation.z = t * 0.25 * (1 + h * 2)
    if (ring2.current) ring2.current.rotation.z = -t * 0.18
    if (shards.current) shards.current.rotation.z = t * (0.12 + h * 0.4)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    if (universe.chapter !== PROJECT_CHAPTER) return
    e.stopPropagation()
    universe.hoverProject = index
    setCursorLabel('Enter')
  }
  const out = () => {
    if (universe.hoverProject === index) {
      universe.hoverProject = -1
      setCursorLabel(null)
    }
  }
  const click = (e: ThreeEvent<MouseEvent>) => {
    if (universe.chapter !== PROJECT_CHAPTER) return
    e.stopPropagation()
    uiStore.set({ project: project.slug })
  }

  return (
    <group position={slot} rotation={[0, slot[0] < 0 ? 0.28 : -0.28, 0]}>
      <mesh onPointerOver={over} onPointerOut={out} onClick={click}>
        <circleGeometry args={[3.1, 96]} />
        <shaderMaterial
          vertexShader={PORTAL_VERT}
          fragmentShader={PORTAL_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={2}
        />
      </mesh>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[3.3, 0.07, 16, 128]} />
          <meshBasicMaterial ref={ringMat} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ring2} rotation={[0.35, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[3.85, 0.018, 8, 128]} />
          <meshBasicMaterial ref={ringMat2} toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>
      <group ref={shards}>
        <instancedMesh ref={shardMesh} args={[undefined, undefined, SHARDS]}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshBasicMaterial ref={shardMat} toneMapped={false} />
        </instancedMesh>
      </group>
      {(active || hovered) && (
        <Html center position={[0, -4.7, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="uni-tag uni-tag-portal">
            <span>{project.title}</span>
            <small>{STATUS_LABEL[project.status]}</small>
          </div>
        </Html>
      )}
    </group>
  )
}

/** One swirling portal per project. Click to open the case-study takeover. */
export function ProjectPortals() {
  const { chapter, item } = usePlace()
  const hover = useProjectHover()
  return (
    <>
      {projects.map((p, i) => (
        <Portal key={p.slug} index={i} project={p} active={chapter === PROJECT_CHAPTER && item === i} hovered={hover === i} />
      ))}
    </>
  )
}
