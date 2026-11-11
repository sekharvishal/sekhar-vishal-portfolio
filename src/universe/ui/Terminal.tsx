import { useEffect, useRef, useState } from 'react'
import { useActionRunner } from '../actions'
import { runCommand } from '../terminalCommands'
import { uiStore, useUi } from '../universeStore'

interface Line {
  kind: 'in' | 'out'
  text: string
}

const BOOT: Line[] = [
  { kind: 'out', text: 'Ask Sekhar - a rule-based command line over the real portfolio content.' },
  { kind: 'out', text: 'Type "help" to see what it understands.' },
]

/** Slide-up terminal. Toggle with the backtick key or the HUD button. */
export function Terminal() {
  const open = useUi((s) => s.terminalOpen)
  const run = useActionRunner()
  const [lines, setLines] = useState<Line[]>(BOOT)
  const [value, setValue] = useState('')
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const input = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      if (e.key === '`' && !typing) {
        e.preventDefault()
        uiStore.set({ terminalOpen: !uiStore.get().terminalOpen })
      } else if (e.key === 'Escape' && uiStore.get().terminalOpen && !uiStore.get().paletteOpen) {
        uiStore.set({ terminalOpen: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus())
  }, [open])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, open])

  if (!open) return null

  const submit = () => {
    const text = value.trim()
    setValue('')
    cursor.current = -1
    if (!text) return
    history.current.push(text)
    const result = runCommand(text)
    setLines((prev) => [
      ...(result.clear ? [] : prev),
      ...(result.clear ? [] : [{ kind: 'in' as const, text }]),
      ...result.lines.map((l) => ({ kind: 'out' as const, text: l })),
    ])
    if (result.action) run(result.action)
    if (result.close) uiStore.set({ terminalOpen: false })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const h = history.current
      if (h.length === 0) return
      cursor.current = cursor.current < 0 ? h.length - 1 : Math.max(0, cursor.current - 1)
      setValue(h[cursor.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      if (cursor.current < 0) return
      cursor.current += 1
      if (cursor.current >= h.length) {
        cursor.current = -1
        setValue('')
      } else setValue(h[cursor.current])
    }
  }

  return (
    <section className="uni-terminal" role="dialog" aria-label="Ask Sekhar terminal" onClick={() => input.current?.focus()}>
      <header>
        <span>ask-sekhar &mdash; zsh</span>
        <button type="button" onClick={() => uiStore.set({ terminalOpen: false })} aria-label="Close terminal">
          esc
        </button>
      </header>
      <div className="uni-terminal-body" ref={scroller} data-lenis-prevent aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className={l.kind === 'in' ? 'is-in' : ''}>
            {l.kind === 'in' ? `> ${l.text}` : l.text}
          </pre>
        ))}
      </div>
      <label className="uni-terminal-input">
        <span aria-hidden="true">&gt;</span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command"
          placeholder="help"
        />
      </label>
    </section>
  )
}
