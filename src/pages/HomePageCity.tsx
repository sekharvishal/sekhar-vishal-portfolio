import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clamp01 } from '../state/scrollMap'
import { scrollStoreCity } from '../state/scrollStoreCity'
import { useStaticMode } from '../hooks/useStaticMode'
import { OverlayCity } from '../ui/OverlayCity'

/**
 * Mirrors `SmoothScroll.tsx`'s `LenisBridge`, writing into `scrollStoreCity`
 * instead of the statue's `scrollStore` so the two experiences never share
 * mutable per-frame state. Does not call `lenis.raf()` itself: the global
 * bridge in `SmoothScroll.tsx` already drives the one shared Lenis instance.
 */
function CityScrollBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const onScroll = (instance: Lenis) => {
      scrollStoreCity.progress = clamp01(instance.progress)
    }
    const tick = () => {
      scrollStoreCity.velocity = lenis.isScrolling ? lenis.velocity : 0
    }

    lenis.on('scroll', onScroll)
    gsap.ticker.add(tick)
    onScroll(lenis)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
    }
  }, [lenis])

  return null
}

export function HomePageCity() {
  const { hash } = useLocation()
  const lenis = useLenis()
  const { staticMode } = useStaticMode()

  // Arriving via /city#section: jump once layout is ready.
  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const el = document.getElementById(hash.slice(1))
      if (!el) return
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true })
      else el.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, lenis])

  return (
    <>
      <CityScrollBridge />
      <OverlayCity staticMode={staticMode} />
    </>
  )
}
