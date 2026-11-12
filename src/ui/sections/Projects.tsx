import { Link } from 'react-router-dom'
import { publicList } from '../../data/pending'
import { projects } from '../../data/content'
import { Section } from '../Section'
import { StatusBadge } from '../StatusBadge'

export function Projects() {
  return (
    <Section id="projects" eyebrow="03 &middot; Projects" title="Selected work and explorations" wide>
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line/15 p-5 transition hover:border-gold/60 hover:shadow-gold"
            >
              <StatusBadge status={project.status} />
              <h3 className="mt-3 text-2xl transition group-hover:text-gold">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">{project.tagline}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                {publicList(project.stack).map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-5 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Read case study &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
