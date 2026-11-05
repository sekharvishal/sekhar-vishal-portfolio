import { experience } from '../../data/content'
import type { ExperienceItem } from '../../data/types'
import { Section } from '../Section'

const TYPE_LABEL: Record<ExperienceItem['type'], string> = {
  employment: 'Employment',
  internship: 'Internship',
  virtual: 'Virtual experience',
}

export function Experience() {
  return (
    <Section id="experience" eyebrow="02 &middot; Experience" title="Where I have built things" wide>
      <ol className="grid gap-5 md:grid-cols-2">
        {experience.map((item) => (
          <li key={`${item.org}-${item.role}`} className="rounded-2xl border border-line/15 p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">{TYPE_LABEL[item.type]}</p>
            <h3 className="mt-1 text-2xl">{item.role}</h3>
            <p className="text-fg">
              {item.org} <span className="text-muted">&middot; {item.period}</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {item.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
