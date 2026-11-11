import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { HomePageCity } from '../pages/HomePageCity'
import { NotFound } from '../pages/NotFound'
import { ProjectPage } from '../pages/ProjectPage'
import { NexusPage } from '../pages/NexusPage'
import { ToolkitPage } from '../pages/ToolkitPage'
import { FrontierPage } from '../pages/FrontierPage'
import { UniversePage } from '../universe/UniversePage'
import { Layout } from './Layout'

export function AppRoutes() {
  return (
    <Routes>
      {/* The Universe is a self-contained experience: it owns its canvas and chrome, so it sits outside Layout. */}
      <Route index element={<UniversePage />} />
      <Route element={<Layout />}>
        <Route path="statue" element={<HomePage />} />
        <Route path="city" element={<HomePageCity />} />
        <Route path="toolkit" element={<ToolkitPage />} />
        <Route path="nexus" element={<NexusPage />} />
        <Route path="frontier" element={<FrontierPage />} />
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
