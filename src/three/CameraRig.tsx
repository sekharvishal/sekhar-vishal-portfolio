import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { BufferGeometry, Line, LineBasicMaterial, MathUtils, PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { FINALE_RELEASE, FINALE_THRESHOLD } from '../state/scrollMap'
import { finaleState, scrollStore } from '../state/scrollStore'
import { curve, writePoseAt } from './cameraPath'

export const BASE_FOV = 50
/** Detail routes park the camera at the end of the path, in the distant finale framing. */
const PARKED_T = 1

function setFinale(active: boolean) {
  gsap.to(finaleState, {
    pullBack: active ? 11 : 0,
    focus: active ? 1 : 0,
    fov: active ? -8 : 0,
    duration: active ? 2.4 : 1.2,
    ease: active ? 'power3.inOut' : 'power2.inOut',
    overwrite: true,
  })
}

/**
 * Flies the camera along the spline. Everything per-frame happens in useFrame
 * on mutable objects; no React state is touched.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const position = useRef(new Vector3())
  const targetQuat = useRef(new Quaternion())
  const initialised = useRef(false)
  const finaleOn = useRef(false)

  useEffect(() => {
    camera.fov = BASE_FOV
    camera.updateProjectionMatrix()
    return () => {
      gsap.killTweensOf(finaleState)
      finaleState.pullBack = 0
      finaleState.focus = 0
      finaleState.fov = 0
    }
  }, [camera])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)

    // Extra damping on top of Lenis' smoothing keeps the DoF focus target stable.
    const target = scrollStore.parked ? PARKED_T : scrollStore.progress
    scrollStore.smooth = MathUtils.damp(scrollStore.smooth, target, 5, dt)
    const t = scrollStore.smooth

    // One-shot finale tween with hysteresis; scrolling back reverses it.
    const wantFinale = scrollStore.parked
      ? true
      : finaleOn.current
        ? t >= FINALE_RELEASE
        : t >= FINALE_THRESHOLD
    if (wantFinale !== finaleOn.current) {
      finaleOn.current = wantFinale
      setFinale(wantFinale)
    }

    writePoseAt(t, position.current, targetQuat.current, finaleState)

    // Idle "breathing": independent of scroll so the scene feels alive when still.
    const elapsed = state.clock.elapsedTime
    camera.position.set(
      position.current.x + Math.cos(elapsed * 0.5) * 0.02,
      position.current.y + Math.sin(elapsed * 0.8) * 0.04,
      position.current.z,
    )

    if (!initialised.current) {
      camera.quaternion.copy(targetQuat.current)
      initialised.current = true
    } else {
      camera.quaternion.slerp(targetQuat.current, 1 - Math.exp(-8 * dt))
    }

    const fov = BASE_FOV + finaleState.fov
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}

/** Debug helper (`?debug`): draws the flight path. Geometry/material are disposed on unmount. */
export function CameraPathPreview() {
  const line = useMemo(
    () =>
      new Line(
        new BufferGeometry().setFromPoints(curve.getPoints(240)),
        new LineBasicMaterial({ color: '#c9a24b', transparent: true, opacity: 0.6 }),
      ),
    [],
  )

  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as LineBasicMaterial).dispose()
    },
    [line],
  )

  return <primitive object={line} />
}
