import { Link } from 'react-router-dom'
import { profile } from '../../data/content'
import { useActionRunner } from '../actions'
import { MOODS } from '../palettes'
import { useUi } from '../universeStore'

export function TopBar() {
  const mood = useUi((s) => s.mood)
  const run = useActionRunner()
  const current = MOODS[mood % MOODS.length]

  return (
    <header className="uni-top">
      <button type="button" className="uni-brand" onClick={() => run({ type: 'goto', chapter: 0 })} aria-label={`${profile.name} - back to start`}>
        Sekhar <span>Vishal</span>
      </button>
      <div className="uni-top-right">
        <button type="button" onClick={() => run({ type: 'mood' })} data-cursor="Mood" aria-label={`Palette: ${current.label}. Click to change`}>
          <i aria-hidden="true" /> {current.label}
        </button>
        <Link to="/statue" className="uni-top-link" data-cursor="Go">
          The Monument
        </Link>
        <Link to="/city" className="uni-top-link" data-cursor="Go">
          Neon Run
        </Link>
      </div>
    </header>
  )
}
