import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CapsuleGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  type Material,
  type Object3D,
} from 'three'
import type { SceneTheme } from '../app/theme'
import { STATUE_PARTS, STATUE_RANGES, mapRange, type StatuePart } from '../state/scrollMap'
import { scrollStore } from '../state/scrollStore'
import { STATUE_HEIGHT } from './cameraPath'
import { applyClipShader, type ClipUniform } from './clipShader'
import { disposeGeometry, disposeMaterial } from './disposal'
import { STATUE_GLB_URL, USE_CLIP_PLANE } from './statueConfig'

gsap.registerPlugin(ScrollTrigger)

/** The procedural statue is authored ~7 units tall; scale it to frame the camera path. */
const ROOT_SCALE = 1.25

interface PartHandle {
  object: Object3D
  materials: Material[]
  baseScaleY: number
}
type PartMap = Partial<Record<StatuePart, PartHandle>>
type PartRef = MutableRefObject<PartMap>

/* ------------------------------------------------------------------ */
/* Scroll-driven assembly (shared by procedural and .glb statues)      */
/* ------------------------------------------------------------------ */

function useAssembly(partsRef: PartRef, clip: ClipUniform | null) {
  const states = useMemo(
    () =>
      Object.fromEntries(STATUE_PARTS.map((part) => [part, { p: 0 }])) as Record<StatuePart, { p: number }>,
    [],
  )

  // GSAP timeline scrubbed by page scroll: each part gets its own [start, end] slice.
  useEffect(() => {
    if (clip) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })
      for (const part of STATUE_PARTS) {
        const [start, end] = STATUE_RANGES[part]
        tl.to(states[part], { p: 1, duration: end - start }, start)
      }
      tl.to({}, { duration: 0 }, 1) // pad so the timeline spans exactly progress 0..1
    })
    return () => ctx.revert()
  }, [states, clip])

  useFrame(() => {
    const parked = scrollStore.parked
    if (clip) clip.value = parked ? STATUE_HEIGHT * 2 : mapRange(scrollStore.smooth, 0, 0.9) * (STATUE_HEIGHT + 0.5)

    for (const part of STATUE_PARTS) {
      const handle = partsRef.current[part]
      if (!handle) continue
      const p = clip || parked ? 1 : states[part].p
      handle.object.visible = p > 0.001
      if (!clip) handle.object.scale.y = handle.baseScaleY * Math.max(p, 0.001)
      const opaque = p >= 0.999
      for (const material of handle.materials) {
        material.opacity = opaque ? 1 : p
        material.transparent = !opaque
        material.depthWrite = opaque
      }
    }
  })
}

/* ------------------------------------------------------------------ */
/* Procedural statue                                                   */
/* ------------------------------------------------------------------ */

function buildGeometries() {
  const flatRing = (radius: number, tube: number) => {
    const g = new TorusGeometry(radius, tube, 12, 128)
    g.rotateX(Math.PI / 2)
    return g
  }
  const shoulders = new CapsuleGeometry(0.42, 2.0, 8, 16)
  shoulders.rotateZ(Math.PI / 2)
  return {
    step1: new CylinderGeometry(2.6, 2.8, 0.4, 64),
    step2: new CylinderGeometry(2.0, 2.2, 0.4, 64),
    step3: new CylinderGeometry(1.5, 1.7, 0.4, 64),
    baseRing: flatRing(2.35, 0.035),
    body: new CylinderGeometry(0.85, 1.15, 3.2, 48),
    shoulders,
    core: new IcosahedronGeometry(0.16, 1),
    arm: new CapsuleGeometry(0.26, 1.8, 8, 16),
    neck: new CylinderGeometry(0.3, 0.4, 0.5, 24),
    head: new SphereGeometry(0.7, 48, 32),
    halo: flatRing(0.95, 0.025),
  }
}

function buildMaterials(clip: ClipUniform | null) {
  const body = () => new MeshPhysicalMaterial({ clearcoat: 0.3, clearcoatRoughness: 0.4 })
  const accent = () => new MeshStandardMaterial({ toneMapped: false })
  const materials = {
    body: { Base: body(), Torso: body(), LeftArm: body(), RightArm: body(), Head: body() },
    accent: { Base: accent(), Torso: accent(), Head: accent() },
  }
  if (clip) {
    for (const m of [...Object.values(materials.body), ...Object.values(materials.accent)]) applyClipShader(m, clip)
  }
  return materials
}

