import { useDeferredValue, useMemo, useState } from 'react'
import { ExecutionsTable } from '../components/tables/ExecutionsTable'
import { EmptyState } from '../components/ui/EmptyState'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrency } from '../lib/utils'
import { type Execution } from '../types/trading'

interface ExecutionsPageProps {
  executions: Execution[]
  latestExecution: Execution | null
}

export function ExecutionsPage({ executions, latestExecution }: ExecutionsPageProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () =>
      [...executions]
        .reverse()
        .filter((execution) => {
          const haystack = `${execution.executionId} ${execution.orderId} ${execution.symbol} ${execution.status}`.toLowerCase()
          return haystack.includes(deferredQuery.toLowerCase())
        }),
    [deferredQuery, executions]
  )

  const averagePrice =
    executions.reduce((accumulator, execution) => accumulator + execution.executedPrice, 0) /
    Math.max(executions.length, 1)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Executions" value={String(executions.length)} detail="Execution results returned by backend" />
        <MetricCard label="Average price" value={formatCurrency(averagePrice)} detail="Average execution price in current result set" />
        <MetricCard label="Latest status" value={latestExecution?.status ?? '—'} detail={latestExecution ? latestExecution.executionId : 'No executions yet'} />
      </div>

      {latestExecution ? (
        <section className="surface-card p-5 sm:p-6">
          <p className="eyebrow">Latest execution</p>
          <div className="mt-3 grid gap-4 md:grid-cols-4">
            <MetricCard label="Execution" value={latestExecution.executionId} detail={`Order ${latestExecution.orderId}`} />
            <MetricCard label="Symbol" value={latestExecution.symbol} detail={latestExecution.side} />
            <MetricCard label="Quantity" value={String(latestExecution.quantity)} detail="Filled quantity" />
            <MetricCard label="Price" value={formatCurrency(latestExecution.executedPrice)} detail={latestExecution.status} />
          </div>
        </section>
      ) : (
        <EmptyState title="No execution snapshot" description="The latest execution card will appear after the first filled order." />
      )}

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by execution id, order id, symbol, or status"
        onSearchChange={setQuery}
      />

      <ExecutionsTable rows={rows} />
    </div>
  )
}
