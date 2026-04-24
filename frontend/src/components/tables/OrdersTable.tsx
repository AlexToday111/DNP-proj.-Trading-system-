import { DataTable } from './DataTable'
import { formatCurrency, formatTime } from '../../lib/utils'
import { type Order } from '../../types/trading'

export function OrdersTable({ rows }: { rows: Order[] }) {
  return (
    <DataTable
      caption="Orders table"
      rows={rows}
      rowKey={(row) => row.orderId}
      emptyTitle="No orders yet"
      emptyDescription="Orders created by trading-core will appear here as signals are promoted."
      columns={[
        { header: 'Order', render: (row) => <span className="mono-data">{row.orderId}</span> },
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
        { header: 'Requested', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.requestedPrice)}</span> },
        { header: 'Status', render: (row) => row.status },
        { header: 'Time', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.timestamp)}</span> }
      ]}
    />
  )
}
