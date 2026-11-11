import { Link } from 'react-router-dom'
import { profile, toolkitSkillGroups } from '../data/content'

export function ToolkitPage() {
  return (
    <article className="toolkit-page mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-10">
      <header className="toolkit-intro">
        <p className="eyebrow">A separate portfolio view &middot; Engineering toolkit</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[0.98] md:text-7xl">
          The tools behind <span className="text-gold">the work.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {profile.role} across application development, cloud platforms, data, and delivery workflows. This page adds
          more context to the technology list without changing the original portfolio experience.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a className="btn btn-solid" href={profile.resumeHref} download>
            Download r&eacute;sum&eacute;
          </a>
          <Link className="btn" to="/statue#skills">
            Original skills section
          </Link>
        </div>
        <p className="mt-5 max-w-2xl border-l border-gold/50 pl-4 text-sm leading-relaxed text-muted">
          The descriptions explain what each technology is generally used for. They do not imply that every tool was
          used in every role or project. Security-awareness and foundational topics describe familiarity, not deep
          expertise.
        </p>
      </header>

      <section aria-labelledby="toolkit-matrix-title" className="mt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line/15 pb-4">
          <div>
            <p className="eyebrow">Capability map</p>
            <h2 id="toolkit-matrix-title" className="mt-2 text-3xl md:text-4xl">
              A broader engineering toolkit
            </h2>
          </div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold/80">
            {String(toolkitSkillGroups.length).padStart(2, '0')} areas
          </span>
        </div>

        <div className="skill-matrix">
          {toolkitSkillGroups.map((group, index) => (
            <article
              key={group.name}
              className="skill-card toolkit-card"
              style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
            >
              <div className="skill-card-top">
                <span className="skill-card-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="skill-card-rule" aria-hidden="true" />
                <span className="skill-card-count">{String(group.skills.length).padStart(2, '0')} items</span>
              </div>
              <h3 className="mt-4 text-xl leading-tight md:text-2xl">{group.name}</h3>
              <p className="mt-2 min-h-[5rem] text-sm leading-relaxed text-muted">{group.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${group.name} technologies`}>
                {group.skills.map((skill) => (
                  <li key={skill} className="chip skill-chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="toolkit-flow-title" className="mt-16">
        <p className="eyebrow">How the pieces relate</p>
        <h2 id="toolkit-flow-title" className="mt-2 text-3xl md:text-4xl">
          From application to delivery
        </h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'Build', 'Java, Spring Boot, Angular, and service-oriented design form the application layer.'],
            ['02', 'Connect data', 'Relational and NoSQL stores, messaging, and analytics services support data workflows.'],
            ['03', 'Package', 'Container technologies provide a way to package applications and coordinate workloads.'],
            ['04', 'Deliver together', 'Automation, planning, and shared documentation support the wider delivery process.'],
          ].map(([number, title, description]) => (
            <li key={number} className="toolkit-flow-card">
              <span className="font-mono text-xs tracking-[0.18em] text-gold">{number}</span>
              <h3 className="mt-3 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          This is a conceptual map of how these areas commonly fit together, not a description of a single deployed
          system.
        </p>
      </section>
    </article>
  )
}
