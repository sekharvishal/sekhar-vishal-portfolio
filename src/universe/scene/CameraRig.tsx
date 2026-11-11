import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import { sampleTrack } from '../cameraTrack'
import { livePalette, paletteAt } from '../palettes'
import { locate } from '../universeMap'
import { uiStore, universe } from '../universeStore'

const smoothstep = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Flies the camera along the keyframed track, with parallax, drift, roll and speed-FOV. */
export function CameraRig() {
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const cam = state.camera as PerspectiveCamera

    universe.smooth = MathUtils.damp(universe.smooth, universe.progress, 3.4, dt)
    universe.mouseX = MathUtils.damp(universe.mouseX, universe.pointerX, 3, dt)
    universe.mouseY = MathUtils.damp(universe.mouseY, universe.pointerY, 3, dt)

    const place = locate(universe.smooth)
    universe.chapter = place.chapter
    universe.item = place.item
    universe.local = place.local
    universe.chapterF = place.chapter + smoothstep(0.72, 1, place.local)
    paletteAt(universe.chapterF, uiStore.get().mood, livePalette)

    sampleTrack(universe.smooth, pos, look)
    look.x += universe.mouseX * 1.4
    look.y += universe.mouseY * 0.9

    const dolly = 1 - Math.pow(1 - universe.dolly, 3)
    pos.z += (1 - dolly) * 60

    const t = state.clock.elapsedTime
    cam.position.copy(pos)
    cam.lookAt(look)
    cam.translateX(universe.mouseX * 0.8 + Math.sin(t * 0.31) * 0.14)
    cam.translateY(universe.mouseY * 0.5 + Math.cos(t * 0.27) * 0.1)
    cam.rotateZ(-universe.mouseX * 0.02 + Math.sin(t * 0.2) * 0.004)

    const speed = Math.min(Math.abs(universe.velocity) / 70, 1)
    const fov = 55 + speed * 9
    if (Math.abs(cam.fov - fov) > 0.02) {
      cam.fov = MathUtils.damp(cam.fov, fov, 6, dt)
      cam.updateProjectionMatrix()
    }

    universe.camX = cam.position.x
    universe.camY = cam.position.y
    universe.camZ = cam.position.z
  })

  return null
}
