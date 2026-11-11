import { act, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FrontierPage } from '../src/pages/FrontierPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FrontierPage', () => {
  it('presents the portfolio as one continuous, scroll-led visual atlas', () => {
    render(<FrontierPage />)

    expect(screen.getByRole('heading', { name: /Between signal & system/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The world inside a chip/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Two states. Endless logic/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Small board. Big purpose/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Make the invisible move/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Across the distance/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Notice the change. Correct the course/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The layers meet in software/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Find the signal in the noise/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Detect the nearby signal/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /From firmware to silicon/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /A foundation in ECE/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Build, test, connect/ })).toBeInTheDocument()
    expect(document.querySelectorAll('.frontier-story-scene')).toHaveLength(12)
    expect(document.querySelectorAll('.frontier-svg')).toHaveLength(12)
    expect(document.querySelectorAll('.frontier-kinetic-orbit')).toHaveLength(24)
    expect(document.querySelectorAll('.frontier-kinetic-particles i')).toHaveLength(144)
    expect(document.querySelectorAll('.frontier-visual-reticles i')).toHaveLength(48)
    expect(document.querySelectorAll('.frontier-domain-nav, .frontier-topic-nav, .frontier-stage')).toHaveLength(0)
    expect(document.querySelectorAll('.frontier-page button')).toHaveLength(0)
    for (const chapterId of ['silicon', 'logic', 'embedded', 'signals', 'communications', 'control', 'software', 'denoising', 'phone-detector', 'internships', 'education', 'toolkit']) {
      const scene = document.getElementById(chapterId)
      expect(scene).toHaveClass('frontier-story-scene')
      expect(scene?.querySelector('.frontier-scene-visual')).toBeInTheDocument()
      expect(scene?.querySelector('.frontier-scene-story')).toBeInTheDocument()
    }
    expect(screen.getAllByText(/GENERAL ENGINEERING CONCEPT · NOT A CLAIM OF PERSONAL HANDS-ON EXPERIENCE/)).toHaveLength(6)
  })

  it('updates the scroll progress indicator from the scene visible in the viewport', () => {
    let callback: IntersectionObserverCallback | undefined
    const observe = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(nextCallback: IntersectionObserverCallback) {
        callback = nextCallback
      }

      observe = observe
      disconnect = vi.fn()
    })

    render(<FrontierPage />)

    expect(observe).toHaveBeenCalledTimes(12)
    expect(document.getElementById('embedded')?.style.getPropertyValue('--scroll-depth')).not.toBe('')
    expect(document.getElementById('embedded')?.style.getPropertyValue('--back-depth')).not.toBe('')
    act(() => {
      callback?.(
        [{
          boundingClientRect: new DOMRect(),
          intersectionRect: new DOMRect(),
          isIntersecting: true,
          intersectionRatio: .8,
          rootBounds: null,
          target: document.getElementById('embedded') as HTMLElement,
          time: performance.now(),
        }],
        {} as IntersectionObserver,
      )
    })

    expect(within(screen.getByRole('complementary', { name: 'Scroll progress' })).getByText('03')).toBeInTheDocument()
  })

  it('retains the project, internship, education, certification, and contact details in the scroll story', () => {
    render(<FrontierPage />)

    expect(screen.getByText('Unpaired Image Denoising in Digital Images')).toBeInTheDocument()
    expect(screen.getByText(/No benchmark, numerical performance result, or dataset name was supplied/)).toBeInTheDocument()
    expect(screen.getByText('Mobile Phone Detector using the LM358')).toBeInTheDocument()
    expect(screen.getByText(/No measured accuracy or specific application was supplied/)).toBeInTheDocument()
    expect(screen.getByText('EduSkills · virtual internship')).toBeInTheDocument()
    expect(screen.getByText('SkillDzire · virtual internship')).toBeInTheDocument()
    expect(screen.getByText('Mother Theresa Institute of Engineering and Technology')).toBeInTheDocument()
    expect(screen.getByText('TCS iON Career Edge – Young Professional')).toBeInTheDocument()
    expect(screen.getByText('15-635/1, Saravanapuram, Chittoor, Andhra Pradesh')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download résumé ↓' })).toHaveAttribute('href', '/resume.pdf')
    expect(screen.getByRole('link', { name: 'LinkedIn ↗' })).toHaveAttribute('href', 'https://linkedin.com/in/sekhar-vishal-0501602b1')
    expect(screen.getByRole('link', { name: 'GitHub ↗' })).toHaveAttribute('href', 'https://github.com/sekharvishal')
  })

  it('keeps the professional role separate from the general ECE explainers', () => {
    render(<FrontierPage />)

    expect(screen.getByText('Full Stack Java Developer')).toBeInTheDocument()
    expect(screen.getByText('SecureW2 · Professional experience · approx. 1 year')).toBeInTheDocument()
  })
})
