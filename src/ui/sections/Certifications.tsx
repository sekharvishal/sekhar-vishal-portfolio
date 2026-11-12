import { credentials } from '../../data/content'
import type { CredentialKind } from '../../data/types'
import { Section } from '../Section'

const KIND_LABEL: Record<CredentialKind, string> = {
  professional: 'Professional certification',
  course: 'Course / learning program',
  simulation: 'Virtual job simulation',
}

export function Certifications() {
  return (
    <Section id="certifications" eyebrow="05 &middot; Credentials" title="Certifications & learning" wide>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {credentials.map((c) => (
          <li key={c.title} className="flex flex-col rounded-2xl border border-line/15 p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-gold">{KIND_LABEL[c.kind]}</p>
            <h3 className="mt-1 text-xl leading-snug">{c.title}</h3>
            <p className="text-sm text-fg">{c.issuer}</p>
            <p className="mt-2 text-sm text-muted">{c.summary}</p>
            <div className="mt-auto flex items-center gap-2 pt-3">
              {c.verifyUrl ? (
                <a className="chip pointer-events-auto text-gold" href={c.verifyUrl} target="_blank" rel="noreferrer noopener">
                  Verify credential
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
