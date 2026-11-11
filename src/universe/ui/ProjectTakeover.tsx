import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { getProject } from '../../data/content'
import { uiStore, useUi } from '../universeStore'

function Block({ label, children }: { label: string; children: string }) {
  const todo = children.includes('TODO')
  return (
    <div className="uni-case-block">
      <h3>{label}</h3>
      <p className={todo ? 'is-todo' : ''}>{children}</p>
    </div>
  )
}

/** Full-screen case-study takeover that irises open from the centre. */
export function ProjectTakeover() {
  const slug = useUi((s) => s.project)
  const lenis = useLenis()
  const closeRef = useRef<HTMLButtonElement>(null)
  const project = slug ? getProject(slug) : undefined

  useEffect(() => {
    if (!project) return
    lenis?.stop()
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') uiStore.set({ project: null })
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [project, lenis])

  if (!project) return null

  const close = () => uiStore.set({ project: null })

  return (
    <div className="uni-takeover" role="dialog" aria-modal="true" aria-labelledby="uni-case-title">
      <div className="uni-takeover-scroll" data-lenis-prevent>
        <button ref={closeRef} type="button" className="uni-close" onClick={close} data-cursor="Close">
          Close <span aria-hidden="true">esc</span>
        </button>

        <p className="uni-eyebrow">{project.kind}</p>
        <h2 id="uni-case-title" className="uni-display uni-case-title">
          {project.title}
        </h2>
        <p className="uni-lede">{project.summary}</p>

        <ul className="uni-chips">
          {project.stack.map((s) => (
            <li key={s} className={`uni-chip ${s.startsWith('TODO') ? 'is-todo' : ''}`}>
              {s}
            </li>
          ))}
        </ul>

        <h3 className="uni-case-h">{project.status === 'in-development' ? 'Planned features' : 'Features'}</h3>
        <ul className="uni-list">
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        {project.caseStudy && (
          <>
            <h3 className="uni-case-h">Case study</h3>
            <div className="uni-case-grid">
              <Block label="Problem">{project.caseStudy.problem}</Block>
              <Block label="My contribution">{project.caseStudy.contribution}</Block>
              <Block label="Challenge">{project.caseStudy.challenge}</Block>
              <Block label="Result">
                {project.caseStudy.result ?? 'No measured result published yet. Results are added only with real evidence.'}
              </Block>
            </div>
          </>
        )}

        <div className="uni-actions">
          {project.links?.repo && (
            <a className="uni-btn" href={project.links.repo} target="_blank" rel="noreferrer noopener">
              Source code
            </a>
          )}
          {project.links?.demo && (
            <a className="uni-btn is-solid" href={project.links.demo} target="_blank" rel="noreferrer noopener">
              Live demo
            </a>
          )}
          <Link className="uni-btn" to={`/projects/${project.slug}`} onClick={close}>
            Open as a page
          </Link>
        </div>
      </div>
    </div>
  )
}
