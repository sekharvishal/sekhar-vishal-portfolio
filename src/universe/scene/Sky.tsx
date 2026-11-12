import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, Color, Vector2, type Mesh } from 'three'
import { livePalette } from '../palettes'
import { SKY_FRAG, SKY_VERT } from '../shaders'
import { universe } from '../universeStore'

/** Nebula + aurora dome that follows the camera and re-tints per chapter. */
export function Sky({ octaves, lite = false }: { octaves: number; lite?: boolean }) {
  const mesh = useRef<Mesh>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uA: { value: new Color() },
      uB: { value: new Color() },
      uC: { value: new Color() },
      uMouse: { value: new Vector2() },
      uTap: { value: new Vector2() },
      uTapT: { value: 99 },
      uRes: { value: new Vector2(1, 1) },
    }),
    [],
  )

  useFrame((state, delta) => {
    mesh.current?.position.copy(state.camera.position)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uProgress.value = universe.smooth
    uniforms.uA.value.copy(livePalette.a)
    uniforms.uB.value.copy(livePalette.b)
    uniforms.uC.value.copy(livePalette.c)
    uniforms.uMouse.value.set(universe.mouseX, universe.mouseY)
    // gl_FragCoord is in device pixels, so match it with the drawing-buffer size, not CSS pixels.
    state.gl.getDrawingBufferSize(uniforms.uRes.value)
    if (universe.tapPending) {
      universe.tapPending = false
      uniforms.uTap.value.set(universe.tapX, universe.tapY)
      uniforms.uTapT.value = 0
    } else if (uniforms.uTapT.value < 5) {
      uniforms.uTapT.value += Math.min(delta, 0.1)
    }
  })

  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[900, 40, 28]} />
      <shaderMaterial
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        uniforms={uniforms}
        defines={lite ? { FBM_OCT: octaves, SKY_LITE: 1 } : { FBM_OCT: octaves }}
        side={BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
