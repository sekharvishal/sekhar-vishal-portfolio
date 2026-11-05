import { profile } from '../../data/content'
import { Section } from '../Section'

export function Contact() {
  return (
    <Section id="contact" eyebrow="08 &middot; Contact" title="Let us build something reliable">
      <p className="max-w-xl text-lg text-muted">
        Open to full-stack Java roles and engineering conversations. The quickest way to reach me is email.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="btn btn-solid" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        {profile.links.map((l) => (
          <a key={l.label} className="btn" href={l.href} target="_blank" rel="noreferrer noopener">
            {l.label}
          </a>
        ))}
        <a className="btn" href={profile.resumeHref} download>
          R&eacute;sum&eacute;
        </a>
      </div>
    </Section>
  )
}
