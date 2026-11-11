import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import {
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  Object3D,
  Vector3,
  type Group,
  type InstancedMesh,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
} from 'three'
import { skillGroups } from '../../data/content'
import { usePlace } from '../hooks'
import { livePalette } from '../palettes'
import { fibonacciSphere, mulberry32 } from '../rng'
import { setCursorLabel, universe } from '../universeStore'
import { SKILL_CENTERS, SKILL_RADIUS } from '../worldLayout'

const SKILL_CHAPTER = 1

function SkillCluster({ g, active }: { g: number; active: boolean }) {
  const group = useRef<Group>(null)
  const nodesRef = useRef<InstancedMesh>(null)
  const hub = useRef<Mesh>(null)
  const nodeMat = useRef<MeshBasicMaterial>(null)
  const hubMat = useRef<MeshBasicMaterial>(null)
  const lineMat = useRef<LineBasicMaterial>(null)
  const act = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])

  const skills = skillGroups[g].skills
  const nodes = useMemo(() => {
    const rand = mulberry32(100 + g)
    return fibonacciSphere(skills.length).map(([x, y, z]) => {
      const r = SKILL_RADIUS * (0.72 + rand() * 0.28)
      return new Vector3(x * r, y * r, z * r)
    })
  }, [g, skills.length])

  const edges = useMemo(() => {
    const seen = new Set<string>()
    const pts: number[] = []
    const link = (a: Vector3, b: Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z)
    nodes.forEach((n, i) => {
      link(new Vector3(), n)
      nodes
        .map((m, j) => ({ j, d: n.distanceToSquared(m) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(key)) {
            seen.add(key)
            link(n, nodes[j])
          }
        })
    })
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3))
    return geo
  }, [nodes])

  useEffect(() => () => edges.dispose(), [edges])

  useLayoutEffect(() => {
    const mesh = nodesRef.current
    if (!mesh) return
    nodes.forEach((n, i) => {
      dummy.position.copy(n)
      dummy.scale.setScalar(0.26)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [nodes, dummy])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.1)
    if (group.current) group.current.rotation.y = t * 0.06 + g * 1.3
    act.current = MathUtils.damp(act.current, active ? 1 : 0, 4, dt)
    const a = act.current

    const mesh = nodesRef.current
    if (mesh) {
      for (let i = 0; i < nodes.length; i++) {
        const hovered = universe.hoverSkillGroup === g && universe.hoverSkillIndex === i
        const s = (0.24 + Math.sin(t * 1.6 + i * 1.7) * 0.03) * (1 + a * 0.55) * (hovered ? 2 : 1)
        dummy.position.copy(nodes[i])
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
    nodeMat.current?.color.copy(livePalette.c).multiplyScalar(1.1 + a * 1.4)
    hubMat.current?.color.copy(livePalette.b).multiplyScalar(1.5 + a)
    if (lineMat.current) {
      lineMat.current.color.copy(livePalette.c).multiplyScalar(0.9)
      lineMat.current.opacity = 0.1 + a * 0.45
    }
    if (hub.current) {
      hub.current.rotation.x = t * 0.4
      hub.current.rotation.y = t * 0.3
      hub.current.scale.setScalar(1 + a * 0.5 + Math.sin(t * 2) * 0.05)
    }
  })

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (universe.chapter !== SKILL_CHAPTER || e.instanceId === undefined) return
    e.stopPropagation()
    universe.hoverSkillGroup = g
    universe.hoverSkillIndex = e.instanceId
    setCursorLabel(skills[e.instanceId])
  }
  const onOut = () => {
    if (universe.hoverSkillGroup === g) {
      universe.hoverSkillGroup = -1
      universe.hoverSkillIndex = -1
      setCursorLabel(null)
    }
  }

  return (
    <group position={SKILL_CENTERS[g]}>
      <group ref={group}>
        <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]} onPointerMove={onMove} onPointerOut={onOut}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial ref={nodeMat} toneMapped={false} />
        </instancedMesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial ref={lineMat} transparent depthWrite={false} toneMapped={false} />
        </lineSegments>
        <mesh ref={hub}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial ref={hubMat} wireframe toneMapped={false} />
        </mesh>
        {active && (
          <>
            <Html center position={[0, -0.95, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
              <div className="uni-tag uni-tag-hub">{skillGroups[g].name}</div>
            </Html>
            {nodes.map((n, i) => (
              <Html key={skills[i]} center position={[n.x, n.y - 0.5, n.z]} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
                <div className="uni-tag">{skills[i]}</div>
              </Html>
            ))}
          </>
        )}
      </group>
    </group>
  )
}

/** One glowing constellation per skill group; the camera visits each in turn. */
export function SkillConstellation() {
  const { chapter, item } = usePlace()
  return (
    <>
      {skillGroups.map((_, g) => (
        <SkillCluster key={skillGroups[g].name} g={g} active={chapter === SKILL_CHAPTER && item === g} />
      ))}
    </>
  )
}
