let cached: boolean | undefined

/** Pure feature probe (cached): is a WebGL context obtainable in this browser? */
export function detectWebGL(): boolean {
  if (cached !== undefined) return cached
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    cached = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    cached = false
  }
  return cached
}

export function useWebGLSupport(): boolean {
  return detectWebGL()
}
