import { useEffect, useMemo, useRef, useState } from 'react'
import { experience, profile, projects, skillGroups } from '../../data/content'
import { useActionRunner, type UniverseAction } from '../actions'
import { MOODS } from '../palettes'
import { CHAPTERS } from '../universeMap'
import { uiStore, useUi } from '../universeStore'

interface Item {
  id: string
  label: string
  hint: string
  group: string
  action: UniverseAction
}

function buildItems(): Item[] {
  const items: Item[] = []
  CHAPTERS.forEach((c, i) =>
    items.push({ id: `ch-${c.id}`, label: c.label, hint: 'Fly to chapter', group: 'Chapters', action: { type: 'goto', chapter: i } }),
  )
  projects.forEach((p) =>
    items.push({ id: `pr-${p.slug}`, label: p.title, hint: 'Open case study', group: 'Projects', action: { type: 'open', slug: p.slug } }),
  )
  skillGroups.forEach((g, i) =>
    items.push({ id: `sk-${g.name}`, label: `Skills: ${g.name}`, hint: g.skills.slice(0, 3).join(', '), group: 'Skills', action: { type: 'goto', chapter: 1, item: i } }),
  )
  experience.forEach((e, i) =>
    items.push({ id: `ex-${i}`, label: `${e.role}, ${e.org}`, hint: e.period, group: 'Journey', action: { type: 'goto', chapter: 3, item: i } }),
  )
  items.push({ id: 'ln-email', label: 'Send an email', hint: profile.email, group: 'Contact', action: { type: 'link', href: `mailto:${profile.email}` } })
  profile.links.forEach((l) =>
    items.push({ id: `ln-${l.label}`, label: l.label, hint: 'Open profile', group: 'Contact', action: { type: 'link', href: l.href } }),
  )
  items.push({ id: 'ln-resume', label: 'Resume', hint: 'Open the PDF', group: 'Contact', action: { type: 'link', href: profile.resumeHref } })
  items.push({ id: 'ac-terminal', label: 'Ask Sekhar (terminal)', hint: 'Type commands', group: 'Tools', action: { type: 'terminal' } })
  items.push({ id: 'ac-sound', label: 'Toggle ambient sound', hint: 'Generated live, no files', group: 'Tools', action: { type: 'sound' } })
  MOODS.forEach((m, i) =>
    items.push({ id: `mood-${m.id}`, label: `Palette: ${m.label}`, hint: 'Recolour the universe', group: 'Tools', action: { type: 'mood', mood: i } }),
  )
  items.push({ id: 'w-statue', label: 'World: The Monument', hint: 'A scroll-built sculpture and portfolio ascent', group: 'Worlds', action: { type: 'route', path: '/statue' } })
  items.push({ id: 'w-city', label: 'World: Neon Run', hint: 'A neon drive through the portfolio city', group: 'Worlds', action: { type: 'route', path: '/city' } })
  return items
}

const ITEMS = buildItems()

/** Ctrl/Cmd + K: fuzzy jump to anything. */
export function CommandPalette() {
  const open = useUi((s) => s.paletteOpen)
  const run = useActionRunner()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        uiStore.set({ paletteOpen: !uiStore.get().paletteOpen })
      } else if (e.key === 'Escape' && uiStore.get().paletteOpen) {
        uiStore.set({ paletteOpen: false })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ITEMS
    const words = q.split(/\s+/)
    return ITEMS.filter((it) => {
      const hay = `${it.label} ${it.hint} ${it.group}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [query])

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [index])

  if (!open) return null

  const choose = (item: Item | undefined) => {
    if (!item) return
    uiStore.set({ paletteOpen: false })
    run(item.action)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[index])
    }
  }

  return (
    <div className="uni-modal-backdrop" onMouseDown={() => uiStore.set({ paletteOpen: false })}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="uni-palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        data-lenis-prevent
      >
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIndex(0)
          }}
          placeholder="Jump to a chapter, project, skill, link..."
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="uni-palette-list"
          aria-activedescendant={results[index] ? `uni-opt-${results[index].id}` : undefined}
        />
        <ul id="uni-palette-list" role="listbox" ref={list}>
          {results.length === 0 && <li className="uni-palette-empty">Nothing matches &ldquo;{query}&rdquo;.</li>}
          {results.map((it, i) => (
            <li
              key={it.id}
              id={`uni-opt-${it.id}`}
              role="option"
              aria-selected={i === index}
              className={i === index ? 'is-active' : ''}
              onMouseMove={() => setIndex(i)}
              onClick={() => choose(it)}
            >
              <span className="uni-palette-group">{it.group}</span>
              <span className="uni-palette-label">{it.label}</span>
              <span className="uni-palette-hint">{it.hint}</span>
            </li>
          ))}
        </ul>
        <div className="uni-palette-foot">
          <span>&uarr;&darr; navigate</span>
          <span>&crarr; select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
