import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, Color, Vector2, type Mesh } from 'three'
import { livePalette } from '../palettes'
import { SKY_FRAG, SKY_VERT } from '../shaders'
import { universe } from '../universeStore'

/** Nebula + aurora dome that follows the camera and re-tints per chapter. */
export function Sky({ octaves }: { octaves: number }) {
  const mesh = useRef<Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uA: { value: new Color() },
      uB: { value: new Color() },
      uC: { value: new Color() },
      uMouse: { value: new Vector2() },
    }),
    [],
  )

  useFrame((state) => {
    mesh.current?.position.copy(state.camera.position)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uProgress.value = universe.smooth
    uniforms.uA.value.copy(livePalette.a)
    uniforms.uB.value.copy(livePalette.b)
    uniforms.uC.value.copy(livePalette.c)
    uniforms.uMouse.value.set(universe.mouseX, universe.mouseY)
  })

  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[900, 40, 28]} />
      <shaderMaterial
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        uniforms={uniforms}
        defines={{ FBM_OCT: octaves }}
        side={BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
