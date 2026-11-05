import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D, Texture } from 'three'
import { describe, expect, it, vi } from 'vitest'
import { patchClipShader } from '../src/three/clipShader'
import { disposeGeometry, disposeMaterial, disposeObject } from '../src/three/disposal'

describe('disposal helpers', () => {
  it('disposeMaterial disposes the material and its textures', () => {
    const map = new Texture()
    const normalMap = new Texture()
    const material = new MeshStandardMaterial({ map, normalMap })
    const spies = [vi.spyOn(map, 'dispose'), vi.spyOn(normalMap, 'dispose'), vi.spyOn(material, 'dispose')]

    disposeMaterial(material)

    spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1))
  })

  it('disposeMaterial handles material arrays', () => {
    const a = new MeshStandardMaterial()
    const b = new MeshStandardMaterial()
    const spyA = vi.spyOn(a, 'dispose')
    const spyB = vi.spyOn(b, 'dispose')
    disposeMaterial([a, b])
    expect(spyA).toHaveBeenCalled()
    expect(spyB).toHaveBeenCalled()
  })

  it('disposeGeometry accepts a single geometry or a list', () => {
    const one = new BoxGeometry()
    const list = [new BoxGeometry(), new BoxGeometry()]
    const spies = [vi.spyOn(one, 'dispose'), ...list.map((g) => vi.spyOn(g, 'dispose'))]
    disposeGeometry(one)
    disposeGeometry(list)
    spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1))
  })

  it('disposeObject traverses the tree and disposes every mesh resource', () => {
    const root = new Object3D()
    const child = new Object3D()
    const geometry = new BoxGeometry()
    const material = new MeshStandardMaterial()
    const mesh = new Mesh(geometry, material)
    child.add(mesh)
    root.add(child)
    const geometrySpy = vi.spyOn(geometry, 'dispose')
    const materialSpy = vi.spyOn(material, 'dispose')

    disposeObject(root)

    expect(geometrySpy).toHaveBeenCalledTimes(1)
    expect(materialSpy).toHaveBeenCalledTimes(1)
  })
})

describe('clip shader patch', () => {
  it('injects the uniform, varying and discard into the shaders', () => {
    const uniform = { value: 3 }
    const shader = {
      uniforms: {} as Record<string, unknown>,
      vertexShader: '#include <common>\nvoid main(){\n#include <project_vertex>\n}',
      fragmentShader: '#include <common>\nvoid main(){\n#include <clipping_planes_fragment>\n}',
    }
    patchClipShader(shader, uniform)
    expect(shader.uniforms.uClipY).toBe(uniform)
    expect(shader.vertexShader).toContain('varying float vClipY;')
    expect(shader.vertexShader).toContain('vClipY = (modelMatrix * vec4(transformed, 1.0)).y;')
    expect(shader.fragmentShader).toContain('uniform float uClipY;')
    expect(shader.fragmentShader).toContain('if (vClipY > uClipY) discard;')
  })
})
