import { type ReactNode } from 'react'

interface AppLayoutProps {
  sidebar: ReactNode
  topbar: ReactNode
  children: ReactNode
}

export function AppLayout({ sidebar, topbar, children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-0 px-0 xl:grid-cols-[214px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-0 xl:h-screen">{sidebar}</div>
        <div className="min-h-screen min-w-0">
          {topbar}
          <main aria-live="polite" className="min-w-0 px-5 pb-8 pt-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
