import { type ChangeEvent } from 'react'

interface SelectFilter {
  label: string
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
}

interface FilterBarProps {
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  filters?: SelectFilter[]
}

export function FilterBar({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters = []
}: FilterBarProps) {
  return (
    <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="min-w-[220px] flex-1">
        <span className="sr-only">Search</span>
        <input
          type="search"
          className="control-input"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
        />
      </label>

      {filters.map((filter) => (
        <label key={filter.label} className="flex flex-col gap-1">
          <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {filter.label}
          </span>
          <select
            className="control-select min-w-[160px]"
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
