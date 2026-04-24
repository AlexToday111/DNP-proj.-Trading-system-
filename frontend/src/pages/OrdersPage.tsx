import { useDeferredValue, useMemo, useState } from 'react'
import { OrdersSummaryCard } from '../components/dashboard/OrdersSummaryCard'
import { OrdersTable } from '../components/tables/OrdersTable'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { type Order } from '../types/trading'

interface OrdersPageProps {
  orders: Order[]
  fillRatio: number
  openOrders: number
  totalExecutions: number
}

export function OrdersPage({
  orders,
  fillRatio,
  openOrders,
  totalExecutions
}: OrdersPageProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () =>
      [...orders]
        .reverse()
        .filter((order) => {
          const matchesStatus = status === 'all' || order.status === status
          const haystack = `${order.orderId} ${order.signalId} ${order.symbol}`.toLowerCase()
          return matchesStatus && haystack.includes(deferredQuery.toLowerCase())
        }),
    [deferredQuery, orders, status]
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Orders" value={String(orders.length)} detail="Trading-core intents visible" />
          <MetricCard label="In flight" value={String(openOrders)} detail="Orders waiting for a final state" />
          <MetricCard label="Filled" value={String(totalExecutions)} detail="Executions completed by simulator" />
        </div>
        <OrdersSummaryCard
          totalOrders={orders.length}
          openOrders={openOrders}
          totalExecutions={totalExecutions}
          fillRatio={fillRatio}
        />
      </div>

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by order id, signal id, or symbol"
        onSearchChange={setQuery}
        filters={[
          {
            label: 'Status',
            value: status,
            onChange: setStatus,
            options: [
              { label: 'All statuses', value: 'all' },
              { label: 'Placed', value: 'PLACED' },
              { label: 'Routed', value: 'ROUTED' },
              { label: 'Filled', value: 'FILLED' }
            ]
          }
        ]}
      />

      <OrdersTable rows={rows} />
    </div>
  )
}
