import { useEffect, useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { EmptyState } from './components/ui/EmptyState'
import { useDashboardState } from './hooks/useDashboardState'
import { useFirstPageVisit } from './hooks/useFirstPageVisit'
import { ExecutionsPage } from './pages/ExecutionsPage'
import { MarketDataPage } from './pages/MarketDataPage'
import { OrdersPage } from './pages/OrdersPage'
import { OverviewPage } from './pages/OverviewPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SignalsPage } from './pages/SignalsPage'
import { SystemHealthPage } from './pages/SystemHealthPage'

function App() {
  const dashboard = useDashboardState()
  const isFirstPageVisit = useFirstPageVisit(dashboard.activePage)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [dashboard.activePage])

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileSidebarOpen])

  const handleNavigate = (page: Parameters<typeof dashboard.goToPage>[0]) => {
    dashboard.goToPage(page)
    setIsMobileSidebarOpen(false)
  }

  const page = (() => {
    switch (dashboard.activePage) {
      case 'overview':
        return (
          <OverviewPage
            isBooting={dashboard.isBooting}
            portfolio={dashboard.portfolioSnapshot}
            services={dashboard.services}
            marketData={dashboard.dashboardMarketData}
            signals={dashboard.dashboardSignals}
            orders={dashboard.dashboardOrders}
            executions={dashboard.dashboardExecutions}
            activity={dashboard.recentActivity}
          />
        )
      case 'market-data':
        return (
          <MarketDataPage
            animateOnMount={isFirstPageVisit}
            symbol={dashboard.selectedSymbol}
            ticks={dashboard.marketData}
            history={dashboard.marketHistory}
            currentTick={dashboard.currentTick}
            sessionMovePct={dashboard.sessionMovePct}
          />
        )
      case 'signals':
        return <SignalsPage signals={dashboard.signals} latestSignal={dashboard.latestSignal} />
      case 'orders':
        return (
          <OrdersPage
            orders={dashboard.orders}
            fillRatio={dashboard.fillRatio}
            openOrders={dashboard.openOrders}
            totalExecutions={dashboard.executions.length}
          />
        )
      case 'executions':
        return (
          <ExecutionsPage
            executions={dashboard.executions}
            latestExecution={dashboard.latestExecution}
          />
        )
      case 'portfolio':
        return (
          <PortfolioPage
            currentSnapshot={dashboard.portfolioSnapshot}
            positions={dashboard.positions}
          />
        )
      case 'system-health':
        return (
          <SystemHealthPage
            services={dashboard.services}
            activity={dashboard.recentActivity}
          />
        )
      default:
        return null
    }
  })()

  return (
    <AppLayout
      desktopSidebar={
        <Sidebar
          activePage={dashboard.activePage}
          status={dashboard.effectiveStatus}
          onNavigate={handleNavigate}
        />
      }
      mobileSidebar={
        <Sidebar
          activePage={dashboard.activePage}
          status={dashboard.effectiveStatus}
          onNavigate={handleNavigate}
          mode="mobile"
        />
      }
      topbar={
        <TopBar
          activePage={dashboard.activePage}
          selectedSymbol={dashboard.selectedSymbol}
          status={dashboard.effectiveStatus}
          symbols={dashboard.symbols}
          onSelectSymbol={dashboard.setSymbol}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />
      }
      isMobileSidebarOpen={isMobileSidebarOpen}
      onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
    >
      {dashboard.error ? (
        <EmptyState
          title={dashboard.effectiveStatus === 'disconnected' ? 'Backend unavailable' : 'Data unavailable'}
          description={`${dashboard.error}. API base URL: ${dashboard.apiBaseUrl}`}
        />
      ) : (
        page
      )}
    </AppLayout>
  )
}

export default App
