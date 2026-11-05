import { profile } from '../../data/content'
import { Section } from '../Section'

export function About() {
  return (
    <Section id="about" eyebrow="01 &middot; About" title="A developer who ships reliable software">
      <div className="space-y-4 text-lg leading-relaxed text-muted">
        {profile.summary.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Section>
  )
}
