import { Fragment } from 'react'

/** Masked word-by-word rise-in. Screen readers get the full sentence once. */
export function SplitWords({
  text,
  className,
  delay = 0,
  step = 0.05,
}: {
  text: string
  className?: string
  delay?: number
  step?: number
}) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="uni-word" aria-hidden="true">
            <span style={{ animationDelay: `${delay + i * step}s` }}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
