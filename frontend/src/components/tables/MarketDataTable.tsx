import { DataTable } from './DataTable'
import { formatCompactNumber, formatCurrency, formatTime } from '../../lib/utils'
import { type MarketTick } from '../../types/trading'

export function MarketDataTable({ rows }: { rows: MarketTick[] }) {
  return (
    <DataTable
      caption="Market data table"
      rows={rows}
      rowKey={(row) => row.eventId}
      emptyTitle="No market data yet"
      emptyDescription="Market data from trading-core will appear here when the backend starts publishing ticks."
      columns={[
        { header: 'Event', render: (row) => <span className="mono-data">{row.eventId}</span> },
        { header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
        { header: 'Price', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.price)}</span> },
        { header: 'Volume', align: 'right', render: (row) => <span className="mono-data">{formatCompactNumber(row.volume)}</span> },
        { header: 'Time', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.timestamp)}</span> }
      ]}
    />
  )
}
