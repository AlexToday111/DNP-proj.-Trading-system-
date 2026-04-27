import { useEffect, useState, type ReactNode } from 'react'
import { AppIcon } from '../ui/AppIcon'

interface AppLayoutProps {
  desktopSidebar: ReactNode
  mobileSidebar: ReactNode
  topbar: ReactNode
  children: ReactNode
  isMobileSidebarOpen: boolean
  onCloseMobileSidebar: () => void
}

export function AppLayout({
  desktopSidebar,
  mobileSidebar,
  topbar,
  children,
  isMobileSidebarOpen,
  onCloseMobileSidebar
}: AppLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div
        className={`fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm transition xl:hidden ${
          isMobileSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMobileSidebarOpen}
        onClick={onCloseMobileSidebar}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] transition-transform xl:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileSidebarOpen}
      >
        {mobileSidebar}
      </div>
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-0 px-0 xl:grid-cols-[214px_minmax(0,1fr)]">
        <div className="hidden xl:sticky xl:top-0 xl:block xl:h-screen">{desktopSidebar}</div>
        <div className="min-h-screen min-w-0">
          {topbar}
          <main aria-live="polite" className="min-w-0 px-5 pb-8 pt-5">
            {children}
          </main>
        </div>
      </div>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-text shadow-card transition sm:bottom-6 sm:right-6 xl:bottom-8 xl:right-8 ${
          showScrollTop
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <AppIcon name="chevron-up" className="h-5 w-5" />
      </button>
    </div>
  )
}
