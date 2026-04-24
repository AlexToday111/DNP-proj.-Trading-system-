import { DataTable } from './DataTable'
import { formatCurrency, formatSignedBasisPoints, formatTime, toneFromNumber } from '../../lib/utils'
import { type Execution } from '../../types/trading'

export function ExecutionsTable({ rows }: { rows: Execution[] }) {
  return (
    <DataTable
      caption="Executions table"
      rows={rows}
      rowKey={(row) => row.executionId}
      emptyTitle="No executions yet"
      emptyDescription="Simulated fills will appear here once orders are matched by the execution service."
      columns={[
        { header: 'Execution', render: (row) => <span className="mono-data">{row.executionId}</span> },
        { header: 'Order', render: (row) => <span className="mono-data">{row.orderId}</span> },
        { header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
        { header: 'Venue', render: (row) => row.venue },
        { header: 'Qty', align: 'right', render: (row) => <span className="mono-data">{row.quantity}</span> },
        { header: 'Price', align: 'right', render: (row) => <span className="mono-data">{formatCurrency(row.executedPrice)}</span> },
        {
          header: 'Slippage',
          align: 'right',
          render: (row) => (
            <span className={`mono-data ${toneFromNumber(-row.slippageBps) === 'negative' ? 'text-negative' : 'text-positive'}`}>
              {formatSignedBasisPoints(row.slippageBps)}
            </span>
          )
        },
        { header: 'Time', align: 'right', render: (row) => <span className="mono-data">{formatTime(row.timestamp)}</span> }
      ]}
    />
  )
}
