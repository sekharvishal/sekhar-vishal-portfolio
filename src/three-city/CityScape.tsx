import { useEffect, useMemo, useRef } from 'react'
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  SphereGeometry,
} from 'three'
import type { SceneTheme } from '../app/theme'
import type { TierSettings } from '../hooks/useDeviceTier'
import { disposeGeometry, disposeMaterial } from '../three/disposal'
import { buildCityLayout } from './cityLayout'
import { ROAD_LENGTH, ROAD_WIDTH, buildRoadGeometry } from './roadPath'

/** Fixed so the skyline is identical across reloads (and testable via `cityLayout.test.ts`). */
const CITY_SEED = 20261026

function buildWindowTexture(litColor: string): CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#05050a'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = litColor
    const cell = 8
    for (let y = 2; y < size; y += cell) {
      for (let x = 2; x < size; x += cell) {
        if (Math.random() > 0.45) ctx.fillRect(x, y, cell - 4, cell - 4)
      }
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  return texture
}

const _object = new Object3D()
const _color = new Color()

/**
 * The city floor: road ribbon + ground plane, instanced background buildings
 * (window-emissive texture, tinted per instance) and instanced street lamps.
 * All geometries/materials/textures are disposed explicitly on unmount.
 */
export function CityScape({ theme, tier }: { theme: SceneTheme; tier: TierSettings }) {
  const buildingCount = tier.shadows ? 160 : 90

  const layout = useMemo(() => buildCityLayout(CITY_SEED, buildingCount), [buildingCount])

  const roadGeometry = useMemo(() => buildRoadGeometry(ROAD_WIDTH), [])
  const groundGeometry = useMemo(() => new PlaneGeometry(260, ROAD_LENGTH + 60), [])
  const buildingGeometry = useMemo(() => new BoxGeometry(1, 1, 1), [])
  const lampPoleGeometry = useMemo(() => new CylinderGeometry(0.05, 0.07, 3.2, 8), [])
  const lampBulbGeometry = useMemo(() => new SphereGeometry(0.16, 12, 12), [])

  const windowTexture = useMemo(() => buildWindowTexture(theme.keyLight), [theme.keyLight])

  const roadMaterial = useMemo(() => new MeshStandardMaterial({ color: '#15151a', roughness: 0.85, metalness: 0.05 }), [])
  const groundMaterial = useMemo(() => new MeshStandardMaterial({ color: theme.background, roughness: 1 }), [theme.background])
  const buildingMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: theme.statueColor,
        emissiveMap: windowTexture,
        emissive: theme.statueEmissive,
        emissiveIntensity: theme.statueEmissiveIntensity * 0.22,
        roughness: 0.6,
        metalness: 0.2,
      }),
    [windowTexture, theme],
  )
  const lampPoleMaterial = useMemo(() => new MeshStandardMaterial({ color: '#1a1a1f', roughness: 0.5 }), [])
  const lampBulbMaterial = useMemo(
    () => new MeshStandardMaterial({ color: theme.keyLight, emissive: theme.keyLight, emissiveIntensity: 1.1, toneMapped: false }),
    [theme.keyLight],
  )

  const buildingsRef = useRef<InstancedMesh>(null)
  const polesRef = useRef<InstancedMesh>(null)
  const bulbsRef = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = buildingsRef.current
    if (!mesh) return
    layout.buildings.forEach((b, i) => {
      _object.position.set(b.position[0], b.height / 2, b.position[2])
      _object.rotation.set(0, b.rotationY, 0)
      _object.scale.set(b.width, b.height, b.depth)
      _object.updateMatrix()
      mesh.setMatrixAt(i, _object.matrix)
      _color.setHSL(0.09 + b.colorSeed * 0.05, 0.3, 0.45 + b.colorSeed * 0.15)
      mesh.setColorAt(i, _color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [layout])

  useEffect(() => {
    const poles = polesRef.current
    const bulbs = bulbsRef.current
    if (!poles || !bulbs) return
    layout.lamps.forEach((lamp, i) => {
      _object.position.set(lamp.position[0], 1.6, lamp.position[2])
      _object.rotation.set(0, lamp.rotationY, 0)
      _object.scale.set(1, 1, 1)
      _object.updateMatrix()
      poles.setMatrixAt(i, _object.matrix)
      _object.position.y = 3.3
      _object.updateMatrix()
      bulbs.setMatrixAt(i, _object.matrix)
    })
    poles.instanceMatrix.needsUpdate = true
    bulbs.instanceMatrix.needsUpdate = true
  }, [layout])

  useEffect(
    () => () => {
      disposeGeometry([roadGeometry, groundGeometry, buildingGeometry, lampPoleGeometry, lampBulbGeometry])
      disposeMaterial([roadMaterial, groundMaterial, buildingMaterial, lampPoleMaterial, lampBulbMaterial])
      windowTexture.dispose()
    },
    [roadGeometry, groundGeometry, buildingGeometry, lampPoleGeometry, lampBulbGeometry, roadMaterial, groundMaterial, buildingMaterial, lampPoleMaterial, lampBulbMaterial, windowTexture],
  )

  return (
    <group name="CityScape">
      <mesh
        geometry={groundGeometry}
        material={groundMaterial}
        rotation-x={-Math.PI / 2}
        position={[0, -0.02, -ROAD_LENGTH / 2 + 10]}
        receiveShadow
      />
      <mesh geometry={roadGeometry} material={roadMaterial} receiveShadow />
      <instancedMesh ref={buildingsRef} args={[buildingGeometry, buildingMaterial, layout.buildings.length]} castShadow receiveShadow frustumCulled={false} />
      <instancedMesh ref={polesRef} args={[lampPoleGeometry, lampPoleMaterial, layout.lamps.length]} frustumCulled={false} />
      <instancedMesh ref={bulbsRef} args={[lampBulbGeometry, lampBulbMaterial, layout.lamps.length]} frustumCulled={false} />
    </group>
  )
}
