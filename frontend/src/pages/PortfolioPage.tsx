import { PortfolioHoldingsTable } from '../components/tables/PortfolioHoldingsTable'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCompactCurrency, formatCurrency } from '../lib/utils'
import { type PortfolioSnapshot, type Position } from '../types/trading'

interface PortfolioPageProps {
  currentSnapshot: PortfolioSnapshot
  positions: Position[]
}

export function PortfolioPage({ currentSnapshot, positions }: PortfolioPageProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Portfolio value" value={formatCurrency(currentSnapshot.totalPortfolioValue)} detail="Cash plus marked-to-market positions" />
        <MetricCard label="Cash" value={formatCompactCurrency(currentSnapshot.cash)} detail="Immediate buying power" />
        <MetricCard label="Position value" value={formatCompactCurrency(currentSnapshot.totalPositionValue)} detail="Current market value of open positions" />
        <MetricCard label="Realized PnL" value={formatCurrency(currentSnapshot.realizedPnl)} detail="Closed-trade contribution" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Unrealized PnL" value={formatCurrency(currentSnapshot.unrealizedPnl)} detail="Open position contribution" />
        <MetricCard label="Total PnL" value={formatCurrency(currentSnapshot.totalPnl)} detail="Realized plus unrealized result" />
        <MetricCard label="Positions" value={String(positions.length)} detail={`Updated ${currentSnapshot.updatedAt || '—'}`} />
      </div>

      <PortfolioHoldingsTable rows={positions} />
    </div>
  )
}
