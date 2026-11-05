import type { Material } from 'three'

/** Shared uniform: world-space height above which fragments are discarded. */
export interface ClipUniform {
  value: number
}

interface PatchableShader {
  uniforms: Record<string, unknown>
  vertexShader: string
  fragmentShader: string
}

/** Pure string patch (separated so it can be unit-tested without a GL context). */
export function patchClipShader(shader: PatchableShader, uniform: ClipUniform): void {
  shader.uniforms.uClipY = uniform
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying float vClipY;')
    .replace('#include <project_vertex>', '#include <project_vertex>\nvClipY = (modelMatrix * vec4(transformed, 1.0)).y;')
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform float uClipY;\nvarying float vClipY;')
    .replace(
      '#include <clipping_planes_fragment>',
      '#include <clipping_planes_fragment>\nif (vClipY > uClipY) discard;',
    )
}

/**
 * Vertical clipping plane at shader level: raising `uniform.value` reveals the
 * model from the bottom up with no per-part opacity or scale animation.
 */
export function applyClipShader(material: Material, uniform: ClipUniform): void {
  material.onBeforeCompile = (shader) => patchClipShader(shader, uniform)
  material.customProgramCacheKey = () => 'statue-clip-y'
  material.needsUpdate = true
}
