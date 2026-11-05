import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useTheme } from '../app/theme'
import { useDeviceTier } from '../hooks/useDeviceTier'
import { AvatarStatue } from './AvatarStatue'
import { CameraPathPreview, CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { ParticleField } from './ParticleField'

const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')

/**
 * Persistent canvas. It lives in the root layout, so route changes swap only the
 * HTML layer and the WebGL context is never torn down.
 *
 * React context does not cross the R3F reconciler boundary, so theme and tier
 * values are read out here and passed into the canvas children as plain props.
 */
export default function Scene() {
  const { sceneTheme } = useTheme()
  const { settings } = useDeviceTier()

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        shadows={settings.shadows}
        dpr={settings.dpr}
        camera={{ fov: 50, near: 0.1, far: 100, position: [0, 1.2, 6.2] }}
        gl={{ antialias: !settings.postprocessing, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <color attach="background" args={[sceneTheme.background]} />
        <fog attach="fog" args={[sceneTheme.fog, sceneTheme.fogNear, sceneTheme.fogFar]} />

        <ambientLight intensity={sceneTheme.ambient} />
        <directionalLight
          castShadow={settings.shadows}
          color={sceneTheme.keyLight}
          intensity={sceneTheme.keyLightIntensity}
          position={[8, 14, 6]}
          shadow-mapSize={[settings.shadowMapSize, settings.shadowMapSize]}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={14}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0004}
        />

        <Suspense fallback={null}>
          {/* Procedural lightformers: no network fetch, rendered once (frames=1). */}
          <Environment resolution={64} frames={1} environmentIntensity={sceneTheme.envIntensity}>
            <Lightformer form="rect" intensity={4} position={[0, 6, 6]} scale={[10, 4, 1]} />
            <Lightformer form="rect" intensity={2} position={[-8, 2, -2]} rotation-y={Math.PI / 2} scale={[8, 6, 1]} />
            <Lightformer form="ring" intensity={3} position={[6, 8, -6]} scale={6} color={sceneTheme.keyLight} />
          </Environment>
          <AvatarStatue theme={sceneTheme} />
        </Suspense>

        <ParticleField count={settings.particles} color={sceneTheme.dust} />
        <CameraRig />
        {DEBUG && <CameraPathPreview />}
        <Effects settings={settings} theme={sceneTheme} />
      </Canvas>
    </div>
  )
}
