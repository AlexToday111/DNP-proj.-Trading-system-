interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-line bg-shell px-6 py-10 text-center">
      <p className="text-lg font-semibold tracking-[-0.04em] text-text">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    </div>
  )
}
