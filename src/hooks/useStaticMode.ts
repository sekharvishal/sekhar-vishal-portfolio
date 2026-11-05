import { useReducedMotion } from './useReducedMotion'
import { useWebGLSupport } from './useWebGLSupport'

/**
 * Static mode = plain HTML layout, no camera flight, no canvas:
 * used for `prefers-reduced-motion` and when WebGL is unavailable.
 */
export function useStaticMode(): { staticMode: boolean; reducedMotion: boolean; webgl: boolean } {
  const reducedMotion = useReducedMotion()
  const webgl = useWebGLSupport()
  return { staticMode: reducedMotion || !webgl, reducedMotion, webgl }
}
