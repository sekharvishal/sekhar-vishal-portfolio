import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp01 } from '../state/scrollMap'
import { scrollStore } from '../state/scrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires Lenis to GSAP:
 *  - Lenis' own rAF is disabled (`autoRaf: false`); the GSAP ticker drives it,
 *    so Lenis, ScrollTrigger and R3F all share one clock (no jitter).
 *  - `lagSmoothing(0)` stops GSAP from "catching up" after a slow frame, which
 *    would make the scroll position jump.
 *  - `lenis.on('scroll', ScrollTrigger.update)` keeps triggers in step with the
 *    smoothed (virtual) scroll position.
 */
function LenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onScroll = (instance: Lenis) => {
      scrollStore.progress = clamp01(instance.progress)
    }
    const tick = (time: number) => {
      lenis.raf(time * 1000)
      scrollStore.velocity = lenis.isScrolling ? lenis.velocity : 0
    }

    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', onScroll)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    onScroll(lenis)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  return (
    // Reduced motion: native, un-smoothed scrolling.
    <ReactLenis root options={{ autoRaf: false, lerp: 0.09, smoothWheel: !reducedMotion }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}
