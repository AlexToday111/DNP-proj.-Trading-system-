import { type ReactNode } from 'react'

interface AppLayoutProps {
  isOverview: boolean
  sidebar: ReactNode
  topbar: ReactNode
  children: ReactNode
}

export function AppLayout({ isOverview, sidebar, topbar, children }: AppLayoutProps) {
  return (
    <div className={`relative min-h-screen bg-canvas ${isOverview ? 'xl:h-screen xl:overflow-hidden' : 'overflow-hidden'}`}>
      <div
        className={`mx-auto grid max-w-[1500px] gap-0 px-0 xl:grid-cols-[214px_minmax(0,1fr)] ${
          isOverview ? 'min-h-screen xl:h-screen xl:min-h-0 xl:overflow-hidden' : 'min-h-screen'
        }`}
      >
        <div className={isOverview ? 'xl:h-full xl:min-h-0' : 'xl:sticky xl:top-0 xl:h-screen'}>
          {sidebar}
        </div>
        <div className={`min-w-0 ${isOverview ? 'xl:min-h-0 xl:overflow-hidden' : ''}`}>
          <div className={isOverview ? 'flex h-full min-h-0 flex-col xl:overflow-hidden' : 'min-h-screen'}>
            {topbar}
            <main
              aria-live="polite"
              className={isOverview ? 'min-w-0 px-5 pb-5 pt-5 xl:min-h-0 xl:flex-1 xl:overflow-auto' : 'min-w-0 px-5 pb-8 pt-5'}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
