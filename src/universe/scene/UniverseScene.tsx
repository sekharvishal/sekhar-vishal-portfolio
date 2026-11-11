import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useDeviceTier, type DeviceTier } from '../../hooks/useDeviceTier'
import { STAR_Z_FAR, STAR_Z_NEAR } from '../worldLayout'
import { ArchiveRing } from './ArchiveRing'
import { CameraRig } from './CameraRig'
import { CoreArtifact } from './CoreArtifact'
import { DustCloud } from './DustCloud'
import { JourneyTunnel } from './JourneyTunnel'
import { NameParticles } from './NameParticles'
import { ProjectPortals } from './ProjectPortals'
import { Sky } from './Sky'
import { SkillConstellation } from './SkillConstellation'
import { UniverseEffects } from './UniverseEffects'

interface Budget {
  stars: number
  name: number
  coreDust: number
  skyOctaves: number
  post: boolean
  maxDpr: number
}

const BUDGETS: Record<DeviceTier, Budget> = {
  high: { stars: 9000, name: 11000, coreDust: 1800, skyOctaves: 5, post: true, maxDpr: 1.75 },
  medium: { stars: 5000, name: 7000, coreDust: 1000, skyOctaves: 4, post: true, maxDpr: 1.5 },
  low: { stars: 2200, name: 3800, coreDust: 500, skyOctaves: 3, post: false, maxDpr: 1.25 },
}

const fillStars = (_: number, out: [number, number, number], rand: () => number) => {
  const a = rand() * Math.PI * 2
  const r = 7 + Math.pow(rand(), 0.65) * 110
  out[0] = Math.cos(a) * r
  out[1] = Math.sin(a) * r * 0.7
  out[2] = STAR_Z_NEAR + rand() * (STAR_Z_FAR - STAR_Z_NEAR)
}

const COMPACT_QUERY = '(max-width: 820px)'

function useCompact(): boolean {
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia(COMPACT_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const onChange = () => setCompact(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return compact
}

/** The single persistent WebGL canvas for the Universe. */
export default function UniverseScene() {
  const { tier } = useDeviceTier()
  const budget = BUDGETS[tier]
  const compact = useCompact()
  const [dpr, setDpr] = useState(budget.maxDpr)
  const onDecline = useCallback(() => setDpr((d) => Math.max(1, d - 0.25)), [])

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ fov: 55, near: 0.1, far: 2000, position: [0, 0, 84] }}
        gl={{ antialias: !budget.post, powerPreference: 'high-performance', alpha: false }}
        frameloop="always"
      >
        <color attach="background" args={['#04050a']} />
        <PerformanceMonitor onDecline={onDecline} />
        <Sky octaves={budget.skyOctaves} />
        <DustCloud count={budget.stars} fill={fillStars} seed={4} size={1} />
        <Suspense fallback={null}>
          <NameParticles maxPoints={budget.name} compact={compact} />
        </Suspense>
        <SkillConstellation />
        <ProjectPortals />
        <JourneyTunnel />
        <ArchiveRing />
        <CoreArtifact dust={budget.coreDust} />
        <CameraRig />
        {budget.post && <UniverseEffects />}
      </Canvas>
    </div>
  )
}
