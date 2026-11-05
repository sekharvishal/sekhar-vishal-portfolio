import { useEffect, useMemo } from 'react'
import { BoxGeometry, ConeGeometry, MeshStandardMaterial, Vector3, type BufferGeometry, type Material } from 'three'
import type { SceneTheme } from '../app/theme'
import { STOPS } from '../state/scrollMapCity'
import { disposeGeometry, disposeMaterial } from '../three/disposal'
import { ROAD_WIDTH, frameAtAlloc } from './roadPath'

const SIDE_OFFSET = ROAD_WIDTH / 2 + 10

export interface HeroPlacement {
  position: [number, number, number]
  rotationY: number
}

/** Places a hero building `SIDE_OFFSET` units to one side of the road at stop `t`, facing back toward the road. */
function placementAt(t: number, side: 1 | -1): HeroPlacement {
  const frame = frameAtAlloc(t)
  const pos = new Vector3().copy(frame.position).addScaledVector(frame.normal, side * SIDE_OFFSET)
  const towardRoadX = -frame.normal.x * side
  const towardRoadZ = -frame.normal.z * side
  return { position: [pos.x, 0, pos.z], rotationY: Math.atan2(towardRoadX, towardRoadZ) }
}

function useDisposableBuilding(geo: Record<string, BufferGeometry>, mat: Record<string, Material>) {
  useEffect(
    () => () => {
      disposeGeometry(Object.values(geo))
      disposeMaterial(Object.values(mat))
    },
    [geo, mat],
  )
}

/** Building 1: SecureW2 Experience -- a sleek glass-and-steel tower with glowing horizontal bands. */
function SecureW2Tower({ theme, at }: { theme: SceneTheme; at: HeroPlacement }) {
  const geo = useMemo(
    () => ({
      shaft: new BoxGeometry(6, 26, 6),
      band: new BoxGeometry(6.4, 0.6, 6.4),
      spire: new ConeGeometry(2, 4, 4),
    }),
    [],
  )
  const mat = useMemo(
    () => ({
      shaft: new MeshStandardMaterial({ color: '#141821', metalness: 0.6, roughness: 0.3 }),
      band: new MeshStandardMaterial({ color: theme.keyLight, emissive: theme.keyLight, emissiveIntensity: 1.3, toneMapped: false }),
    }),
    [theme.keyLight],
  )
  useDisposableBuilding(geo, mat)

  return (
    <group position={at.position} rotation-y={at.rotationY} name="SecureW2Tower">
      <mesh geometry={geo.shaft} material={mat.shaft} position={[0, 13, 0]} castShadow receiveShadow />
      {[6, 12, 18, 24].map((y) => (
        <mesh key={y} geometry={geo.band} material={mat.band} position={[0, y, 0]} />
      ))}
      <mesh geometry={geo.spire} material={mat.band} position={[0, 28, 0]} />
    </group>
  )
}

/** Building 2: Skills Matrix -- a grid-frame with lit cubes picked out in a sparse, matrix-like pattern. */
function SkillsMatrix({ theme, at }: { theme: SceneTheme; at: HeroPlacement }) {
  const GRID = 5
  const CELL = 1.6
  const GAP = 0.5
  const geo = useMemo(
    () => ({
      frame: new BoxGeometry(GRID * (CELL + GAP), GRID * (CELL + GAP), 1.2),
      cube: new BoxGeometry(CELL, CELL, CELL),
    }),
    [],
  )
  const mat = useMemo(
    () => ({
      frame: new MeshStandardMaterial({ color: '#10141c', metalness: 0.4, roughness: 0.5 }),
      cube: new MeshStandardMaterial({ color: theme.dust, emissive: theme.dust, emissiveIntensity: 1, toneMapped: false }),
    }),
    [theme.dust],
  )
  useDisposableBuilding(geo, mat)

  const frameHeight = GRID * (CELL + GAP)
  const cells = useMemo(() => {
    const items: { x: number; y: number }[] = []
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        if ((row + col) % 3 === 0) continue // skip cells so it reads as a sparse matrix, not a solid wall
        items.push({ x: (col - (GRID - 1) / 2) * (CELL + GAP), y: 3 + row * (CELL + GAP) })
      }
    }
    return items
  }, [])

  return (
    <group position={at.position} rotation-y={at.rotationY} name="SkillsMatrix">
      <mesh geometry={geo.frame} material={mat.frame} position={[0, 3 + frameHeight / 2 - (CELL + GAP) / 2, 0]} castShadow receiveShadow />
      {cells.map((c, i) => (
        <mesh key={i} geometry={geo.cube} material={mat.cube} position={[c.x, c.y, 0.9]} />
      ))}
    </group>
  )
}

