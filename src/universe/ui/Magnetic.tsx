import { useRef, type ReactNode } from 'react'

/** Wraps a control so it leans toward the pointer. Disabled for coarse pointers. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <span ref={ref} className="uni-magnetic" onPointerMove={move} onPointerLeave={reset}>
      {children}
    </span>
  )
}
