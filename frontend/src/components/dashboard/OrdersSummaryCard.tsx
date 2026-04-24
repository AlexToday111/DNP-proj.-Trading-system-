interface OrdersSummaryCardProps {
  totalOrders: number
  openOrders: number
  totalExecutions: number
  fillRatio: number
  className?: string
}

export function OrdersSummaryCard({
  totalOrders,
  openOrders,
  totalExecutions,
  fillRatio,
  className = ''
}: OrdersSummaryCardProps) {
  return (
    <section className={`surface-card panel-fixed p-5 sm:p-6 ${className}`}>
      <p className="eyebrow">Orders summary</p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
        Flow from signal to fill
      </h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Orders</p>
          <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {totalOrders}
          </p>
        </div>
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">In flight</p>
          <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {openOrders}
          </p>
        </div>
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Executions</p>
          <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {totalExecutions}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-line bg-shell p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-text">Fill ratio</p>
          <p className="mono-data text-base text-text">{fillRatio}%</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${fillRatio}%` }}
          />
        </div>
      </div>
    </section>
  )
}
