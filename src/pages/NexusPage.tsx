import { useState } from 'react'
import { achievements, credentials, education, experience, profile, projects, stats, toolkitSkillGroups } from '../data/content'
import './portfolioOrbit.css'

function confirmedText(value: string) {
  return value.split(/TODO:/i)[0].trim()
}

export function NexusPage() {
  const [selectedExperience, setSelectedExperience] = useState(0)
  const [selectedProject, setSelectedProject] = useState(0)
  const [selectedSkillGroup, setSelectedSkillGroup] = useState(0)
  const currentExperience = experience[selectedExperience]
  const currentProject = projects[selectedProject]
  const currentSkillGroup = toolkitSkillGroups[selectedSkillGroup]
  const orbitSkillGroups = toolkitSkillGroups.slice(0, 7)

  return (
    <article className="orbit-portfolio">
      <section className="orbit-hero" aria-labelledby="orbit-title">
        <div className="orbit-starfield" aria-hidden="true" />
        <div className="orbit-nebula orbit-nebula-one" aria-hidden="true" />
        <div className="orbit-nebula orbit-nebula-two" aria-hidden="true" />
        <div className="orbit-system">
          <svg className="orbit-system-links" viewBox="0 0 640 640" fill="none" aria-hidden="true">
            <circle cx="248" cy="251" r="118" />
            <circle cx="248" cy="251" r="164" />
          </svg>
          <div className="orbit-galaxy-halo" />
          <div className="orbit-black-hole"><span>SV</span><small>THE CORE</small></div>
          <div className="orbit-planetary-system">
            {orbitSkillGroups.map((group, index) => (
              <div className={`orbit-path orbit-path-${index + 1}`} key={group.name}>
                <button
                  type="button"
                  className={`orbit-planet orbit-planet-${index + 1}${selectedSkillGroup === index ? ' is-selected' : ''}`}
                  aria-label={`Explore ${group.name} technologies`}
                  aria-pressed={selectedSkillGroup === index}
                  onClick={() => {
                    setSelectedSkillGroup(index)
                    document.getElementById('toolkit')?.scrollIntoView?.({
                      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    })
                  }}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="orbit-planet-name">{group.name}</span>
                </button>
              </div>
            ))}
          </div>
          <div className="orbit-system-caption"><span>7 WORLDS OF WORK</span><b>✳</b><span>ONE CAREER IN MOTION</span></div>
        </div>
        <div className="orbit-hero-copy">
          <p className="orbit-kicker"><span /> SOFTWARE ENGINEER · PERSONAL PORTFOLIO</p>
          <h1 id="orbit-title">{profile.name.split(' ')[0]}<br /><em>{profile.name.split(' ').slice(1).join(' ')}</em></h1>
          <p className="orbit-role">{profile.role}<span> · </span>Java · Spring Boot · Angular</p>
          <p className="orbit-intro">
            I work across backend services, web applications, APIs, and data systems—building practical experience
            through enterprise software, internships, and full-stack projects.
          </p>
          <div className="orbit-actions">
            <a className="orbit-action-primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
            <a className="orbit-action-secondary" href={profile.resumeHref} download>Download résumé ↗</a>
          </div>
          <div className="orbit-quick-facts" aria-label="Career snapshot">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
        <div className="orbit-hero-footer"><span>SOFTWARE · SYSTEMS · CONTINUOUS LEARNING</span><a href="#journey"><i /> SCROLL TO EXPLORE</a><span className="orbit-scroll-hint">01 — 06 <b>↓</b></span></div>
      </section>

      <nav className="orbit-nav" aria-label="Portfolio sections">
        <a href="#journey">01 Journey</a>
        <a href="#work">02 Selected work</a>
        <a href="#toolkit">03 Toolkit</a>
        <a href="#approach">04 How I work</a>
        <a href="#background">05 Background</a>
        <a href="#contact">06 Contact</a>
      </nav>

      <div className="orbit-main">
        <section className="orbit-section" id="journey">
          <header className="orbit-section-heading">
            <span className="orbit-index">01 / THE JOURNEY</span>
            <h2>Experience, <em>in context.</em></h2>
            <p>A concise view of the roles and programs that have shaped my work so far.</p>
          </header>
          <div className="orbit-journey">
            <div className="orbit-journey-list" role="group" aria-label="Choose a role or program">
              {experience.map((item, index) => (
                <button
                  type="button"
                  aria-pressed={selectedExperience === index}
                  key={`${item.org}-${item.role}`}
                  onClick={() => setSelectedExperience(index)}
                >
                  <span className="orbit-journey-dot" />
                  <span className="orbit-journey-meta">{item.period}</span>
                  <strong>{item.role}</strong>
                  <small>{item.org}{item.type === 'virtual' ? ' · virtual experience' : ''}</small>
                </button>
              ))}
            </div>
            <article className="orbit-journey-detail" aria-live="polite">
              <span className={`orbit-status orbit-status-${currentExperience.type}`}>{currentExperience.type === 'employment' ? 'PROFESSIONAL ROLE' : currentExperience.type === 'internship' ? 'INTERNSHIP / PROGRAM' : 'VIRTUAL EXPERIENCE'}</span>
              <p className="orbit-detail-period">{currentExperience.period}</p>
              <h3>{currentExperience.role}</h3>
              <p className="orbit-detail-org">{currentExperience.org}</p>
              <ul>
                {currentExperience.bullets.filter((bullet) => !/TODO:/i.test(bullet)).map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <p className="orbit-note">
                {currentExperience.bullets.some((bullet) => /TODO:/i.test(bullet))
                  ? 'Specific simulation task details are omitted until confirmed. Virtual experience is not presented as employment.'
                  : 'Role descriptions reflect the résumé information provided. No company-confidential systems or unverified performance claims are included.'}
              </p>
            </article>
          </div>
        </section>

        <section className="orbit-section orbit-work-section" id="work">
          <div className="orbit-forge-glow" aria-hidden="true" />
          <header className="orbit-section-heading">
            <span className="orbit-index">02 / SELECTED WORK</span>
            <h2>Projects with <em>a purpose.</em></h2>
            <p>Built work, work in progress, and technical exploration are clearly distinguished.</p>
          </header>
          <div className="orbit-project-tabs" role="group" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                type="button"
                aria-pressed={selectedProject === index}
                key={project.slug}
                onClick={() => setSelectedProject(index)}
              >
                <span>0{index + 1}</span>{project.title}
              </button>
            ))}
          </div>
          <article className="orbit-project-feature" aria-live="polite">
            <div className="orbit-forge-sparks" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="orbit-project-art" aria-hidden="true">
              <span className="orbit-project-art-grid" />
              <div className={`project-visual project-visual-${currentProject.slug}`}>
                {currentProject.slug === 'e-doctor-appointment' && (
                  <svg viewBox="0 0 440 330" fill="none">
                    <rect x="38" y="34" width="364" height="262" rx="18" className="pv-window" />
                    <path d="M38 81h364" className="pv-rule" />
                    <circle cx="60" cy="57" r="4" className="pv-dot" /><circle cx="76" cy="57" r="4" className="pv-dot pv-dot-amber" /><circle cx="92" cy="57" r="4" className="pv-dot pv-dot-violet" />
                    <rect x="58" y="103" width="88" height="171" rx="10" className="pv-sidebar" />
                    <circle cx="83" cy="128" r="12" className="pv-avatar" />
                    <path d="M104 125h25M104 134h18M70 162h63M70 179h48M70 213h63M70 230h48" className="pv-rule" />
                    <text x="169" y="119" className="pv-eyebrow">APPOINTMENTS</text>
                    <text x="169" y="145" className="pv-heading">Your care, in sync.</text>
                    <rect x="169" y="162" width="208" height="44" rx="8" className="pv-card" />
                    <circle cx="191" cy="184" r="11" className="pv-avatar" />
                    <path d="M211 180h81M211 189h53" className="pv-rule" />
                    <rect x="169" y="216" width="208" height="44" rx="8" className="pv-card pv-card-active" />
                    <circle cx="191" cy="238" r="11" className="pv-avatar pv-avatar-warm" />
                    <path d="M211 234h81M211 243h53" className="pv-rule" />
                    <path d="m329 239 7 7 14-16" className="pv-check" />
                    <rect x="339" y="102" width="38" height="38" rx="11" className="pv-plus-box" />
                    <path d="M358 113v16m-8-8h16" className="pv-plus" />
                  </svg>
                )}
                {currentProject.slug === 'student-information-management' && (
                  <svg viewBox="0 0 440 330" fill="none">
                    <rect x="43" y="32" width="354" height="268" rx="18" className="pv-window" />
                    <path d="M43 80h354" className="pv-rule" />
                    <circle cx="65" cy="56" r="4" className="pv-dot" /><circle cx="81" cy="56" r="4" className="pv-dot pv-dot-amber" /><circle cx="97" cy="56" r="4" className="pv-dot pv-dot-violet" />
                    <text x="65" y="112" className="pv-eyebrow">STUDENT DIRECTORY</text>
                    <text x="65" y="137" className="pv-heading">One record. Clear view.</text>
                    <rect x="65" y="154" width="310" height="35" rx="7" className="pv-search" />
                    <circle cx="82" cy="171" r="5" className="pv-search-icon" /><path d="m86 175 6 6" className="pv-rule" />
                    <text x="102" y="175" className="pv-small">Find a student...</text>
                    <path d="M65 205h310" className="pv-rule" />
                    <circle cx="84" cy="228" r="12" className="pv-avatar" /><path d="M108 225h96M108 233h70" className="pv-rule" /><rect x="316" y="219" width="45" height="18" rx="9" className="pv-pill" />
                    <circle cx="84" cy="263" r="12" className="pv-avatar pv-avatar-warm" /><path d="M108 260h96M108 268h70" className="pv-rule" /><rect x="316" y="254" width="45" height="18" rx="9" className="pv-pill pv-pill-alt" />
                    <circle cx="350" cy="64" r="19" className="pv-avatar" /><path d="M344 64h12m-6-6v12" className="pv-plus" />
                  </svg>
                )}
                {currentProject.slug === 'edu-eats' && (
                  <svg viewBox="0 0 440 330" fill="none">
                    <path d="M42 234c51-60 90-52 132-100 35-40 76-45 125-13s62 14 99-26" className="pv-route" />
                    <circle cx="82" cy="196" r="33" className="pv-map-halo" /><circle cx="82" cy="196" r="13" className="pv-avatar pv-avatar-warm" />
                    <circle cx="300" cy="122" r="37" className="pv-map-halo pv-map-halo-purple" /><path d="M288 115h24v20h-24zM292 110v-7m16 7v-7" className="pv-store" />
                    <circle cx="336" cy="229" r="29" className="pv-map-halo" /><path d="M326 225h20l-3 15h-14l-3-15Zm3 0-3-8h-5m13 8v-5m6 5v-5" className="pv-bag" />
                    <rect x="62" y="40" width="316" height="58" rx="14" className="pv-window" />
                    <circle cx="91" cy="69" r="15" className="pv-avatar pv-avatar-warm" /><path d="m85 69 5-7 6 7-6 7-5-7Z" className="pv-food" />
                    <text x="118" y="65" className="pv-eyebrow">CAMPUS PICKUP</text>
                    <text x="118" y="83" className="pv-heading">Good food, closer.</text>
                    <rect x="137" y="172" width="126" height="51" rx="12" className="pv-window" />
                    <text x="153" y="193" className="pv-eyebrow">IN DEVELOPMENT</text>
                    <text x="153" y="210" className="pv-small">Campus food discovery</text>
                  </svg>
                )}
                {currentProject.slug === 'ai-agent-memory' && (
                  <svg viewBox="0 0 440 330" fill="none">
                    <circle cx="222" cy="164" r="100" className="pv-memory-ring" />
                    <circle cx="222" cy="164" r="70" className="pv-memory-ring pv-memory-ring-inner" />
                    <path d="M222 164 138 100M222 164l95-53M222 164l89 87M222 164l-83 82M222 164l-5-105" className="pv-memory-link" />
                    <circle cx="222" cy="164" r="28" className="pv-memory-core" />
                    <text x="206" y="169" className="pv-memory-text">AI</text>
                    <circle cx="138" cy="100" r="15" className="pv-memory-node" /><circle cx="317" cy="111" r="18" className="pv-memory-node pv-memory-node-alt" />
                    <circle cx="311" cy="251" r="13" className="pv-memory-node" /><circle cx="139" cy="246" r="19" className="pv-memory-node pv-memory-node-alt" />
                    <circle cx="217" cy="59" r="12" className="pv-memory-node" />
                    <text x="95" y="76" className="pv-eyebrow">RETRIEVAL</text>
                    <text x="311" y="79" className="pv-eyebrow">RELEVANCE</text>
                    <text x="125" y="288" className="pv-eyebrow">CONTEXT</text>
                    <rect x="69" y="29" width="302" height="272" rx="22" className="pv-frame" />
                    <text x="92" y="279" className="pv-small">Exploration · not a shipped product</text>
                  </svg>
                )}
              </div>
              <span className="orbit-project-art-code">{currentProject.stack.filter((item) => !/TODO:/i.test(item)).slice(0, 3).join(' / ')}</span>
              <span className="orbit-project-art-status">{currentProject.status.replace('-', ' ')}</span>
            </div>
            <div className="orbit-project-copy">
              <span className={`orbit-status orbit-status-${currentProject.status}`}>{currentProject.kind}</span>
              <h3>{currentProject.title}</h3>
              <p className="orbit-project-tagline">{currentProject.tagline}</p>
              <p>{currentProject.summary}</p>
              {currentProject.caseStudy && (
                <dl className="orbit-case-study">
                  {([
                    ['Problem space', currentProject.caseStudy.problem],
                    ['My contribution', currentProject.caseStudy.contribution],
                    ['Engineering challenge', currentProject.caseStudy.challenge],
                  ] as const).map(([label, text]) => confirmedText(text) && (
                    <div key={label}><dt>{label}</dt><dd>{confirmedText(text)}</dd></div>
                  ))}
                </dl>
              )}
              <div className="orbit-project-stack" aria-label="Project technologies">
                {currentProject.stack.filter((item) => !/TODO:/i.test(item)).map((item) => <span key={item}>{item}</span>)}
              </div>
              <ul className="orbit-project-features">
                {currentProject.features.filter((feature) => !/TODO:/i.test(feature)).slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              {currentProject.status === 'exploration' && <p className="orbit-note">This is an engineering exploration, not a shipped product. Experiments and outcomes are not presented as completed results.</p>}
            </div>
          </article>
        </section>

        <section className="orbit-section" id="toolkit">
          <header className="orbit-section-heading">
            <span className="orbit-index">03 / ENGINEERING TOOLKIT</span>
            <h2>Tools are useful <em>in combination.</em></h2>
            <p>Explore the technologies and practices from my résumé, grouped by the kind of work they support.</p>
          </header>
          <div className="orbit-toolkit">
            <div className="orbit-skill-groups" role="group" aria-label="Choose a technology area">
              {toolkitSkillGroups.map((group, index) => (
                <button
                  type="button"
                  aria-pressed={selectedSkillGroup === index}
                  key={group.name}
                  onClick={() => setSelectedSkillGroup(index)}
                >
                  <span>0{index + 1}</span><strong>{group.name}</strong><small>{group.skills.length} technologies</small>
                </button>
              ))}
            </div>
            <article className="orbit-skill-detail" aria-live="polite">
              <span className="orbit-status orbit-status-professional">CAPABILITY AREA · {String(selectedSkillGroup + 1).padStart(2, '0')}</span>
              <h3>{currentSkillGroup.name}</h3>
              <p>{currentSkillGroup.description}</p>
              <ul>{currentSkillGroup.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              <p className="orbit-note">This is a map of technologies and familiarity areas, not a claim that every tool was used together or in every role.</p>
            </article>
          </div>
          <div className="orbit-delivery-line" aria-label="Conceptual software delivery flow">
            <span>UNDERSTAND</span><i>→</i><span>DESIGN &amp; BUILD</span><i>→</i><span>CONNECT DATA</span><i>→</i><span>TEST &amp; DELIVER</span>
          </div>
          <p className="orbit-delivery-note">A general engineering workflow—not a description of one specific production system.</p>
        </section>

        <section className="orbit-section orbit-approach-section" id="approach">
          <header className="orbit-section-heading">
            <span className="orbit-index">04 / HOW I WORK</span>
            <h2>Reliable software is <em>a team effort.</em></h2>
            <p>My résumé highlights hands-on work across development, integration, debugging, and collaborative delivery.</p>
          </header>
          <div className="orbit-practice-grid">
            {achievements.slice(0, 5).map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="orbit-practice-ribbon">
            <p>ENGINEERING THEMES</p>
            <div>{['Backend / frontend integration', 'Production debugging', 'Secure coding awareness', 'Automated testing', 'Event-driven systems', 'Code reviews & Agile'].map((theme) => <span key={theme}>{theme}</span>)}</div>
          </div>
        </section>

        <section className="orbit-section orbit-background-section" id="background">
          <header className="orbit-section-heading">
            <span className="orbit-index">05 / BACKGROUND</span>
            <h2>Learning is part of <em>the trajectory.</em></h2>
            <p>Education and learning programs, with formal credentials kept distinct from courses and simulations.</p>
          </header>
          <div className="orbit-background-grid">
            <div className="orbit-education">
              <h3>Education</h3>
              {education.map((item) => (
                <article key={item.level}>
                  <span>{item.level}</span><strong>{item.score}</strong>
                  <p>{item.institution}</p>{item.detail && <small>{item.detail}</small>}
                </article>
              ))}
            </div>
            <div className="orbit-credentials">
              <h3>Courses &amp; programs</h3>
              <p className="orbit-note">Titles are listed as provided; verification links can be added when certificate details are confirmed.</p>
              {credentials.map((item) => (
                <article key={`${item.issuer}-${item.title}`}>
                  <span className={`orbit-credential-kind kind-${item.kind}`}>{item.kind === 'professional' ? 'CREDENTIAL' : item.kind === 'simulation' ? 'SIMULATION' : 'COURSE'}</span>
                  <div><strong>{item.title}</strong><small>{item.issuer}</small></div>
                  <span className="orbit-credential-check" aria-label={item.verified ? 'Verified' : 'Verification not yet confirmed'}>{item.verified ? '✓' : '·'}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="orbit-profile-summary">
            <span className="orbit-index">A LITTLE MORE CONTEXT</span>
            <div>{profile.summary.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}</div>
          </div>
        </section>

        <section className="orbit-contact" id="contact">
          <div className="orbit-contact-orbit" aria-hidden="true"><span>LET’S<br />CONNECT</span></div>
          <div className="orbit-contact-copy">
            <span className="orbit-index">06 / NEXT CONNECTION</span>
            <h2>Good work starts<br />with <em>a conversation.</em></h2>
            <p>Interested in software engineering, full-stack development, or building dependable products? I’d be glad to connect.</p>
            <div className="orbit-contact-links">
              <a href={`mailto:${profile.email}`}>Email me <span>↗</span></a>
              {profile.links.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label} <span>↗</span></a>)}
              <a href={profile.resumeHref} download>Résumé <span>↓</span></a>
            </div>
          </div>
        </section>
      </div>

      <footer className="orbit-footer">
        <a href="#orbit-title">SEKHAR VISHAL <span>·</span></a>
        <p>{profile.role} · Portfolio, projects, and engineering journey.</p>
        <a href="#orbit-title">BACK TO TOP ↑</a>
      </footer>
    </article>
  )
}
