import { type ReactElement, type SVGProps } from 'react'

export type AppIconName =
  | 'activity'
  | 'bar-chart'
  | 'bell'
  | 'briefcase'
  | 'card'
  | 'database'
  | 'dollar'
  | 'gauge'
  | 'line-chart'
  | 'list'
  | 'pause'
  | 'play'
  | 'reset'
  | 'search'
  | 'settings'
  | 'signal'
  | 'wallet'

interface AppIconProps extends SVGProps<SVGSVGElement> {
  name: AppIconName
}

const paths: Record<AppIconName, ReactElement> = {
  activity: (
    <>
      <path d="M3 12h4l2.2-6 4.2 12L16 12h5" />
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    </>
  ),
  'bar-chart': (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  briefcase: (
    <>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path d="M4 7h16v12H4z" />
      <path d="M4 12h16" />
    </>
  ),
  card: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </>
  ),
  dollar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12" />
      <path d="M15 8.5c-.7-.5-1.7-.8-3-.8-2 0-3 .9-3 2.2 0 3.2 6 1.5 6 5 0 1.5-1.2 2.4-3.2 2.4-1.2 0-2.3-.3-3.2-.9" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 14a8 8 0 0 1 16 0" />
      <path d="M12 14l4-5" />
      <path d="M6.5 19h11" />
    </>
  ),
  'line-chart': (
    <>
      <path d="M3 19h18" />
      <path d="M4 15l4-4 4 3 7-8" />
      <path d="M19 6v5h-5" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </>
  ),
  pause: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8v8" />
      <path d="M14 8v8" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8l6 4-6 4z" />
    </>
  ),
  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v4h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  settings: (
    <>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.08 1.65V21a2 2 0 1 1-4 0v-.09A1.8 1.8 0 0 0 8.8 19.26a1.8 1.8 0 0 0-1.98.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.8 1.8 0 0 0 4.35 15a1.8 1.8 0 0 0-1.65-1.08H2.6a2 2 0 1 1 0-4h.09A1.8 1.8 0 0 0 4.35 8.8a1.8 1.8 0 0 0-.36-1.98l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.8 1.8 0 0 0 1.98.36h0A1.8 1.8 0 0 0 9.88 2.7V2.6a2 2 0 1 1 4 0v.09a1.8 1.8 0 0 0 1.08 1.65h0a1.8 1.8 0 0 0 1.98-.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.8 1.8 0 0 0-.36 1.98v0A1.8 1.8 0 0 0 21.1 9.88h.3a2 2 0 1 1 0 4h-.3A1.8 1.8 0 0 0 19.4 15z" />
    </>
  ),
  signal: (
    <>
      <path d="M4 18h.01" />
      <path d="M8 18a4 4 0 0 0-4-4" />
      <path d="M12 18a8 8 0 0 0-8-8" />
      <path d="M16 18A12 12 0 0 0 4 6" />
      <path d="M20 18A16 16 0 0 0 4 2" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7h14a2 2 0 0 1 2 2v9H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z" />
    </>
  )
}

export function AppIcon({ name, className = '', ...props }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="20"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
