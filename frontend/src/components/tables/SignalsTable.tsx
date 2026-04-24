import { DataTable } from './DataTable'
import { formatCurrency, formatTime } from '../../lib/utils'
import { type Signal } from '../../types/trading'

export function SignalsTable({ rows }: { rows: Signal[] }) {
  return (
    <DataTable
      caption="Signals table"
      rows={rows}
      rowKey={(row) => row.signalId}
      emptyTitle="No signals yet"
      emptyDescription="Strategy output will appear here as the replay advances."
      columns={[
        { header: 'Signal', render: (row) => <span className="mono-data">{row.signalId}</span> },
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
        { header: 'Target', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.targetPrice)}</span> },
        { header: 'Reason', render: (row) => row.reason },
        { header: 'Time', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.timestamp)}</span> }
      ]}
    />
  )
}
