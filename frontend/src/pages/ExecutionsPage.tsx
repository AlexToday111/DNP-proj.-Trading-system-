import { useDeferredValue, useMemo, useState } from 'react'
import { ExecutionSlippageCard } from '../components/charts/ExecutionSlippageCard'
import { ExecutionsTable } from '../components/tables/ExecutionsTable'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { formatSignedBasisPoints } from '../lib/utils'
import { type Execution } from '../types/trading'

interface ExecutionsPageProps {
  executions: Execution[]
}

export function ExecutionsPage({ executions }: ExecutionsPageProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const avgSlippage =
    executions.reduce((accumulator, execution) => accumulator + execution.slippageBps, 0) /
    Math.max(executions.length, 1)

  const rows = useMemo(
    () =>
      [...executions]
        .reverse()
        .filter((execution) => {
          const haystack = `${execution.executionId} ${execution.orderId} ${execution.symbol} ${execution.venue}`.toLowerCase()
          return haystack.includes(deferredQuery.toLowerCase())
        }),
    [deferredQuery, executions]
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Executions" value={String(executions.length)} detail="Simulated fills visible in replay" />
        <MetricCard label="Average slippage" value={formatSignedBasisPoints(Number(avgSlippage.toFixed(1)))} detail="Lower is better for buy-side entries" />
        <MetricCard label="Venues" value={String(new Set(executions.map((execution) => execution.venue)).size)} detail="Execution destinations used by simulator" />
      </div>

      <ExecutionSlippageCard executions={executions} />

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by execution id, order id, symbol, or venue"
        onSearchChange={setQuery}
      />

      <ExecutionsTable rows={rows} />
    </div>
  )
}
