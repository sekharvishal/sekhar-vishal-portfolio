import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { HomePageCity } from '../pages/HomePageCity'
import { NotFound } from '../pages/NotFound'
import { ProjectPage } from '../pages/ProjectPage'
import { Layout } from './Layout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="city" element={<HomePageCity />} />
        <Route path="projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
