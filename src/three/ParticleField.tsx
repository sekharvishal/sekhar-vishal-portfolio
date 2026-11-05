import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, InstancedMesh, MeshBasicMaterial, Object3D, OctahedronGeometry } from 'three'
import { STATUE_HEIGHT } from './cameraPath'

/** Small deterministic PRNG so the dust layout is stable between renders. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Floating dust: one InstancedMesh = one draw call for any particle count.
 * Matrices are written once; motion is a cheap rotation of the parent group, so
 * there is no per-instance CPU work per frame.
 */
export function ParticleField({ count, color }: { count: number; color: string }) {
  const group = useRef<Group>(null)
  const mesh = useRef<InstancedMesh>(null)

  const { geometry, material } = useMemo(
    () => ({
      geometry: new OctahedronGeometry(0.035, 0),
      material: new MeshBasicMaterial({ transparent: true, opacity: 0.7, toneMapped: false }),
    }),
    [],
  )

  useLayoutEffect(() => {
    const instanced = mesh.current
    if (!instanced) return
    const rand = mulberry32(1337)
    const dummy = new Object3D()
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2
      const radius = 1.8 + Math.pow(rand(), 0.7) * 13
      dummy.position.set(Math.cos(angle) * radius, -1 + rand() * (STATUE_HEIGHT + 6), Math.sin(angle) * radius)
      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, 0)
      dummy.scale.setScalar(0.5 + rand() * 1.8)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    }
    instanced.instanceMatrix.needsUpdate = true
  }, [count])

  useLayoutEffect(() => {
    material.color.set(color)
  }, [material, color])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += Math.min(delta, 0.1) * 0.02
    g.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
  })

  return (
    <group ref={group}>
      {/* key forces a fresh InstancedMesh when the count (device tier) changes */}
      <instancedMesh key={count} ref={mesh} args={[geometry, material, count]} frustumCulled={false} />
    </group>
  )
}
