import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { CITY_FINALE_RELEASE, CITY_FINALE_THRESHOLD } from '../state/scrollMapCity'
import { carFinaleState, carPose, scrollStoreCity } from '../state/scrollStoreCity'
import { CITY_BASE_FOV, computeChaseTarget } from './chaseCamera'

function setCarFinale(active: boolean) {
  gsap.to(carFinaleState, {
    pullBack: active ? 9 : 0,
    liftUp: active ? 4 : 0,
    focus: active ? 1 : 0,
    fov: active ? -10 : 0,
    duration: active ? 2.2 : 1.1,
    ease: active ? 'power3.inOut' : 'power2.inOut',
    overwrite: true,
  })
}

const _forward = new Vector3()
const _desiredPos = new Vector3()
const _lookTarget = new Vector3()
const LOOK_AHEAD = 5

/**
 * GTA-style chase camera: trails behind and above the car (via `computeChaseTarget`),
 * damp-smoothed so it never snaps to the car's own transform, with a GSAP
 * pull-back-and-up tween for the Grand Finale (hysteresis between
 * `CITY_FINALE_THRESHOLD` and `CITY_FINALE_RELEASE`, same one-shot pattern as
 * the statue's `CameraRig.tsx`).
 */
export function CameraRigCity() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const position = useRef(new Vector3())
  const look = useRef(new Vector3())
  const initialised = useRef(false)
  const finaleOn = useRef(false)

  useEffect(() => {
    camera.fov = CITY_BASE_FOV
    camera.updateProjectionMatrix()
    return () => {
      gsap.killTweensOf(carFinaleState)
      carFinaleState.pullBack = 0
      carFinaleState.liftUp = 0
      carFinaleState.focus = 0
      carFinaleState.fov = 0
    }
  }, [camera])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)

    const wantFinale = scrollStoreCity.parked
      ? true
      : finaleOn.current
        ? scrollStoreCity.smooth >= CITY_FINALE_RELEASE
        : scrollStoreCity.smooth >= CITY_FINALE_THRESHOLD
    if (wantFinale !== finaleOn.current) {
      finaleOn.current = wantFinale
      setCarFinale(wantFinale)
    }

    computeChaseTarget(
      { carPosition: carPose.position, carQuaternion: carPose.quaternion, pullBack: carFinaleState.pullBack, liftUp: carFinaleState.liftUp },
      _desiredPos,
    )

    _forward.set(0, 0, -1).applyQuaternion(carPose.quaternion)
    _lookTarget.copy(carPose.position).addScaledVector(_forward, LOOK_AHEAD)
    _lookTarget.lerp(carPose.position, carFinaleState.focus * 0.6)

    if (!initialised.current) {
      position.current.copy(_desiredPos)
      look.current.copy(_lookTarget)
      initialised.current = true
    } else {
      position.current.x = MathUtils.damp(position.current.x, _desiredPos.x, 4, dt)
      position.current.y = MathUtils.damp(position.current.y, _desiredPos.y, 4, dt)
      position.current.z = MathUtils.damp(position.current.z, _desiredPos.z, 4, dt)
      look.current.x = MathUtils.damp(look.current.x, _lookTarget.x, 5, dt)
      look.current.y = MathUtils.damp(look.current.y, _lookTarget.y, 5, dt)
      look.current.z = MathUtils.damp(look.current.z, _lookTarget.z, 5, dt)
    }

    camera.position.copy(position.current)
    camera.up.set(0, 1, 0)
    camera.lookAt(look.current)

    const fov = CITY_BASE_FOV + carFinaleState.fov - carPose.speed * 4
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}
