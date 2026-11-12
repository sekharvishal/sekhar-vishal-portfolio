import { useEffect, useRef } from 'react'
import { useActionRunner } from '../actions'
import { usePlace } from '../hooks'
import { CHAPTERS } from '../universeMap'
import { universe, useUi } from '../universeStore'

const pad = (n: number) => String(n).padStart(2, '0')

/** Bottom bar: live telemetry on the left, tools (sound, terminal, palette) on the right. */
export function Hud() {
  const { chapter } = usePlace()
  const sound = useUi((s) => s.sound)
  const terminalOpen = useUi((s) => s.terminalOpen)
  const run = useActionRunner()
  const coords = useRef<HTMLSpanElement>(null)
  const prog = useRef<HTMLSpanElement>(null)
  const clock = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      if (coords.current) {
        coords.current.textContent = `X ${universe.camX.toFixed(1)}  Y ${universe.camY.toFixed(1)}  Z ${universe.camZ.toFixed(1)}`
      }
      if (prog.current) prog.current.textContent = `${Math.round(universe.progress * 100)}%`
      if (clock.current) clock.current.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, 120)
    return () => window.clearInterval(id)
  }, [])

  return (
    <footer className="uni-hud">
      <div className="uni-hud-left" aria-hidden="true">
        <span>
          CH {pad(chapter + 1)}/{pad(CHAPTERS.length)} &middot; {CHAPTERS[chapter].label.toUpperCase()}
        </span>
        <span ref={coords}>X 0.0 Y 0.0 Z 0.0</span>
        <span>
          <span ref={prog}>0%</span> &middot; <span ref={clock}>--:--</span>
        </span>
      </div>
      <div className="uni-hud-right">
        <button
          type="button"
          className={sound ? 'is-on' : ''}
          aria-pressed={sound}
          onClick={() => run({ type: 'sound' })}
          data-cursor={sound ? 'Mute' : 'Sound'}
        >
          Sound {sound ? 'on' : 'off'}
        </button>
        <button
          type="button"
          className={terminalOpen ? 'is-on' : ''}
          aria-pressed={terminalOpen}
          onClick={() => run({ type: 'terminal' })}
          data-cursor="Ask"
        >
          Ask Sekhar
        </button>
        <button type="button" className="uni-kbd" onClick={() => run({ type: 'palette' })} data-cursor="Search">
          Ctrl K
        </button>
      </div>
    </footer>
  )
}