function ProceduralStatue({ partsRef, clip, theme }: { partsRef: PartRef; clip: ClipUniform | null; theme: SceneTheme }) {
  const geo = useMemo(buildGeometries, [])
  const mat = useMemo(() => buildMaterials(clip), [clip])

  const base = useRef<Group>(null)
  const torso = useRef<Group>(null)
  const leftArm = useRef<Group>(null)
  const rightArm = useRef<Group>(null)
  const head = useRef<Group>(null)
  const halo = useRef<Mesh>(null)

  useLayoutEffect(() => {
    const register = (part: StatuePart, ref: MutableRefObject<Group | null>, materials: Material[]) => {
      if (ref.current) partsRef.current[part] = { object: ref.current, materials, baseScaleY: 1 }
    }
    register('Base', base, [mat.body.Base, mat.accent.Base])
    register('Torso', torso, [mat.body.Torso, mat.accent.Torso])
    register('LeftArm', leftArm, [mat.body.LeftArm])
    register('RightArm', rightArm, [mat.body.RightArm])
    register('Head', head, [mat.body.Head, mat.accent.Head])
    const parts = partsRef.current
    return () => {
      for (const part of STATUE_PARTS) delete parts[part]
    }
  }, [mat, partsRef])

  // Follow the UI theme: gold metal (dark) or ivory stone (light).
  useLayoutEffect(() => {
    for (const m of Object.values(mat.body)) {
      m.color.set(theme.statueColor)
      m.metalness = theme.statueMetalness
      m.roughness = theme.statueRoughness
    }
    for (const m of Object.values(mat.accent)) {
      m.color.set(theme.statueColor)
      m.emissive.set(theme.statueEmissive)
      m.emissiveIntensity = theme.statueEmissiveIntensity
    }
  }, [mat, theme])

  // Explicit GPU cleanup: geometries and materials are not garbage collected.
  useEffect(
    () => () => {
      disposeGeometry(Object.values(geo))
    },
    [geo],
  )
  useEffect(
    () => () => {
      disposeMaterial([...Object.values(mat.body), ...Object.values(mat.accent)])
    },
    [mat],
  )

  useFrame((_, delta) => {
    if (halo.current) halo.current.rotation.y += Math.min(delta, 0.1) * 0.5
  })

  const m = mat.body
  return (
    <>
      <group ref={base} name="Base">
        <mesh geometry={geo.step1} material={m.Base} position={[0, 0.2, 0]} castShadow receiveShadow />
        <mesh geometry={geo.step2} material={m.Base} position={[0, 0.6, 0]} castShadow receiveShadow />
        <mesh geometry={geo.step3} material={m.Base} position={[0, 1.0, 0]} castShadow receiveShadow />
        <mesh geometry={geo.baseRing} material={mat.accent.Base} position={[0, 0.41, 0]} />
      </group>

      <group ref={torso} name="Torso" position={[0, 1.2, 0]}>
        <mesh geometry={geo.body} material={m.Torso} position={[0, 1.6, 0]} castShadow receiveShadow />
        <mesh geometry={geo.shoulders} material={m.Torso} position={[0, 3.0, 0]} castShadow receiveShadow />
        <mesh geometry={geo.core} material={mat.accent.Torso} position={[0, 2.0, 1.0]} />
      </group>

      <group ref={leftArm} name="LeftArm" position={[-1.45, 2.2, 0]}>
        <mesh geometry={geo.arm} material={m.LeftArm} position={[0, 1.16, 0]} rotation={[0, 0, 0.06]} castShadow receiveShadow />
      </group>
      <group ref={rightArm} name="RightArm" position={[1.45, 2.2, 0]}>
        <mesh geometry={geo.arm} material={m.RightArm} position={[0, 1.16, 0]} rotation={[0, 0, -0.06]} castShadow receiveShadow />
      </group>

      <group ref={head} name="Head" position={[0, 4.6, 0]}>
        <mesh geometry={geo.neck} material={m.Head} position={[0, 0.25, 0]} castShadow receiveShadow />
        <mesh geometry={geo.head} material={m.Head} position={[0, 1.15, 0]} castShadow receiveShadow />
        <mesh ref={halo} geometry={geo.halo} material={mat.accent.Head} position={[0, 2.35, 0]} />
      </group>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Optional .glb slot: same node names, same assembly behaviour        */
/* ------------------------------------------------------------------ */

function GlbStatue({ url, partsRef }: { url: string; partsRef: PartRef }) {
  // Draco is off (it would fetch a decoder from a CDN); Meshopt is on.
  const { scene } = useGLTF(url, false, true)
  const root = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    const owned: Material[] = []
    for (const part of STATUE_PARTS) {
      const node = root.getObjectByName(part)
      if (!node) {
        console.warn(`[AvatarStatue] glb is missing a node named "${part}"`)
        continue
      }
      const materials: Material[] = []
      node.traverse((child) => {
        const mesh = child as Mesh
        if (!mesh.isMesh) return
        mesh.castShadow = true
        mesh.receiveShadow = true
        const cloned = Array.isArray(mesh.material) ? mesh.material.map((x) => x.clone()) : mesh.material.clone()
        mesh.material = cloned
        materials.push(...(Array.isArray(cloned) ? cloned : [cloned]))
      })
      owned.push(...materials)
      partsRef.current[part] = { object: node, materials, baseScaleY: node.scale.y }
    }
    const parts = partsRef.current
    return () => {
      for (const part of STATUE_PARTS) delete parts[part]
      disposeMaterial(owned)
    }
  }, [root, partsRef])

  return <primitive object={root} />
}

class StatueBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[AvatarStatue] failed to load the .glb, using the procedural statue.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/* ------------------------------------------------------------------ */

export interface AvatarStatueProps {
  theme: SceneTheme
  glbUrl?: string
  clipMode?: boolean
}

export function AvatarStatue({ theme, glbUrl = STATUE_GLB_URL, clipMode = USE_CLIP_PLANE }: AvatarStatueProps) {
  const partsRef = useRef<PartMap>({})
  const clip = useMemo<ClipUniform | null>(() => (clipMode ? { value: 0 } : null), [clipMode])
  useAssembly(partsRef, clip)

  const procedural = <ProceduralStatue partsRef={partsRef} clip={clip} theme={theme} />

  return (
    <group name="AvatarStatue" scale={ROOT_SCALE}>
      {glbUrl ? (
        <StatueBoundary fallback={procedural}>
          <Suspense fallback={null}>
            <GlbStatue url={glbUrl} partsRef={partsRef} />
          </Suspense>
        </StatueBoundary>
      ) : (
        procedural
      )}
    </group>
  )
}
