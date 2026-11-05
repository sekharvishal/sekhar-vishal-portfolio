import { skillGroups } from '../../data/content'
import { Section } from '../Section'

export function Skills() {
  return (
    <Section id="skills" eyebrow="04 &middot; Skills" title="Tools of the craft" wide>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.name} className="rounded-2xl border border-line/15 p-5">
            <h3 className="text-2xl">{group.name}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <li key={skill} className="chip">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted">
        Awareness items (XSS, Host Header Injection) and foundational topics describe familiarity, not deep expertise.
      </p>
    </Section>
  )
}
