import { DataTable } from './DataTable'
import { formatCurrency, formatPercent, formatTime, toneFromNumber } from '../../lib/utils'
import { type Position } from '../../types/trading'

export function PortfolioHoldingsTable({ rows }: { rows: Position[] }) {
  return (
    <DataTable
      caption="Portfolio holdings table"
      rows={rows}
      rowKey={(row) => row.symbol}
      emptyTitle="No open positions"
      emptyDescription="Open positions from the portfolio service will appear here."
      columns={[
        { header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
        { header: 'Qty', align: 'right', render: (row) => <span className="mono-data">{row.quantity}</span> },
        { header: 'Avg entry', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.averageEntryPrice)}</span> },
        { header: 'Latest price', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.latestPrice)}</span> },
        { header: 'Market value', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.marketValue)}</span> },
        {
          header: 'Unrealized PnL',
          align: 'right',
          render: (row) => (
            <span className={`mono-data ${toneFromNumber(row.unrealizedPnl) === 'negative' ? 'text-negative' : 'text-positive'}`}>
              {formatCurrency(row.unrealizedPnl)}
            </span>
          )
        },
        { header: 'Weight', align: 'right', render: (row) => <span className="mono-data">{formatPercent(row.weight * 100)}</span> },
        { header: 'Updated', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.updatedAt)}</span> }
      ]}
    />
  )
}
