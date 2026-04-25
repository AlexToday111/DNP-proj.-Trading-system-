import { DataTable } from './DataTable'
import { formatCurrency, formatTime } from '../../lib/utils'
import { type Execution } from '../../types/trading'

export function ExecutionsTable({ rows }: { rows: Execution[] }) {
  return (
    <DataTable
      caption="Executions table"
      rows={rows}
      rowKey={(row) => row.executionId}
      emptyTitle="No executions yet"
      emptyDescription="Execution results from trading-core will appear here after orders are filled."
      columns={[
        { header: 'Execution', render: (row) => <span className="mono-data">{row.executionId}</span> },
        { header: 'Order', render: (row) => <span className="mono-data">{row.orderId}</span> },
        { header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
        {
          header: 'Side',
          render: (row) => (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              row.side === 'BUY' ? 'bg-accent-soft text-positive' : 'bg-warning/10 text-warning'
            }`}>
              {row.side}
            </span>
          )
        },
        { header: 'Qty', align: 'right', render: (row) => <span className="mono-data">{row.quantity}</span> },
        { header: 'Price', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.executedPrice)}</span> },
        { header: 'Status', render: (row) => row.status },
        { header: 'Market Event', render: (row) => <span className="mono-data">{row.marketDataEventId ?? '—'}</span> },
        { header: 'Time', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.timestamp)}</span> }
      ]}
    />
  )
}
