import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStaticMode } from '../hooks/useStaticMode'
import { Overlay } from '../ui/Overlay'

export function HomePage() {
  const { hash } = useLocation()
  const lenis = useLenis()
  const { staticMode } = useStaticMode()

  // Arriving via /#section (e.g. from a project page): jump once layout is ready.
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

  return <Overlay staticMode={staticMode} />
}
