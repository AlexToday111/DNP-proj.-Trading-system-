import { DataTable } from './DataTable'
import { formatCurrency, formatPercent, toneFromNumber } from '../../lib/utils'
import { type Position } from '../../types/trading'

export function PortfolioHoldingsTable({ rows }: { rows: Position[] }) {
  return (
    <DataTable
      caption="Portfolio holdings table"
      rows={rows}
      rowKey={(row) => row.symbol}
      emptyTitle="No open positions"
      emptyDescription="Once fills land, the portfolio page will show current holdings and unrealized PnL here."
      columns={[
        { header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
        { header: 'Qty', align: 'right', render: (row) => <span className="mono-data">{row.quantity}</span> },
        { header: 'Avg entry', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.averageEntry)}</span> },
        { header: 'Market price', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.marketPrice)}</span> },
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
        { header: 'Weight', align: 'right', render: (row) => <span className="mono-data">{formatPercent(row.weight * 100)}</span> }
      ]}
    />
  )
}
