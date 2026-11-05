import { achievements } from '../../data/content'
import { Section } from '../Section'

export function Achievements() {
  return (
    <Section id="achievements" eyebrow="07 &middot; Highlights" title="What the journey adds up to" wide>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <li key={a.title} className="rounded-2xl border border-line/15 p-5">
            <h3 className="text-xl">{a.title}</h3>
            <p className="mt-2 text-sm text-muted">{a.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
