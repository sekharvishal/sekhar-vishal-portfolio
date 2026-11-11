import { useEffect, useRef, useState } from 'react'
import { useUi } from '../universeStore'

const INTERACTIVE = 'a, button, [role="button"], input, summary, [data-cursor]'

/** Dot + trailing ring. Shows a label for 3D nodes (store) or `[data-cursor]` elements (DOM). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const storeLabel = useUi((s) => s.cursorLabel)
  const [domLabel, setDomLabel] = useState<string | null>(null)
  const [interactive, setInteractive] = useState(false)
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('uni-cursor-on')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      const el = target?.closest?.(INTERACTIVE) ?? null
      setInteractive(Boolean(el))
      setDomLabel(el?.getAttribute('data-cursor') ?? null)
    }
    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('uni-cursor-on')
    }
  }, [enabled])

  if (!enabled) return null
  const label = storeLabel ?? domLabel
  const grown = interactive || Boolean(storeLabel)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={ring} className="uni-cursor-ring">
        <div className={`uni-cursor-ring-inner ${grown ? 'is-grown' : ''} ${label ? 'has-label' : ''}`}>
          {label && <span>{label}</span>}
        </div>
      </div>
      <div ref={dot} className="uni-cursor-dot" />
    </div>
  )
}
