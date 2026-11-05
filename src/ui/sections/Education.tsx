import { education } from '../../data/content'
import { Section } from '../Section'

export function Education() {
  return (
    <Section id="education" eyebrow="06 &middot; Education" title="Academic foundation">
      <ol className="space-y-4">
        {education.map((e) => (
          <li key={e.level} className="flex items-center justify-between gap-6 rounded-2xl border border-line/15 p-5">
            <div>
              <h3 className="text-2xl">{e.level}</h3>
              <p className="text-fg">{e.institution}</p>
              {e.detail && <p className="text-sm text-muted">{e.detail}</p>}
            </div>
            <p className="font-display text-4xl text-gold md:text-5xl">{e.score}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
