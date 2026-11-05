import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group, MathUtils, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three'
import type { SceneTheme } from '../app/theme'
import { disposeMaterial } from '../three/disposal'
import { remap } from '../state/scrollMapCity'
import { carPose, scrollStoreCity } from '../state/scrollStoreCity'
import { createRoadFrame, frameAt } from './roadPath'
import { VEHICLE_GLB_URL } from './vehicleConfig'

const _frame = createRoadFrame()
const _targetQuat = new Quaternion()
const _prevPosition = new Vector3()

function useDrivePhysics(group: RefObject<Group>, wheels: MutableRefObject<(Mesh | null)[]>) {
  const initialised = useRef(false)
  const prevHeading = useRef(0)

  useEffect(() => {
    initialised.current = false
    carPose.speed = 0
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)

    const target = scrollStoreCity.parked ? 1 : scrollStoreCity.progress
    scrollStoreCity.smooth = MathUtils.damp(scrollStoreCity.smooth, target, 5, dt)
    const u = remap(scrollStoreCity.smooth)
    frameAt(u, _frame)

    const movedThisFrame = initialised.current ? _frame.position.distanceTo(_prevPosition) : 0
    const instantSpeed = dt > 0 ? MathUtils.clamp(movedThisFrame / dt / 12, 0, 1) : 0
    carPose.speed = MathUtils.damp(carPose.speed, instantSpeed, 6, dt)
    _prevPosition.copy(_frame.position)

    carPose.position.copy(_frame.position)
    _targetQuat.copy(_frame.quaternion)
    carPose.quaternion.slerp(_targetQuat, initialised.current ? 1 - Math.exp(-10 * dt) : 1)

    // Arcade-style body roll: bank opposite the turn, proportional to how fast heading changes.
    const heading = Math.atan2(_frame.tangent.x, _frame.tangent.z)
    const turnDelta = initialised.current ? MathUtils.euclideanModulo(heading - prevHeading.current + Math.PI, Math.PI * 2) - Math.PI : 0
    prevHeading.current = heading
    const roll = MathUtils.clamp(-turnDelta * 6, -0.3, 0.3)

    if (group.current) {
      group.current.position.copy(carPose.position)
      group.current.quaternion.copy(carPose.quaternion)
      group.current.rotateZ(roll)
    }

    const spin = carPose.speed * dt * 18
    for (const wheel of wheels.current) if (wheel) wheel.rotation.x += spin

    initialised.current = true
  })
}

function buildCarMaterials(theme: SceneTheme) {
  return {
    chassis: new MeshStandardMaterial({ color: '#141620', metalness: 0.75, roughness: 0.25 }),
    cabin: new MeshStandardMaterial({ color: '#0a0b10', metalness: 0.4, roughness: 0.15, transparent: true, opacity: 0.85 }),
    neon: new MeshStandardMaterial({ color: theme.statueEmissive, emissive: theme.statueEmissive, emissiveIntensity: theme.statueEmissiveIntensity * 0.45, toneMapped: false }),
    headlight: new MeshStandardMaterial({ color: '#eaf6ff', emissive: '#eaf6ff', emissiveIntensity: 1.8, toneMapped: false }),
    taillight: new MeshStandardMaterial({ color: '#ff3b4e', emissive: '#ff3b4e', emissiveIntensity: 1.4, toneMapped: false }),
  }
}

const WHEEL_OFFSETS: [number, number, number][] = [
  [-0.85, 0.42, -1.1],
  [0.85, 0.42, -1.1],
  [-0.85, 0.42, 1.1],
  [0.85, 0.42, 1.1],
]

function ProceduralCar({ theme }: { theme: SceneTheme }) {
  const mat = useMemo(() => buildCarMaterials(theme), [theme])

  useEffect(
    () => () => {
      disposeMaterial(Object.values(mat))
    },
    [mat],
  )

  return (
    <>
      <mesh material={mat.chassis} position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.55, 3.6]} />
      </mesh>
      <mesh material={mat.cabin} position={[0, 0.92, 0.25]} castShadow>
        <boxGeometry args={[1.4, 0.5, 1.7]} />
      </mesh>
      <mesh material={mat.neon} position={[0, 0.22, 0]}>
        <boxGeometry args={[1.9, 0.08, 3.7]} />
      </mesh>
      <mesh material={mat.headlight} position={[-0.6, 0.55, -1.82]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
      </mesh>
      <mesh material={mat.headlight} position={[0.6, 0.55, -1.82]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
      </mesh>
      <mesh material={mat.taillight} position={[-0.6, 0.55, 1.82]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
      </mesh>
      <mesh material={mat.taillight} position={[0.6, 0.55, 1.82]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
      </mesh>
    </>
  )
}

function WheelSet({ wheelsRef, material }: { wheelsRef: MutableRefObject<(Mesh | null)[]>; material: MeshStandardMaterial }) {
  return (
    <>
      {WHEEL_OFFSETS.map((pos, i) => (
        <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh
            material={material}
            ref={(el) => {
              wheelsRef.current[i] = el
            }}
            castShadow
          >
            <cylinderGeometry args={[0.38, 0.38, 0.26, 16]} />
          </mesh>
        </group>
      ))}
    </>
  )
}

class VehicleBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[VehicleRig] failed to load the .glb, using the procedural car.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function GlbVehicle({ url }: { url: string }) {
  // Draco is off (it would fetch a decoder from a CDN); Meshopt is on.
  const { scene } = useGLTF(url, false, true)
  // Cloned (not disposed on unmount): geometries/materials are owned by drei's gltf cache, shared across mounts.
  const root = useMemo(() => scene.clone(true), [scene])
  return <primitive object={root} />
}

export function VehicleRig({ theme }: { theme: SceneTheme }) {
  const group = useRef<Group>(null)
  const wheels = useRef<(Mesh | null)[]>([null, null, null, null])
  const wheelMaterial = useMemo(() => new MeshStandardMaterial({ color: '#060608', roughness: 0.8 }), [])

  useEffect(
    () => () => {
      disposeMaterial(wheelMaterial)
    },
    [wheelMaterial],
  )

  useDrivePhysics(group, wheels)

  const procedural = (
    <>
      <ProceduralCar theme={theme} />
      <WheelSet wheelsRef={wheels} material={wheelMaterial} />
    </>
  )

  return (
    <group ref={group} name="VehicleRig">
      {VEHICLE_GLB_URL ? (
        <VehicleBoundary fallback={procedural}>
          <Suspense fallback={null}>
            <GlbVehicle url={VEHICLE_GLB_URL} />
          </Suspense>
        </VehicleBoundary>
      ) : (
        procedural
      )}
    </group>
  )
}
