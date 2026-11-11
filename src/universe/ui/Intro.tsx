import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { profile } from '../../data/content'
import { uiStore, universe, useUi } from '../universeStore'

const STATUS = [
  'Calibrating the stars',
  'Compiling constellations',
  'Opening the portals',
  'Charting the journey',
  'Igniting the core',
]
const MIN_MS = 2400
const MAX_MS = 9000

/** Cinematic loader. Eases toward real readiness, then releases the camera dolly + name morph. */
export function Intro() {
  const introDone = useUi((s) => s.introDone)
  const lenis = useLenis()
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const started = useRef(performance.now())
  const finished = useRef(false)

  useEffect(() => {
    if (introDone) return
    lenis?.stop()
  }, [lenis, introDone])

  const finish = useCallback(
    (fast: boolean) => {
      if (finished.current) return
      finished.current = true
      setLeaving(true)
      setPct(100)
      gsap.to(universe, { dolly: 1, duration: fast ? 1.1 : 3.4, ease: 'power2.out' })
      gsap.to(universe, { morph: 1, duration: fast ? 1.4 : 3.8, delay: fast ? 0 : 0.6, ease: 'power1.inOut' })
      window.setTimeout(() => {
        uiStore.set({ introDone: true })
        lenis?.start()
      }, fast ? 500 : 1000)
    },
    [lenis],
  )

  useEffect(() => {
    if (introDone) return
    let raf = 0
    let shown = 0
    const loop = (now: number) => {
      const elapsed = now - started.current
      const ready = uiStore.get().sceneReady
      const target = ready ? 100 : 86
      const timeCap = Math.min(100, (elapsed / MIN_MS) * 100)
      shown += (Math.min(target, timeCap) - shown) * 0.08
      setPct(Math.min(100, Math.round(shown)))
      if ((shown > 99.2 && ready && elapsed > MIN_MS) || elapsed > MAX_MS) {
        finish(false)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [introDone, finish])

  useEffect(() => {
    if (introDone) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [introDone, finish])

  if (introDone) return null

  const status = STATUS[Math.min(STATUS.length - 1, Math.floor((pct / 100) * STATUS.length))]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading the experience"
      className={`uni-intro ${leaving ? 'is-leaving' : ''}`}
    >
      <div className="uni-intro-top">
        <span>{profile.name}</span>
        <span>{profile.role}</span>
      </div>
      <div className="uni-intro-center">
        <div className="uni-intro-count" aria-hidden="true">
          {String(pct).padStart(3, '0')}
        </div>
        <div className="uni-intro-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p>{status}</p>
      </div>
      <button type="button" className="uni-intro-skip" onClick={() => finish(true)} data-cursor="Skip">
        Skip intro
      </button>
    </div>
  )
}
