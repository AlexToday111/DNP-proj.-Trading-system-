interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`surface-card p-5 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-24 rounded-full bg-line" />
        <div className="h-10 w-40 rounded-2xl bg-line" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full bg-line ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  )
}
