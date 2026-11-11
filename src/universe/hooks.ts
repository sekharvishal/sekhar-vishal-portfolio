import { useEffect, useState } from 'react'
import { universe } from './universeStore'

/** Re-renders only when `read()` changes. `read` must be a stable (module-level) function. */
export function usePolled<T>(read: () => T): T {
  const [value, setValue] = useState<T>(read)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const next = read()
      setValue((prev) => (Object.is(prev, next) ? prev : next))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [read])
  return value
}

const readPlaceKey = () => universe.chapter * 100 + universe.item
const readSkillHover = () => universe.hoverSkillGroup * 100 + universe.hoverSkillIndex
const readProjectHover = () => universe.hoverProject
const readCredentialHover = () => universe.hoverCredential

/** Chapter and item the camera is currently parked at. */
export function usePlace(): { chapter: number; item: number } {
  const key = usePolled(readPlaceKey)
  return { chapter: Math.floor(key / 100), item: key % 100 }
}

export const useProjectHover = () => usePolled(readProjectHover)
export const useCredentialHover = () => usePolled(readCredentialHover)
/** -1 when nothing is hovered; otherwise group * 100 + index (index >= 0). */
export const useSkillHover = () => usePolled(readSkillHover)
