import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'

/**
 * Anchor navigation through Lenis so jumps are eased like normal scrolling.
 * On a detail route it navigates home with a hash; HomePage then scrolls there.
 */
export function useAnchorNav() {
  const lenis = useLenis()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (id: string) => {
      // `/city` (Neon Run) renders the same section ids in its own overlay, so it scrolls in place too.
      if (pathname !== '/statue' && pathname !== '/city') {
        navigate({ pathname: '/statue', hash: `#${id}` })
        return
      }
      const el = document.getElementById(id)
      if (!el) return
      if (lenis) lenis.scrollTo(el, { duration: 1.8 })
      else el.scrollIntoView({ behavior: 'smooth' })
    },
    [lenis, navigate, pathname],
  )
}
