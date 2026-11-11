import { useActionRunner } from '../actions'
import { usePlace } from '../hooks'
import { CHAPTERS } from '../universeMap'

/** Vertical chapter index: click to fly to a chapter. */
export function ChapterRail() {
  const { chapter } = usePlace()
  const run = useActionRunner()
  return (
    <nav aria-label="Chapters" className="uni-rail">
      <ul>
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className={i === chapter ? 'is-active' : ''}
              aria-label={`Go to ${c.label}`}
              aria-current={i === chapter ? 'step' : undefined}
              onClick={() => run({ type: 'goto', chapter: i })}
              data-cursor={c.label}
            >
              <span className="uni-rail-label">{c.label}</span>
              <span className="uni-rail-dot" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
