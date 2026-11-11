import { Suspense, lazy, useEffect, useLayoutEffect, type CSSProperties } from 'react'
import { Navigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { profile } from '../data/content'
import { useStaticMode } from '../hooks/useStaticMode'
import { scrollStore } from '../state/scrollStore'
import { stopAmbient } from './ambientAudio'
import { usePlace } from './hooks'
import { accentHex } from './palettes'
import { TOTAL_VH } from './universeMap'
import { resetUniverse, uiStore, universe, useUi } from './universeStore'
import { AudioBridge } from './ui/AudioBridge'
import { ChapterPanels } from './ui/ChapterPanels'
import { ChapterRail } from './ui/ChapterRail'
import { CommandPalette } from './ui/CommandPalette'
import { Cursor } from './ui/Cursor'
import { Hud } from './ui/Hud'
import { Intro } from './ui/Intro'
import { ProjectTakeover } from './ui/ProjectTakeover'
import { Terminal } from './ui/Terminal'
import { TopBar } from './ui/TopBar'
import './universe.css'

// The 3D chunk (three, r3f, drei, postprocessing) loads lazily; the intro covers the wait.
const UniverseScene = lazy(() => import('./scene/UniverseScene'))

function UniverseExperience() {
  const lenis = useLenis()
  const mood = useUi((s) => s.mood)
  const { chapter } = usePlace()

  // Fresh state on every visit.
  useLayoutEffect(() => {
    resetUniverse()
    uiStore.set({
      introDone: false,
      sceneReady: false,
      paletteOpen: false,
      terminalOpen: false,
      project: null,
      sound: false,
    })
    universe.morph = 0
    universe.dolly = 0
    return () => {
      stopAmbient()
      uiStore.set({ sound: false, introDone: false })
    }
  }, [])

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }, [lenis])

  // Mirror Lenis progress / velocity into the per-frame store and track the pointer.
  useEffect(() => {
    let raf = 0
    const sync = () => {
      universe.progress = scrollStore.progress
      universe.velocity = scrollStore.velocity
      raf = requestAnimationFrame(sync)
    }
    raf = requestAnimationFrame(sync)

    const onPointer = (e: PointerEvent) => {
      universe.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      universe.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  const style = { '--uni-accent': accentHex(chapter, mood) } as CSSProperties

  return (
    <div className="uni" style={style}>
      <Suspense fallback={null}>
        <UniverseScene />
      </Suspense>

      <div className="uni-grain" aria-hidden="true" />

      {/* Invisible spacer: the page's scroll length drives the whole journey. */}
      <div aria-hidden="true" style={{ height: `${TOTAL_VH}vh` }} />

      <main id="main" tabIndex={-1} className="uni-ui outline-none">
        <h1 className="sr-only">
          {profile.name} - {profile.role}
        </h1>
        <div className="sr-only">
          {profile.summary.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <ChapterPanels />
      </main>

      <TopBar />
      <ChapterRail />
      <Hud />
      <ProjectTakeover />
      <CommandPalette />
      <Terminal />
      <AudioBridge />
      <Cursor />
      <Intro />
    </div>
  )
}

/** The default home: one continuous 3D world. Falls back to the plain statue page when motion/WebGL is unavailable. */
export function UniversePage() {
  const { staticMode } = useStaticMode()
  if (staticMode) return <Navigate to="/statue" replace />
  return <UniverseExperience />
}
