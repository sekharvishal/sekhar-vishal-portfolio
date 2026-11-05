import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject, projects } from '../data/content'
import { StatusBadge } from '../ui/StatusBadge'
import { NotFound } from './NotFound'

function CaseBlock({ label, children }: { label: string; children: string }) {
  const isTodo = children.includes('TODO')
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="eyebrow">{label}</h3>
      <p className={`mt-3 leading-relaxed ${isTodo ? 'text-muted italic' : 'text-fg'}`}>{children}</p>
    </div>
  )
}

export function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)

  useEffect(() => {
    if (project) document.title = `${project.title} | Sekhar Vishal`
    return () => {
      document.title = 'Sekhar Vishal | Full Stack Java Developer'
    }
  }, [project])

  if (!project) return <NotFound />

  const index = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article
      aria-labelledby="project-title"
      className="glass mx-4 my-28 rounded-3xl px-6 py-10 md:mx-auto md:max-w-4xl md:px-12"
    >
      <Link to="/#projects" className="pointer-events-auto font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-gold">
        &larr; All projects
      </Link>

      <header className="mt-8">
        <StatusBadge status={project.status} />
        <h1 id="project-title" className="mt-5 text-4xl md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-gold">{project.kind}</p>
        <p className="mt-6 text-lg leading-relaxed text-muted">{project.summary}</p>
      </header>

      <section aria-labelledby="stack-title" className="mt-12">
        <h2 id="stack-title" className="text-2xl">
          Stack
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item} className={`chip ${item.startsWith('TODO') ? 'border-dashed text-gold' : ''}`}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="features-title" className="mt-12">
        <h2 id="features-title" className="text-2xl">
          {project.status === 'in-development' ? 'Planned features' : 'Features'}
        </h2>
        <ul className="mt-4 space-y-2 text-muted">
          {project.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {project.caseStudy && (
        <section aria-labelledby="case-title" className="mt-12">
          <h2 id="case-title" className="text-2xl">
            Case study
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <CaseBlock label="Problem">{project.caseStudy.problem}</CaseBlock>
            <CaseBlock label="My contribution">{project.caseStudy.contribution}</CaseBlock>
            <CaseBlock label="Challenge">{project.caseStudy.challenge}</CaseBlock>
            <CaseBlock label="Result">
              {project.caseStudy.result ?? 'No measured result published yet. Results are added only with real evidence.'}
            </CaseBlock>
          </div>
        </section>
      )}

      {(project.links?.repo || project.links?.demo) && (
        <div className="mt-10 flex gap-3">
          {project.links.repo && (
            <a className="btn" href={project.links.repo} target="_blank" rel="noreferrer noopener">
              Source code
            </a>
          )}
          {project.links.demo && (
            <a className="btn btn-solid" href={project.links.demo} target="_blank" rel="noreferrer noopener">
              Live demo
            </a>
          )}
        </div>
      )}

      <nav aria-label="Next project" className="mt-16 border-t border-line/15 pt-8">
        <Link to={`/projects/${next.slug}`} className="group inline-flex flex-col">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</span>
          <span className="mt-1 font-display text-2xl text-fg transition group-hover:text-gold">{next.title} &rarr;</span>
        </Link>
      </nav>
    </article>
  )
}
