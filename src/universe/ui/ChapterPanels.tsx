import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  achievements,
  credentials,
  education,
  experience,
  profile,
  projects,
  skillGroups,
  stats,
} from '../../data/content'
import type { CredentialKind, ExperienceItem, ProjectStatus } from '../../data/types'
import { useActionRunner } from '../actions'
import { useCredentialHover, usePlace } from '../hooks'
import { ARCHIVE_ITEMS, CHAPTERS } from '../universeMap'
import { universe, useUi } from '../universeStore'
import { Magnetic } from './Magnetic'
import { SplitWords } from './SplitWords'

const pad = (n: number) => String(n).padStart(2, '0')

function Eyebrow({ chapter, item, of }: { chapter: number; item?: number; of?: number }) {
  return (
    <p className="uni-eyebrow">
      <span>{pad(chapter + 1)}</span> {CHAPTERS[chapter].label}
      {item !== undefined && of ? <em>{` / ${pad(item + 1)} of ${pad(of)}`}</em> : null}
    </p>
  )
}

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="uni-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i === active ? 'is-active' : ''} />
      ))}
    </div>
  )
}

/* ------------------------------ Origin ------------------------------ */

/** The headline gives way to the particle name as the camera closes in. */
function OriginPanel() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const el = ref.current
      if (el) {
        const t = Math.min(Math.max((universe.chapter === 0 ? universe.local : 1) - 0.08, 0) / 0.2, 1)
        el.style.opacity = String(1 - t)
        el.style.transform = `translateY(${-t * 24}px)`
        el.style.pointerEvents = t > 0.9 ? 'none' : ''
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <section ref={ref} className="uni-panel uni-origin" aria-label="Introduction">
      <Eyebrow chapter={0} />
      <p className="uni-display">
        <SplitWords text={profile.headline} delay={0.15} />
      </p>
      <p className="uni-lede uni-rise" style={{ animationDelay: '0.7s' }}>
        {profile.subheadline}
      </p>
      <p className="uni-meta uni-rise" style={{ animationDelay: '0.85s' }}>
        {profile.role} &middot; {profile.stackLine}
      </p>
      <div className="uni-scroll-cue uni-rise" style={{ animationDelay: '1.1s' }} aria-hidden="true">
        <span />
        Scroll to travel
      </div>
    </section>
  )
}

/* ------------------------------ Skills ------------------------------ */

function SkillsPanel({ g }: { g: number }) {
  const group = skillGroups[g]
  return (
    <section className={`uni-panel ${g % 2 === 0 ? 'uni-right' : 'uni-left'}`} aria-label={`Skills: ${group.name}`}>
      <Eyebrow chapter={1} item={g} of={skillGroups.length} />
      <h2 className="uni-title">
        <SplitWords text={group.name} />
      </h2>
      <ul className="uni-chips">
        {group.skills.map((skill, i) => (
          <li
            key={skill}
            className="uni-chip uni-rise"
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
            onPointerEnter={() => {
              universe.hoverSkillGroup = g
              universe.hoverSkillIndex = i
            }}
            onPointerLeave={() => {
              universe.hoverSkillGroup = -1
              universe.hoverSkillIndex = -1
            }}
          >
            {skill}
          </li>
        ))}
      </ul>
      <p className="uni-hint">Hover a chip or a glowing node to light up the link.</p>
      <Dots count={skillGroups.length} active={g} />
    </section>
  )
}

/* ------------------------------ Projects ------------------------------ */

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: 'Completed',
  'in-development': 'In development',
  exploration: 'Technical exploration',
}

function ProjectsPanel({ index }: { index: number }) {
  const project = projects[index]
  const run = useActionRunner()
  return (
    <section className={`uni-panel ${index % 2 === 0 ? 'uni-right' : 'uni-left'}`} aria-label={`Project: ${project.title}`}>
      <Eyebrow chapter={2} item={index} of={projects.length} />
      <span className={`uni-pill ${project.status === 'shipped' ? 'is-solid' : ''}`}>{STATUS_LABEL[project.status]}</span>
      <h2 className="uni-title uni-title-sm">
        <SplitWords text={project.title} />
      </h2>
      <p className="uni-lede uni-rise" style={{ animationDelay: '0.3s' }}>
        {project.tagline}
      </p>
      <ul className="uni-chips">
        {project.stack.map((s, i) => (
          <li key={s} className="uni-chip uni-rise" style={{ animationDelay: `${0.35 + i * 0.04}s` }}>
            {s}
          </li>
        ))}
      </ul>
      <div className="uni-actions uni-rise" style={{ animationDelay: '0.6s' }}>
        <Magnetic>
          <button type="button" className="uni-btn is-solid" data-cursor="Open" onClick={() => run({ type: 'open', slug: project.slug })}>
            Enter the portal
          </button>
        </Magnetic>
        <Link to={`/projects/${project.slug}`} className="uni-btn" data-cursor="Open">
          Full page
        </Link>
      </div>
      <Dots count={projects.length} active={index} />
    </section>
  )
}

/* ------------------------------ Journey ------------------------------ */

const TYPE_LABEL: Record<ExperienceItem['type'], string> = {
  employment: 'Employment',
  internship: 'Internship',
  virtual: 'Virtual experience',
}

