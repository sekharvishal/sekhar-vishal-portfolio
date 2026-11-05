import { Suspense, lazy, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDeviceTier } from '../hooks/useDeviceTier'
import { useStaticMode } from '../hooks/useStaticMode'
import { scrollStore } from '../state/scrollStore'
import { Header } from '../ui/Header'

// The 3D chunk (three, r3f, drei) is loaded lazily so the HTML shell paints first.
const Scene = lazy(() => import('../three/Scene'))
const SceneCity = lazy(() => import('../three-city/SceneCity'))

function SceneLoader() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center" aria-hidden="true">
      <span className="h-10 w-10 animate-pulse rounded-full border border-gold/60" />
    </div>
  )
}

/** Route side effects: camera parking, scroll reset and ScrollTrigger refresh. */
function useRouteEffects() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    scrollStore.parked = pathname !== '/'
  }, [pathname])

  useEffect(() => {
    // A hash on the home route is handled by HomePage; everything else starts at the top.
    if (!hash || pathname !== '/') {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
    }
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, lenis])
}

export function Layout() {
  const { settings } = useDeviceTier()
  const { staticMode } = useStaticMode()
  const { pathname } = useLocation()
  useRouteEffects()

  // Lighter backdrop blur on weaker devices.
  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${settings.glassBlurPx}px`)
  }, [settings.glassBlurPx])

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-gold px-4 py-2 font-mono text-xs uppercase tracking-widest text-bg"
      >
        Skip to content
      </a>
      <div className="fallback-backdrop" aria-hidden="true" />
      {/* Reduced motion / no WebGL: the gradient backdrop stands in for the canvas. */}
      {!staticMode && pathname !== '/city' && (
        <Suspense fallback={<SceneLoader />}>
          <Scene />
        </Suspense>
      )}
      {!staticMode && pathname === '/city' && (
        <Suspense fallback={<SceneLoader />}>
          <SceneCity />
        </Suspense>
      )}
      <Header />
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Outlet />
      </main>
    </>
  )
}
