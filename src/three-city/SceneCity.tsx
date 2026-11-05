import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useTheme } from '../app/theme'
import { useDeviceTier } from '../hooks/useDeviceTier'
import { CameraRigCity } from './CameraRigCity'
import { CityScape } from './CityScape'
import { EffectsCity } from './EffectsCity'
import { HeroBuildings } from './HeroBuildings'
import { VehicleRig } from './VehicleRig'

/**
 * Persistent canvas for the City Drive variant, mounted by `Layout.tsx` only
 * on the `/city` route (mutually exclusive with the statue's `Scene.tsx`).
 */
export default function SceneCity() {
  const { sceneTheme } = useTheme()
  const { settings } = useDeviceTier()

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        shadows={settings.shadows}
        dpr={settings.dpr}
        camera={{ fov: 55, near: 0.1, far: 240, position: [0, 3, 8] }}
        gl={{ antialias: !settings.postprocessing, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <color attach="background" args={[sceneTheme.background]} />
        <fog attach="fog" args={[sceneTheme.fog, 24, 150]} />

        <ambientLight intensity={sceneTheme.ambient * 0.5} />
        <directionalLight
          castShadow={settings.shadows}
          color={sceneTheme.keyLight}
          intensity={sceneTheme.keyLightIntensity}
          position={[30, 45, 20]}
          shadow-mapSize={[settings.shadowMapSize, settings.shadowMapSize]}
          shadow-camera-near={1}
          shadow-camera-far={200}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
          shadow-bias={-0.0004}
        />

        <Suspense fallback={null}>
          {/* Procedural lightformers (no network fetch): modest scale/intensity, same proportions as the statue scene's -- a dusk/night skyline reads as moody, not blown out. */}
          <Environment resolution={64} frames={1} environmentIntensity={sceneTheme.envIntensity * 0.4}>
            <Lightformer form="rect" intensity={2.5} position={[0, 8, -10]} scale={[12, 5, 1]} color={sceneTheme.keyLight} />
            <Lightformer form="rect" intensity={1.5} position={[-14, 5, -4]} rotation-y={Math.PI / 2} scale={[10, 6, 1]} color={sceneTheme.keyLight} />
            <Lightformer form="ring" intensity={2} position={[12, 10, -20]} scale={6} color={sceneTheme.keyLight} />
          </Environment>
          <CityScape theme={sceneTheme} tier={settings} />
          <HeroBuildings theme={sceneTheme} />
        </Suspense>

        <VehicleRig theme={sceneTheme} />
        <CameraRigCity />
        <EffectsCity settings={settings} />
      </Canvas>
    </div>
  )
}
