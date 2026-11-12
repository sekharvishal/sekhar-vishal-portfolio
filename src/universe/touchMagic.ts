import { useEffect } from 'react'
import { universe } from './universeStore'

type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/**
 * Makes the Universe respond to a phone the way it responds to a mouse:
 *  - every tap sends a shockwave through the aurora (read by the Sky shader),
 *  - tilting the phone steers the camera (same channel the mouse uses),
 *  - a faint haptic tick marks arrival at each chapter (Android; iOS has no web vibration API).
 * All of it is skipped for reduced-motion users and non-touch devices.
 */
export function useTouchMagic(chapter: number): void {
  useEffect(() => {
    if (!isTouchDevice() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tiltOn = false
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      // gamma: left/right roll, beta: front/back pitch. Treat ~35deg of tilt as full deflection;
      // beta is centred on 50deg because that is how people hold a phone.
      universe.pointerX = clamp(e.gamma / 35, -1, 1)
      universe.pointerY = clamp(-(e.beta - 50) / 35, -1, 1)
    }
    const enableTilt = async () => {
      if (tiltOn) return
      const ctor = window.DeviceOrientationEvent as OrientationCtor | undefined
      if (!ctor) return
      try {
        // iOS 13+ only grants this from inside a user gesture.
        if (typeof ctor.requestPermission === 'function' && (await ctor.requestPermission()) !== 'granted') return
      } catch {
        return
      }
      tiltOn = true
      window.addEventListener('deviceorientation', onTilt)
    }

    const onTap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      universe.tapX = (e.clientX / window.innerWidth) * 2 - 1
      universe.tapY = -((e.clientY / window.innerHeight) * 2 - 1)
      universe.tapPending = true
      void enableTilt()
    }

    window.addEventListener('pointerdown', onTap, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onTap)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  useEffect(() => {
    if (chapter === 0 || !isTouchDevice() || typeof navigator.vibrate !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    navigator.vibrate(8)
  }, [chapter])
}
