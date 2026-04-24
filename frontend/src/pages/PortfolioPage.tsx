import { HeroPortfolioCard } from '../components/dashboard/HeroPortfolioCard'
import { PortfolioTrendCard } from '../components/charts/PortfolioTrendCard'
import { PortfolioHoldingsTable } from '../components/tables/PortfolioHoldingsTable'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCompactCurrency, formatCurrency } from '../lib/utils'
import { type PortfolioSnapshot } from '../types/trading'

interface PortfolioPageProps {
  currentSnapshot: PortfolioSnapshot
  portfolioSeries: PortfolioSnapshot[]
  fillRatio: number
}

export function PortfolioPage({
  currentSnapshot,
  portfolioSeries,
  fillRatio
}: PortfolioPageProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-12">
        <HeroPortfolioCard
          snapshots={portfolioSeries}
          currentSnapshot={currentSnapshot}
          fillRatio={fillRatio}
          className="xl:col-span-5"
        />
        <PortfolioTrendCard snapshots={portfolioSeries} className="xl:col-span-7" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Portfolio value" value={formatCurrency(currentSnapshot.totalValue)} detail="Cash plus marked-to-market positions" />
        <MetricCard label="Cash balance" value={formatCompactCurrency(currentSnapshot.cashBalance)} detail="Immediate buying power" />
        <MetricCard label="Market value" value={formatCompactCurrency(currentSnapshot.marketValue)} detail="Open exposure in the book" />
        <MetricCard label="Realized PnL" value={formatCurrency(currentSnapshot.realizedPnl)} detail="Closed-trade contribution" />
      </div>

      <PortfolioHoldingsTable rows={currentSnapshot.positions} />
    </div>
  )
}
