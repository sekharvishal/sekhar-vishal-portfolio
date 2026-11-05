import type { ProjectStatus } from '../data/types'

const LABELS: Record<ProjectStatus, string> = {
  shipped: 'Completed',
  'in-development': 'In Development',
  exploration: 'Technical Exploration',
}


export function StatusBadge({ status }: { status: ProjectStatus }) {
  const accent = status === 'shipped' ? 'border-gold/60 text-gold' : 'border-line/30 text-muted'
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] ${accent}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${status === 'shipped' ? 'bg-gold' : 'bg-muted'}`} />
      {LABELS[status]}
    </span>
  )
}
