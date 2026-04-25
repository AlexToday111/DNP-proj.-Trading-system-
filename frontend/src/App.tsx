import { AppLayout } from './components/layout/AppLayout'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { useDashboardState } from './hooks/useDashboardState'
import { useFirstPageVisit } from './hooks/useFirstPageVisit'
import { serviceHealth } from './data/mockTradingData'
import { ExecutionsPage } from './pages/ExecutionsPage'
import { MarketDataPage } from './pages/MarketDataPage'
import { OrdersPage } from './pages/OrdersPage'
import { OverviewPage } from './pages/OverviewPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SettingsPage } from './pages/SettingsPage'
import { SignalsPage } from './pages/SignalsPage'
import { SystemHealthPage } from './pages/SystemHealthPage'

function App() {
  const dashboard = useDashboardState()
  const isFirstPageVisit = useFirstPageVisit(dashboard.activePage)

  const page = (() => {
    switch (dashboard.activePage) {
      case 'overview':
        return (
          <OverviewPage
            animateOnMount={isFirstPageVisit}
            isBooting={dashboard.isBooting}
            instrument={dashboard.selectedInstrument}
            currentTick={dashboard.currentTick}
            sessionMovePct={dashboard.sessionMovePct}
            selectedTicks={dashboard.selectedTicks}
            position={dashboard.activePosition}
            currentSnapshot={dashboard.portfolioSnapshot}
            portfolioSeries={dashboard.portfolioSeries}
            latestSignal={dashboard.latestSignal}
            services={serviceHealth}
            activity={dashboard.recentActivity}
            totalOrders={dashboard.visibleOrders.length}
            openOrders={dashboard.openOrders}
            totalExecutions={dashboard.visibleExecutions.length}
            fillRatio={dashboard.fillRatio}
          />
        )
      case 'market-data':
        return (
          <MarketDataPage
            animateOnMount={isFirstPageVisit}
            instrument={dashboard.selectedInstrument}
            ticks={dashboard.selectedTicks}
            currentTick={dashboard.currentTick}
            sessionMovePct={dashboard.sessionMovePct}
          />
        )
      case 'signals':
        return (
          <SignalsPage
            signals={dashboard.visibleSignals}
            latestSignal={dashboard.latestSignal}
          />
        )
      case 'orders':
        return (
          <OrdersPage
            orders={dashboard.visibleOrders}
            fillRatio={dashboard.fillRatio}
            openOrders={dashboard.openOrders}
            totalExecutions={dashboard.visibleExecutions.length}
          />
        )
      case 'executions':
        return (
          <ExecutionsPage
            animateOnMount={isFirstPageVisit}
            executions={dashboard.visibleExecutions}
          />
        )
      case 'portfolio':
        return (
          <PortfolioPage
            animateOnMount={isFirstPageVisit}
            currentSnapshot={dashboard.portfolioSnapshot}
            portfolioSeries={dashboard.portfolioSeries}
            fillRatio={dashboard.fillRatio}
          />
        )
      case 'system-health':
        return (
          <SystemHealthPage
            services={serviceHealth}
            activity={dashboard.recentActivity}
          />
        )
      case 'settings':
        return (
          <SettingsPage
            settings={dashboard.settings}
            onUpdateSetting={dashboard.updateSetting}
          />
        )
      default:
        return null
    }
  })()

  return (
    <AppLayout
      isOverview={dashboard.activePage === 'overview'}
      sidebar={
        <Sidebar
          activePage={dashboard.activePage}
          status={dashboard.effectiveStatus}
          timestamp={dashboard.currentTick.timestamp}
          onNavigate={dashboard.goToPage}
        />
      }
      topbar={
        <TopBar
          activePage={dashboard.activePage}
          isOverview={dashboard.activePage === 'overview'}
          selectedSymbol={dashboard.selectedSymbol}
          status={dashboard.effectiveStatus}
          onSelectSymbol={dashboard.setSymbol}
          onToggleSimulation={dashboard.toggleSimulation}
          onResetView={dashboard.resetView}
        />
      }
    >
      {page}
    </AppLayout>
  )
}

export default App
