import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes'
import { SmoothScroll } from './app/SmoothScroll'
import { ThemeProvider } from './app/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScroll>
          <AppRoutes />
        </SmoothScroll>
      </BrowserRouter>
    </ThemeProvider>
  )
}
