import { type ReactNode } from 'react'

interface AppLayoutProps {
  isOverview: boolean
  sidebar: ReactNode
  topbar: ReactNode
  children: ReactNode
}

export function AppLayout({ isOverview, sidebar, topbar, children }: AppLayoutProps) {
  return (
    <div className={`relative min-h-screen ${isOverview ? 'xl:h-screen xl:overflow-hidden' : 'overflow-hidden'}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/60 to-transparent" />
      <div
        className={`mx-auto grid max-w-[1600px] gap-5 px-4 py-4 sm:px-6 lg:px-8 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-6 xl:py-6 ${
          isOverview ? 'min-h-screen xl:h-screen xl:min-h-0 xl:overflow-hidden' : 'min-h-screen'
        }`}
      >
        <div className={isOverview ? 'xl:h-full xl:min-h-0' : 'xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]'}>
          {sidebar}
        </div>
        <div className={`min-w-0 ${isOverview ? 'xl:min-h-0 xl:overflow-hidden' : ''}`}>
          <div className={isOverview ? 'flex h-full min-h-0 flex-col gap-4 xl:overflow-hidden' : 'space-y-5'}>
            {topbar}
            <main
              aria-live="polite"
              className={isOverview ? 'min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-hidden' : 'min-w-0'}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
