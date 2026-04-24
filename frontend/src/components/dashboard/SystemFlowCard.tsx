export function SystemFlowCard({ className = '' }: { className?: string }) {
  const steps = [
    'market-data-service',
    'market-data',
    'strategy-service',
    'signals',
    'trading-core',
    'orders',
    'execution-sim-service',
    'execution-result',
    'portfolio API'
  ]

  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      <div className="border-b border-line pb-5">
        <p className="eyebrow">Distributed flow</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
          Event-driven service path
        </h3>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`rounded-full px-4 py-2 text-sm font-semibold ${
              index % 2 === 0 ? 'bg-shell text-text' : 'bg-accent-soft text-accent'
            }`}>
              {step}
            </div>
            {index < steps.length - 1 ? <span className="text-muted">→</span> : null}
          </div>
        ))}
      </div>
    </section>
  )
}