/** Building 3: Edu Eats & Projects -- a low, friendly campus cluster (hall + two wings + a pitched roof). */
function EduEatsCampus({ theme, at }: { theme: SceneTheme; at: HeroPlacement }) {
  const geo = useMemo(
    () => ({
      hall: new BoxGeometry(10, 6, 7),
      wing: new BoxGeometry(5, 4, 5),
      roof: new ConeGeometry(7.2, 2.6, 4),
    }),
    [],
  )
  const mat = useMemo(
    () => ({
      wall: new MeshStandardMaterial({ color: theme.statueColor, roughness: 0.7, metalness: 0.1 }),
      roof: new MeshStandardMaterial({ color: theme.keyLight, emissive: theme.keyLight, emissiveIntensity: 0.5, toneMapped: false }),
    }),
    [theme],
  )
  useDisposableBuilding(geo, mat)

  return (
    <group position={at.position} rotation-y={at.rotationY} name="EduEatsCampus">
      <mesh geometry={geo.hall} material={mat.wall} position={[0, 3, 0]} castShadow receiveShadow />
      <mesh geometry={geo.wing} material={mat.wall} position={[-6, 2, 1]} castShadow receiveShadow />
      <mesh geometry={geo.wing} material={mat.wall} position={[6, 2, -1]} castShadow receiveShadow />
      <mesh geometry={geo.roof} material={mat.roof} position={[0, 7.3, 0]} rotation-y={Math.PI / 4} />
    </group>
  )
}

/** Building 4: Grand Finale -- a tall, tapering palace-tower, the tallest and most ornate in the city. */
function GrandFinalePalace({ theme, at }: { theme: SceneTheme; at: HeroPlacement }) {
  const geo = useMemo(
    () => ({
      base: new BoxGeometry(14, 8, 14),
      mid: new BoxGeometry(9, 10, 9),
      top: new BoxGeometry(5, 8, 5),
      spire: new ConeGeometry(2.8, 7, 8),
    }),
    [],
  )
  const mat = useMemo(
    () => ({
      stone: new MeshStandardMaterial({ color: theme.statueColor, metalness: 0.5, roughness: 0.25 }),
      glow: new MeshStandardMaterial({ color: theme.statueEmissive, emissive: theme.statueEmissive, emissiveIntensity: theme.statueEmissiveIntensity * 0.5, toneMapped: false }),
    }),
    [theme],
  )
  useDisposableBuilding(geo, mat)

  return (
    <group position={at.position} rotation-y={at.rotationY} name="GrandFinalePalace">
      <mesh geometry={geo.base} material={mat.stone} position={[0, 4, 0]} castShadow receiveShadow />
      <mesh geometry={geo.mid} material={mat.stone} position={[0, 13, 0]} castShadow receiveShadow />
      <mesh geometry={geo.top} material={mat.stone} position={[0, 22, 0]} castShadow receiveShadow />
      <mesh geometry={geo.spire} material={mat.glow} position={[0, 29.5, 0]} />
    </group>
  )
}

/** The four hero buildings, placed at the STOPS positions along the road, alternating sides. */
export function HeroBuildings({ theme }: { theme: SceneTheme }) {
  const placements = useMemo(
    () => [placementAt(STOPS[0].t, -1), placementAt(STOPS[1].t, 1), placementAt(STOPS[2].t, -1), placementAt(STOPS[3].t, 1)],
    [],
  )

  return (
    <group name="HeroBuildings">
      <SecureW2Tower theme={theme} at={placements[0]} />
      <SkillsMatrix theme={theme} at={placements[1]} />
      <EduEatsCampus theme={theme} at={placements[2]} />
      <GrandFinalePalace theme={theme} at={placements[3]} />
    </group>
  )
}
