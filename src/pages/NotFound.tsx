import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 id="nf-title" className="mt-4 text-5xl">
        This floor does not exist
      </h1>
      <p className="mt-3 text-muted">The page you are looking for has not been built (yet).</p>
      <Link to="/" className="btn btn-solid mt-8">
        Back to the tower
      </Link>
    </section>
  )
}