function JourneyPanel({ index }: { index: number }) {
  const e = experience[index]
  const bullets = e.bullets.filter((b) => !b.startsWith('TODO')).slice(0, 4)
  return (
    <section className={`uni-panel ${index % 2 === 0 ? 'uni-left' : 'uni-right'}`} aria-label={`${e.role} at ${e.org}`}>
      <Eyebrow chapter={3} item={index} of={experience.length} />
      <span className={`uni-pill uni-type-${e.type}`}>{TYPE_LABEL[e.type]}</span>
      <h2 className="uni-title uni-title-sm">
        <SplitWords text={e.role} />
      </h2>
      <p className="uni-org uni-rise" style={{ animationDelay: '0.2s' }}>
        {e.org} <span>&middot; {e.period}</span>
      </p>
      <ul className="uni-list">
        {bullets.map((b, i) => (
          <li key={b} className="uni-rise" style={{ animationDelay: `${0.3 + i * 0.07}s` }}>
            {b}
          </li>
        ))}
      </ul>
      <Dots count={experience.length} active={index} />
    </section>
  )
}

/* ------------------------------ Archive ------------------------------ */

const KIND_DOT: Record<CredentialKind, string> = { professional: '#ffd36b', course: '#7df9ff', simulation: '#ff7ad9' }

function ArchivePanel({ item }: { item: number }) {
  const hover = useCredentialHover()
  const anyUnverified = credentials.some((c) => !c.verified)
  return (
    <section className="uni-panel uni-left uni-wide" aria-label={ARCHIVE_ITEMS[item]}>
      <Eyebrow chapter={4} item={item} of={ARCHIVE_ITEMS.length} />
      <h2 className="uni-title uni-title-sm">
        <SplitWords text={ARCHIVE_ITEMS[item]} />
      </h2>

      {item === 0 && (
        <>
          <ul className="uni-rows" data-lenis-prevent>
            {credentials.map((c, i) => (
              <li
                key={c.title}
                className={`uni-row uni-rise ${hover === i ? 'is-hover' : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                onPointerEnter={() => {
                  universe.hoverCredential = i
                }}
                onPointerLeave={() => {
                  universe.hoverCredential = -1
                }}
              >
                <i style={{ background: KIND_DOT[c.kind] }} aria-hidden="true" />
                <span>
                  {c.title}
                  <small>{c.issuer}</small>
                </span>
              </li>
            ))}
          </ul>
          {anyUnverified && <p className="uni-hint">Exact titles are pending verification against the certificates.</p>}
        </>
      )}

      {item === 1 && (
        <ul className="uni-rows">
          {education.map((e, i) => (
            <li key={e.level} className="uni-row uni-rise" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <i style={{ background: '#ffd36b' }} aria-hidden="true" />
              <span>
                {e.level}
                <small>
                  {e.institution}
                  {e.detail ? ` · ${e.detail}` : ''}
                </small>
              </span>
              <b>{e.score}</b>
            </li>
          ))}
        </ul>
      )}

      {item === 2 && (
        <ul className="uni-rows" data-lenis-prevent>
          {achievements.map((a, i) => (
            <li key={a.title} className="uni-row uni-rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
              <i style={{ background: '#7dffc0' }} aria-hidden="true" />
              <span>
                {a.title}
                <small>{a.body}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
      <Dots count={ARCHIVE_ITEMS.length} active={item} />
    </section>
  )
}

/* ------------------------------ Contact ------------------------------ */

function ContactPanel() {
  return (
    <section className="uni-panel uni-contact" aria-label="Contact">
      <Eyebrow chapter={5} />
      <h2 className="uni-display">
        <SplitWords text="Let's build something reliable." />
      </h2>
      <p className="uni-lede uni-rise" style={{ animationDelay: '0.5s' }}>
        {profile.summary[profile.summary.length - 1]}
      </p>
      <div className="uni-actions uni-rise" style={{ animationDelay: '0.65s' }}>
        <Magnetic strength={0.45}>
          <a className="uni-btn is-solid" href={`mailto:${profile.email}`} data-cursor="Email">
            {profile.email}
          </a>
        </Magnetic>
        <a className="uni-btn" href={profile.resumeHref} target="_blank" rel="noreferrer noopener" data-cursor="Open">
          Resume
        </a>
        {profile.links.map((l) => (
          <a key={l.label} className="uni-btn" href={l.href} target="_blank" rel="noreferrer noopener" data-cursor="Open">
            {l.label}
          </a>
        ))}
      </div>
      <ul className="uni-stats uni-rise" style={{ animationDelay: '0.8s' }}>
        {stats.map((s) => (
          <li key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
      <p className="uni-worlds uni-rise" style={{ animationDelay: '0.95s' }}>
        Prefer another world?
        <Link to="/statue" data-cursor="Go">
          The statue
        </Link>
        <Link to="/city" data-cursor="Go">
          City drive
        </Link>
      </p>
    </section>
  )
}

/** The HTML copy for whichever chapter / stop the camera is parked at. */
export function ChapterPanels() {
  const { chapter, item } = usePlace()
  const introDone = useUi((s) => s.introDone)
  if (!introDone) return null
  return (
    <div className="uni-stage">
      {chapter === 0 && <OriginPanel key="origin" />}
      {chapter === 1 && <SkillsPanel key={`skills-${item}`} g={Math.min(item, skillGroups.length - 1)} />}
      {chapter === 2 && <ProjectsPanel key={`projects-${item}`} index={Math.min(item, projects.length - 1)} />}
      {chapter === 3 && <JourneyPanel key={`journey-${item}`} index={Math.min(item, experience.length - 1)} />}
      {chapter === 4 && <ArchivePanel key={`archive-${item}`} item={Math.min(item, ARCHIVE_ITEMS.length - 1)} />}
      {chapter === 5 && <ContactPanel key="contact" />}
    </div>
  )
}
