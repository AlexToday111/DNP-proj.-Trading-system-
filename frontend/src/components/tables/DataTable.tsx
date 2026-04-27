import { type ReactNode } from 'react'
import { EmptyState } from '../ui/EmptyState'

export interface DataTableColumn<T> {
  header: string
  align?: 'left' | 'right'
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  caption: string
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyTitle: string
  emptyDescription: string
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  emptyTitle,
  emptyDescription
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="scroll-shell">
        <table className="min-w-full w-max border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-shell/80">
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted whitespace-nowrap ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line last:border-b-0 hover:bg-shell/70">
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-5 py-4 align-top text-sm text-text ${
                      column.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
