export type ProjectStatus = 'shipped' | 'in-development' | 'exploration'

export interface CaseStudy {
  problem: string
  contribution: string
  challenge: string
  result?: string
}

export interface Project {
  slug: string
  title: string
  tagline: string
  status: ProjectStatus
  kind: string
  summary: string
  /** Stack entries equal to `TODO: confirm` are rendered as a visible reminder. */
  stack: string[]
  features: string[]
  links?: { repo?: string; demo?: string }
  caseStudy?: CaseStudy
}

export type CredentialKind = 'professional' | 'course' | 'simulation'

export interface Credential {
  title: string
  issuer: string
  kind: CredentialKind
  summary: string
  verifyUrl?: string
  /** `false` until the exact title / ID has been confirmed against the certificate. */
  verified: boolean
}

export interface ExperienceItem {
  role: string
  org: string
  period: string
  type: 'employment' | 'internship' | 'virtual'
  bullets: string[]
}

export interface SkillGroup {
  name: string
  description?: string
  skills: string[]
}

export interface EducationItem {
  level: string
  institution: string
  detail?: string
  score: string
}

export interface Achievement {
  title: string
  body: string
}

export interface Stat {
  value: string
  label: string
  note: string
}

export interface Profile {
  name: string
  role: string
  stackLine: string
  headline: string
  subheadline: string
  summary: string[]
  email: string
  links: { label: string; href: string }[]
  resumeHref: string
}
